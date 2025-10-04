import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await req.json()

    if (!slug) {
      return NextResponse.json(
        { error: 'Portfolio slug is required' },
        { status: 400 }
      )
    }

    // Find the temporary portfolio
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        user: true,
      },
    })

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      )
    }

    // Check if it's a temporary portfolio
    if (!portfolio.user.isTemporary) {
      return NextResponse.json(
        { error: 'This portfolio is already saved' },
        { status: 400 }
      )
    }

    // Find or create the authenticated user
    const authenticatedUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Transfer the portfolio to the authenticated user
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: {
        userId: authenticatedUser.id,
      },
    })

    // Delete the temporary user
    await prisma.user.delete({
      where: { id: portfolio.userId },
    })

    // If this is the user's first portfolio, make it default
    const portfolioCount = await prisma.portfolio.count({
      where: { userId: authenticatedUser.id },
    })

    if (portfolioCount === 1) {
      await prisma.portfolio.update({
        where: { id: updatedPortfolio.id },
        data: { isDefault: true },
      })
    }

    return NextResponse.json({
      success: true,
      portfolio: updatedPortfolio,
    })
  } catch (error) {
    console.error('Claim portfolio error:', error)
    return NextResponse.json(
      { error: 'Failed to claim portfolio' },
      { status: 500 }
    )
  }
}
