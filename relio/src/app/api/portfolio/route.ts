import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug, config, title, template } = await req.json()

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Check if portfolio exists and belongs to user
    const existingPortfolio = await prisma.portfolio.findFirst({
      where: {
        slug,
        userId: session.user.id,
      },
    })

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found or does not belong to you' },
        { status: 404 }
      )
    }

    const portfolio = await prisma.portfolio.update({
      where: {
        id: existingPortfolio.id,
      },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: config as any,
        ...(title && { title }),
        ...(template && { template }),
      },
    })

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Portfolio update error:', error)
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (slug) {
      // Get specific portfolio by slug (must belong to user)
      const portfolio = await prisma.portfolio.findFirst({
        where: {
          slug,
          userId: session.user.id,
        },
      })

      if (!portfolio) {
        return NextResponse.json(
          { error: 'Portfolio not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ portfolio })
    } else {
      // Get all portfolios for user
      const portfolios = await prisma.portfolio.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      })

      return NextResponse.json({ portfolios })
    }
  } catch (error) {
    console.error('Portfolio fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug, title, config } = await req.json()

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Check if slug already exists globally
    const existing = await prisma.portfolio.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This slug is already taken. Please choose another.' },
        { status: 400 }
      )
    }

    // Check if this is the first portfolio (should be default)
    const portfolioCount = await prisma.portfolio.count({
      where: { userId: session.user.id },
    })

    const portfolio = await prisma.portfolio.create({
      data: {
        userId: session.user.id,
        slug,
        title: title || 'My Portfolio',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: config as any,
        isDefault: portfolioCount === 0,
      },
    })

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Portfolio creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.findFirst({
      where: {
        slug,
        userId: session.user.id,
      },
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // If deleting default portfolio, set another as default
    if (portfolio.isDefault) {
      const otherPortfolio = await prisma.portfolio.findFirst({
        where: {
          userId: session.user.id,
          slug: { not: slug },
        },
      })

      if (otherPortfolio) {
        await prisma.portfolio.update({
          where: { id: otherPortfolio.id },
          data: { isDefault: true },
        })
      }
    }

    await prisma.portfolio.delete({
      where: {
        id: portfolio.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Portfolio deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    )
  }
}
