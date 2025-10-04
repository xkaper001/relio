'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Save, Loader2, Plus, Trash2, Eye, EyeOff, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import PortfolioView from '@/components/PortfolioView'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  useCollapsible,
} from '@/components/animate-ui/primitives/radix/collapsible'
import type { PortfolioConfig, Experience, Education, Project } from '@/types'

// Chevron icon component that rotates based on collapsible state
const ChevronIcon = () => {
  const { isOpen } = useCollapsible();
  return (
    <ChevronDown 
      className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
        isOpen ? 'rotate-180' : ''
      }`} 
    />
  );
};

// Helper function to ensure URLs have proper protocol
const ensureHttps = (url: string): string => {
  if (!url) return url
  const trimmedUrl = url.trim()
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  return `https://${trimmedUrl}`
}

function EditPortfolioContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug') || 'default'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioConfig | null>(null)
  const [portfolioTitle, setPortfolioTitle] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')
  const [showPreview, setShowPreview] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPortfolio()
    }
  }, [status, slug])

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`/api/portfolio?slug=${slug}`)
      const data = await response.json()
      
      if (response.ok && data.portfolio) {
        setPortfolio(data.portfolio.config as PortfolioConfig)
        setPortfolioTitle(data.portfolio.title)
        setAvatar(data.portfolio.avatar)
      } else {
        setError('Portfolio not found')
      }

      // Fetch user data for profile image and username
      const dashboardResponse = await fetch('/api/dashboard')
      const dashboardData = await dashboardResponse.json()
      if (dashboardResponse.ok && dashboardData.user) {
        setUserImage(dashboardData.user.image)
        setUsername(dashboardData.user.username)
      }
    } catch (err) {
      setError('Failed to load portfolio')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!portfolio) return

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Normalize URLs before saving
      const normalizedConfig = {
        ...portfolio,
        linkedin: portfolio.linkedin ? ensureHttps(portfolio.linkedin) : '',
        github: portfolio.github ? ensureHttps(portfolio.github) : '',
        website: portfolio.website ? ensureHttps(portfolio.website) : '',
        projects: portfolio.projects.map(project => ({
          ...project,
          link: project.link ? ensureHttps(project.link) : '',
          github: project.github ? ensureHttps(project.github) : '',
        })),
      }

      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          title: portfolioTitle,
          config: normalizedConfig,
        }),
      })

      if (response.ok) {
        setSuccess('Portfolio updated successfully!')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError('Failed to update portfolio')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof PortfolioConfig, value: any) => {
    if (portfolio) {
      setPortfolio({ ...portfolio, [field]: value })
    }
  }

  const addExperience = () => {
    if (portfolio) {
      const newExp: Experience = {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        achievements: [],
      }
      setPortfolio({
        ...portfolio,
        experience: [...portfolio.experience, newExp],
      })
    }
  }

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    if (portfolio) {
      const updated = [...portfolio.experience]
      updated[index] = { ...updated[index], [field]: value }
      setPortfolio({ ...portfolio, experience: updated })
    }
  }

  const removeExperience = (index: number) => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        experience: portfolio.experience.filter((_, i) => i !== index),
      })
    }
  }

  const addEducation = () => {
    if (portfolio) {
      const newEdu: Education = {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      }
      setPortfolio({
        ...portfolio,
        education: [...portfolio.education, newEdu],
      })
    }
  }

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    if (portfolio) {
      const updated = [...portfolio.education]
      updated[index] = { ...updated[index], [field]: value }
      setPortfolio({ ...portfolio, education: updated })
    }
  }

  const removeEducation = (index: number) => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        education: portfolio.education.filter((_, i) => i !== index),
      })
    }
  }

  const addProject = () => {
    if (portfolio) {
      const newProj: Project = {
        name: '',
        description: '',
        technologies: [],
        link: '',
        github: '',
      }
      setPortfolio({
        ...portfolio,
        projects: [...portfolio.projects, newProj],
      })
    }
  }

  const updateProject = (index: number, field: keyof Project, value: any) => {
    if (portfolio) {
      const updated = [...portfolio.projects]
      updated[index] = { ...updated[index], [field]: value }
      setPortfolio({ ...portfolio, projects: updated })
    }
  }

  const removeProject = (index: number) => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        projects: portfolio.projects.filter((_, i) => i !== index),
      })
    }
  }

  const updateArrayField = (field: 'skills' | 'achievements', value: string, expIndex?: number) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    
    if (field === 'skills' && portfolio) {
      setPortfolio({ ...portfolio, skills: items })
    } else if (field === 'achievements' && portfolio && expIndex !== undefined) {
      const updated = [...portfolio.experience]
      updated[expIndex] = { ...updated[expIndex], achievements: items }
      setPortfolio({ ...portfolio, experience: updated })
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">No portfolio found</p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden lg:flex"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Show Preview
                  </>
                )}
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="container mx-auto px-4 py-8 flex gap-8 overflow-hidden">
          {/* Left Side - Edit Form (30%) */}
          <div className="w-full lg:w-[30%] overflow-y-auto pr-4 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Edit Your Portfolio
            </h1>
            <p className="text-muted-foreground">
              Update your information and customize your portfolio
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Portfolio Title */}
          <Collapsible defaultOpen={true}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold text-foreground">Portfolio Title</h2>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-2">
                  <Input
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    placeholder="My Portfolio"
                  />
                  <p className="text-xs text-muted-foreground">
                    This helps you identify this portfolio in your dashboard
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Profile Image */}
          <Collapsible defaultOpen={false}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold text-foreground">Profile Picture</h2>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6">
                  <ImageUpload
                    currentImage={userImage}
                    onImageUploaded={(url) => {
                      setUserImage(url)
                      setSuccess('Profile image updated successfully!')
                      setTimeout(() => setSuccess(''), 3000)
                    }}
                    onImageRemoved={() => {
                      setUserImage(null)
                      setSuccess('Profile image removed successfully!')
                      setTimeout(() => setSuccess(''), 3000)
                    }}
                  />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Basic Info */}
          <Collapsible defaultOpen={true}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <Input
                  value={portfolio.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                <Input
                  value={portfolio.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Your professional title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">About</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-y"
                  value={portfolio.about}
                  onChange={(e) => updateField('about', e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Contact Info */}
          <Collapsible defaultOpen={false}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  value={portfolio.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <Input
                  value={portfolio.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                <Input
                  value={portfolio.location || ''}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">LinkedIn</label>
                <Input
                  value={portfolio.linkedin || ''}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">GitHub</label>
                <Input
                  value={portfolio.github || ''}
                  onChange={(e) => updateField('github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                <Input
                  value={portfolio.website || ''}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Skills */}
          <Collapsible defaultOpen={false}>
            <div className="bg-card rounded-lg border border-border">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <h2 className="text-xl font-semibold text-foreground">Skills</h2>
                <ChevronIcon />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Skills (comma-separated)
              </label>
              <Input
                value={portfolio.skills.join(', ')}
                onChange={(e) => updateArrayField('skills', e.target.value)}
                placeholder="React, TypeScript, Node.js, etc."
              />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Experience */}
          <Collapsible defaultOpen={false}>
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 flex items-center justify-between">
                <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <h2 className="text-xl font-semibold text-foreground">Experience</h2>
                  <ChevronIcon />
                </CollapsibleTrigger>
                <Button onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-6">
              {portfolio.experience.map((exp, index) => (
                <div key={index} className="border border-border rounded-lg p-6 relative">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="space-y-4 pr-12">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Position</label>
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(index, 'position', e.target.value)}
                          placeholder="Job title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          placeholder="Company name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                        <Input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          placeholder="Jan 2020"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                        <Input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          placeholder="Present"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                      <textarea
                        className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-y"
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        placeholder="Describe your role"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Achievements (comma-separated)
                      </label>
                      <Input
                        value={exp.achievements.join(', ')}
                        onChange={(e) => updateArrayField('achievements', e.target.value, index)}
                        placeholder="Achievement 1, Achievement 2, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Education */}
          <Collapsible defaultOpen={false}>
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 flex items-center justify-between">
                <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <h2 className="text-xl font-semibold text-foreground">Education</h2>
                  <ChevronIcon />
                </CollapsibleTrigger>
                <Button onClick={addEducation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-6">
              {portfolio.education.map((edu, index) => (
                <div key={index} className="border border-border rounded-lg p-6 relative">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => removeEducation(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="space-y-4 pr-12">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Institution</label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          placeholder="University name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Degree</label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Field of Study</label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(index, 'field', e.target.value)}
                          placeholder="Computer Science, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">GPA (Optional)</label>
                        <Input
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          placeholder="3.8"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
                        <Input
                          value={edu.startDate}
                          onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                          placeholder="2016"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
                        <Input
                          value={edu.endDate}
                          onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                          placeholder="2020"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Projects */}
          <Collapsible defaultOpen={false}>
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 flex items-center justify-between">
                <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <h2 className="text-xl font-semibold text-foreground">Projects</h2>
                  <ChevronIcon />
                </CollapsibleTrigger>
                <Button onClick={addProject} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </div>
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-6">
              {portfolio.projects.map((proj, index) => (
                <div key={index} className="border border-border rounded-lg p-6 relative">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => removeProject(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="space-y-4 pr-12">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Project Name</label>
                      <Input
                        value={proj.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        placeholder="Project name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                      <textarea
                        className="w-full min-h-[80px] px-3 py-2 border border-input bg-background rounded-md text-sm resize-y"
                        value={proj.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        placeholder="Describe the project"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Technologies (comma-separated)
                      </label>
                      <Input
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t)
                          updateProject(index, 'technologies', techs)
                        }}
                        placeholder="React, Node.js, MongoDB, etc."
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Project Link (Optional)</label>
                        <Input
                          value={proj.link || ''}
                          onChange={(e) => updateProject(index, 'link', e.target.value)}
                          placeholder="https://project-url.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">GitHub Link (Optional)</label>
                        <Input
                          value={proj.github || ''}
                          onChange={(e) => updateProject(index, 'github', e.target.value)}
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Save Button at Bottom */}
          <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-background pb-4">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Side - Live Preview (70%) */}
        {showPreview && (
          <div className="hidden lg:block lg:w-[70%] overflow-y-auto">
            <div className="sticky top-0 bg-card border border-border px-4 py-2 flex items-center justify-between z-10">
              <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
              <span className="text-xs text-muted-foreground">Updates in real-time</span>
            </div>
            {portfolio && (
              <PortfolioView
                config={portfolio}
                isTemporary={false}
                expiresAt={null}
                username={username}
                userImage={userImage}
                avatar={avatar}
              />
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default function EditPortfolio() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <EditPortfolioContent />
    </Suspense>
  )
}
