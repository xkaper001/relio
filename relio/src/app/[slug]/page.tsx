import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioView from '@/components/PortfolioView'
import type { PortfolioConfig } from '@/types'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getPortfolio(slug: string) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        user: true,
      },
    })

    if (!portfolio) {
      return null
    }

    const user = portfolio.user

    // Check if temporary portfolio has expired
    if (user.isTemporary && user.expiresAt) {
      if (new Date() > user.expiresAt) {
        return null
      }
    }

    return {
      config: portfolio.config as unknown as PortfolioConfig,
      isTemporary: user.isTemporary,
      expiresAt: user.expiresAt,
      username: user.username,
      userImage: user.image,
      avatar: portfolio.avatar,
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

export default async function PortfolioPage({ params }: PageProps) {
  const { slug } = await params
  const portfolio = await getPortfolio(slug)

  if (!portfolio) {
    notFound()
  }

  return <PortfolioView {...portfolio} />
}
