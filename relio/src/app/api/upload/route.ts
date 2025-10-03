import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseResumeToPortfolio, selectAvatarForUser } from '@/lib/ai'
import { generateTempUsername } from '@/lib/utils'
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const formData = await req.formData()
    const file = formData.get('file') as File
    const isAnonymous = formData.get('anonymous') === 'true'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Extract text from file
    let resumeText = ''
    const buffer = Buffer.from(await file.arrayBuffer())

    if (file.type === 'application/pdf') {
      console.log('📄 Extracting text from PDF file:', file.name)
      const data = await pdfParse(buffer)
      resumeText = data.text
      console.log(`✅ PDF text extracted: ${resumeText.length} characters, ${data.numpages} pages`)
      console.log('📝 Preview:', resumeText)
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      console.log('📄 Extracting text from DOCX file:', file.name)
      const result = await mammoth.extractRawText({ buffer })
      resumeText = result.value
      console.log(`✅ DOCX text extracted: ${resumeText.length} characters`)
      console.log('📝 Preview:', resumeText)
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

    // Parse resume with AI
    const portfolioConfig = await parseResumeToPortfolio(resumeText)
    
    // Select intelligent avatar based on resume content
    const selectedAvatar = await selectAvatarForUser(portfolioConfig)
    console.log('🎨 Selected avatar:', selectedAvatar)

    // Handle anonymous vs authenticated user
    if (isAnonymous || !session) {
      // Create temporary user
      const tempUsername = generateTempUsername()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const user = await prisma.user.create({
        data: {
          username: tempUsername,
          isTemporary: true,
          expiresAt,
          avatar: selectedAvatar,
          portfolio: {
            create: {
              config: portfolioConfig as any,
            },
          },
        },
        include: {
          portfolio: true,
        },
      })

      return NextResponse.json({
        success: true,
        username: tempUsername,
        portfolio: user.portfolio,
        isTemporary: true,
        expiresAt: expiresAt.toISOString(),
      })
    } else {
      // Create/update portfolio for authenticated user
      const user = await prisma.user.findUnique({
        where: { email: session.user?.email! },
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Update avatar if user doesn't have one yet
      if (!user.avatar) {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar: selectedAvatar },
        })
      }

      const portfolio = await prisma.portfolio.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          config: portfolioConfig as any,
        },
        update: {
          config: portfolioConfig as any,
        },
      })

      return NextResponse.json({
        success: true,
        username: user.username,
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