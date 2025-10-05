import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseResumeToPortfolio, selectAvatarForUser } from '@/lib/ai'
import { generateTempUsername, generateUniqueSlug } from '@/lib/utils'
import { getDocumentProxy, extractText, extractLinks } from 'unpdf'
import mammoth from 'mammoth'

// Helper function to generate a globally unique slug
async function createUniqueSlug(baseName?: string): Promise<string> {
  let attempts = 0
  const maxAttempts = 10
  
  while (attempts < maxAttempts) {
    const slug = generateUniqueSlug(baseName)
    
    // Check if slug is available
    const existing = await prisma.portfolio.findUnique({
      where: { slug },
    })
    
    if (!existing) {
      return slug
    }
    
    attempts++
  }
  
  // Fallback: use timestamp-based slug
  return `portfolio-${Date.now()}-${Math.random().toString(36).substring(7)}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const formData = await req.formData()
    const file = formData.get('file') as File
    const isAnonymous = formData.get('anonymous') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Extract text and URLs from file
    let resumeText = ''
    let urls: string[] = []
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    if (file.type === 'application/pdf') {
      console.log('📄 Extracting text and URLs from PDF file:', file.name)
      
      // Get PDF document proxy first (prevents worker issues in Node.js)
      const pdf = await getDocumentProxy(uint8Array)
      
      // Extract text using unpdf
      const { text, totalPages } = await extractText(pdf, { mergePages: true })
      resumeText = text
      
      // Extract URLs from PDF
      const { links } = await extractLinks(pdf)
      urls = links.filter(url => url && url.startsWith('http'))
      
      console.log(`✅ PDF text extracted: ${resumeText.length} characters, ${totalPages} pages`)
      console.log(`🔗 URLs found: ${urls.length}`, urls)
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      console.log('📄 Extracting text from DOCX file:', file.name)
      // mammoth needs Buffer, so convert back
      const buffer = Buffer.from(uint8Array)
      const result = await mammoth.extractRawText({ buffer })
      resumeText = result.value
      console.log(`✅ DOCX text extracted: ${resumeText.length} characters`)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      )
    }

    if (!resumeText || resumeText.trim().length < 50) {
      console.error('❌ Insufficient text extracted from file')
      return NextResponse.json(
        { error: 'Could not extract meaningful text from the file' },
        { status: 400 }
      )
    }

    // Parse resume with AI (including URLs found in the document)
    const portfolioConfig = await parseResumeToPortfolio(resumeText, urls)
    
    // Select intelligent avatar based on resume content
    const selectedAvatar = await selectAvatarForUser(portfolioConfig)
    console.log('🎨 Selected avatar:', selectedAvatar)

    // Handle anonymous vs authenticated user
    if (isAnonymous || !session) {
      // Create temporary user
      const tempUsername = generateTempUsername()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      // Generate unique slug from resume name or job title
      const slugBase = portfolioConfig.name || portfolioConfig.title
      const uniqueSlug = await createUniqueSlug(slugBase)

      const user = await prisma.user.create({
        data: {
          username: tempUsername,
          isTemporary: true,
          expiresAt,
          portfolios: {
            create: {
              slug: uniqueSlug,
              title: `${portfolioConfig.name}'s Portfolio`,
              avatar: selectedAvatar,
              isDefault: true,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              config: portfolioConfig as any,
            },
          },
        },
        include: {
          portfolios: true,
        },
      })

      return NextResponse.json({
        success: true,
        slug: uniqueSlug,
        portfolio: user.portfolios[0],
        isTemporary: true,
        expiresAt: expiresAt.toISOString(),
      })
    } else {
      // Create/update portfolio for authenticated user
      const userEmail = session.user?.email
      if (!userEmail) {
        return NextResponse.json({ error: 'Email not found in session' }, { status: 400 })
      }
      
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Generate unique slug from resume
      const slugBase = portfolioConfig.name || portfolioConfig.title
      const uniqueSlug = await createUniqueSlug(slugBase)

      // Create new portfolio with avatar
      const portfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          slug: uniqueSlug,
          title: `${portfolioConfig.name}'s Portfolio`,
          avatar: selectedAvatar,
          isDefault: false, // Will be set to true if it's the first one
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: portfolioConfig as any,
        },
      })

      // If this is the first portfolio, mark it as default
      const portfolioCount = await prisma.portfolio.count({
        where: { userId: user.id },
      })

      if (portfolioCount === 1) {
        await prisma.portfolio.update({
          where: { id: portfolio.id },
          data: { isDefault: true },
        })
      }

      return NextResponse.json({
        success: true,
        slug: uniqueSlug,
        portfolio,
        isTemporary: false,
      })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process resume',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}