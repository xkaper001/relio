import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioView from '@/components/PortfolioView'
import PortfolioViewAnimated from '@/components/PortfolioViewAnimated'
import type { PortfolioConfig } from '@/types'
import type { Metadata } from 'next'

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
      template: portfolio.template || 'default',
    }
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const portfolio = await getPortfolio(slug)

  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
    }
  }

  const portfolioName = portfolio.config.name || 'Portfolio'
  const portfolioTitle = portfolio.config.title || ''

  return {
    title: `${portfolioName}${portfolioTitle ? ` - ${portfolioTitle}` : ''} | Relio`,
    description: portfolio.config.about || `Check out ${portfolioName}'s professional portfolio`,
  }
}

export default async function PortfolioPage({ params }: PageProps) {
  const { slug } = await params
  const portfolio = await getPortfolio(slug)

  if (!portfolio) {
    notFound()
  }

  // Select template component based on portfolio.template
  const TemplateComponent = portfolio.template === 'animated' 
    ? PortfolioViewAnimated 
    : PortfolioView

  return <TemplateComponent {...portfolio} />
}
