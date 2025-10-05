'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Calendar,
  ExternalLink,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Code,
  User,
  Loader2
} from 'lucide-react'
import type { PortfolioConfig } from '@/types'

// Helper function to ensure URLs have proper protocol
const ensureHttps = (url: string): string => {
  if (!url) return url
  const trimmedUrl = url.trim()
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  return `https://${trimmedUrl}`
}

interface PortfolioViewProps {
  config: PortfolioConfig
  isTemporary: boolean
  expiresAt: Date | null
  username: string
  userImage?: string | null
  avatar?: string | null
}

export default function PortfolioView({ 
  config, 
  isTemporary, 
  expiresAt,
  username,
  userImage,
  avatar
}: PortfolioViewProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  // Default section order
  const DEFAULT_SECTION_ORDER = ['skills', 'experience', 'education', 'projects']
  const sectionOrder = config.sectionOrder || DEFAULT_SECTION_ORDER

  useEffect(() => {
    if (isTemporary && expiresAt) {
      const updateTimer = () => {
        const now = new Date().getTime()
        const expiry = new Date(expiresAt).getTime()
        const distance = expiry - now

        if (distance < 0) {
          setTimeLeft('Expired')
          return
        }

        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m remaining`)
      }

      updateTimer()
      const interval = setInterval(updateTimer, 60000)
      return () => clearInterval(interval)
    }
  }, [isTemporary, expiresAt])

  const handleSavePortfolio = async () => {
    // If user is not authenticated, redirect to signup with callbackUrl
    if (!session) {
      const currentPath = pathname || '/'
      await signIn(undefined, { callbackUrl: currentPath })
      return
    }

    // If user is authenticated, claim the portfolio
    setSaving(true)
    try {
      const slug = pathname?.split('/').pop()
      const response = await fetch('/api/claim-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })

      const data = await response.json()

      if (response.ok) {
        // Portfolio claimed successfully, redirect to dashboard
        router.push('/dashboard')
      } else {
        alert(data.error || 'Failed to save portfolio')
        setSaving(false)
      }
    } catch (error) {
      console.error('Error saving portfolio:', error)
      alert('An error occurred while saving the portfolio')
      setSaving(false)
    }
  }

  // Render individual sections
  const renderSection = (sectionKey: string, index: number) => {
    const isEven = index % 2 === 0
    const bgClass = isEven ? 'bg-muted/30' : ''

    switch (sectionKey) {
      case 'skills':
        if (!config.skills || config.skills.length === 0) return null
        return (
          <section key={sectionKey} className={`py-16 px-4 ${bgClass}`}>
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-8">
                <Code className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {config.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-background border border-border rounded-full text-foreground font-medium hover:border-primary transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )

      case 'experience':
        if (!config.experience || config.experience.length === 0) return null
        return (
          <section key={sectionKey} className={`py-16 px-4 ${bgClass}`}>
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-8">
                <Briefcase className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Experience</h2>
              </div>
              <div className="space-y-8">
                {config.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {exp.position}
                        </h3>
                        <p className="text-lg text-primary font-medium">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm whitespace-nowrap">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{exp.description}</p>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'education':
        if (!config.education || config.education.length === 0) return null
        return (
          <section key={sectionKey} className={`py-16 px-4 ${bgClass}`}>
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Education</h2>
              </div>
              <div className="space-y-6">
                {config.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-lg text-primary font-medium">{edu.institution}</p>
                        {edu.gpa && (
                          <p className="text-muted-foreground mt-2">GPA: {edu.gpa}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm whitespace-nowrap">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      case 'projects':
        if (!config.projects || config.projects.length === 0) return null
        return (
          <section key={sectionKey} className={`py-16 px-4 ${bgClass}`}>
            <div className="container mx-auto max-w-5xl">
              <div className="flex items-center gap-3 mb-8">
                <Code className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Projects</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {config.projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project.link && (
                        <a
                          href={ensureHttps(project.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={ensureHttps(project.github)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary hover:underline text-sm"
                        >
                          <Github className="w-4 h-4" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Temporary Portfolio Banner */}
      {isTemporary && (
        <div className="bg-primary/10 border-b border-primary/20 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  ⚠️ This portfolio will be deleted in {timeLeft}. Sign up to save permanently.
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handleSavePortfolio}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save My Portfolio'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Hero Content */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
                {config.name}
              </h1>
              <p className="text-2xl sm:text-3xl text-primary font-medium">
                {config.title}
              </p>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {config.about}
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap items-start gap-6 pt-4">
                {config.email && (
                  <a 
                    href={`mailto:${config.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{config.email}</span>
                  </a>
                )}
                {config.phone && (
                  <a 
                    href={`tel:${config.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-sm">{config.phone}</span>
                  </a>
                )}
                {config.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">{config.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-4">
                {config.linkedin && (
                  <a
                    href={ensureHttps(config.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 text-primary" />
                  </a>
              )}
              {config.github && (
                <a
                  href={ensureHttps(config.github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Github className="w-5 h-5 text-primary" />
                </a>
              )}
              {config.website && (
                <a
                  href={ensureHttps(config.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-5 h-5 text-primary" />
                </a>
              )}
            </div>
          </div>

          {/* Right Side - Avatar/Profile Image */}
          <div className="flex items-center justify-center lg:justify-end">
            {(userImage || avatar) && (
              <div className="relative">
                <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={userImage || avatar!}
                    alt={config.name}
                    width={448}
                    height={448}
                    className="object-contain w-full h-full"
                  />
                </div>
                {/* Decorative gradient background */}
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-3xl -z-10 blur-2xl" />
              </div>
            )}
            {!userImage && !avatar && (
              <div className="relative">
                <div className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-3xl overflow-hidden bg-muted flex items-center justify-center shadow-2xl">
                  <User className="w-32 h-32 text-muted-foreground" />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-3xl -z-10 blur-2xl" />
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* Dynamic Sections in Custom Order */}
      {sectionOrder.map((sectionKey, index) => renderSection(sectionKey, index))}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-muted-foreground">
            Created with{' '}
            <Link href="/" className="text-primary hover:underline font-medium" style={{ fontFamily: 'var(--font-array)' }}>
              RELIO
            </Link>
            {' '}- Turn your resume into a portfolio in seconds
          </p>
          {!isTemporary && (
            <p className="text-sm text-muted-foreground mt-2">
              Portfolio ID: {username}
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}
