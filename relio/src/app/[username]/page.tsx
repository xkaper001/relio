import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioView from '@/components/PortfolioView'
import type { PortfolioConfig } from '@/types'

interface PageProps {
  params: Promise<{
    username: string
  }>
}

async function getPortfolio(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        portfolio: true,
      },
    })

    if (!user || !user.portfolio) {
      return null
    }

    // Check if temporary portfolio has expired
    if (user.isTemporary && user.expiresAt) {
      if (new Date() > user.expiresAt) {
        return null
      }
    }

    return {
      config: user.portfolio.config as unknown as PortfolioConfig,
      isTemporary: user.isTemporary,
      expiresAt: user.expiresAt,
      username: user.username,
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

export default async function PortfolioPage({ params }: PageProps) {
  const { username } = await params
  const portfolio = await getPortfolio(username)

  if (!portfolio) {
    notFound()
  }

  return <PortfolioView {...portfolio} />
}
