import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const now = new Date()

    // Delete expired temporary users and their portfolios
    const result = await prisma.user.deleteMany({
      where: {
        isTemporary: true,
        expiresAt: {
          lt: now,
        },
      },
    })

    return NextResponse.json({
      message: `Deleted ${result.count} expired temporary users`,
      count: result.count,
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup expired users' },
      { status: 500 }
    )
  }
}
