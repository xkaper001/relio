'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
  Code
} from 'lucide-react'
import type { PortfolioConfig } from '@/types'

interface PortfolioViewProps {
  config: PortfolioConfig
  isTemporary: boolean
  expiresAt: Date | null
  username: string
}

export default function PortfolioView({ 
  config, 
  isTemporary, 
  expiresAt,
  username 
}: PortfolioViewProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

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
              <Link href="/auth/signup">
                <Button size="sm">Save My Portfolio</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground">
              {config.name}
            </h1>
            <p className="text-2xl sm:text-3xl text-primary font-medium">
              {config.title}
            </p>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {config.about}
            </p>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
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
            <div className="flex items-center justify-center gap-4 pt-4">
              {config.linkedin && (
                <a
                  href={config.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-primary" />
                </a>
              )}
              {config.github && (
                <a
                  href={config.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Github className="w-5 h-5 text-primary" />
                </a>
              )}
              {config.website && (
                <a
                  href={config.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <Globe className="w-5 h-5 text-primary" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {config.skills && config.skills.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {config.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-background border border-border rounded-full text-foreground font-medium hover:border-primary transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {config.experience && config.experience.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Experience</h2>
            </div>
            <div className="space-y-8">
              {config.experience.map((exp, index) => (
                <div
                  key={index}
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
      )}

      {/* Education Section */}
      {config.education && config.education.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Education</h2>
            </div>
            <div className="space-y-6">
              {config.education.map((edu, index) => (
                <div
                  key={index}
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
      )}

      {/* Projects Section */}
      {config.projects && config.projects.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <Code className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {config.projects.map((project, index) => (
                <div
                  key={index}
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
                        href={project.link}
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
                        href={project.github}
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
      )}

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-muted-foreground">
            Created with{' '}
            <Link href="/" className="text-primary hover:underline font-medium">
              Relio
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
