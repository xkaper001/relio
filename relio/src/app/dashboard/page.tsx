'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Edit, Loader2, LogOut, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/ui/file-upload'
import ProcessingAnimation from '@/components/ProcessingAnimation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/animate-ui/components/radix/alert-dialog'
import type { PortfolioConfig } from '@/types'

interface Portfolio {
  id: string
  slug: string
  title: string
  template: string
  isDefault: boolean
  config: PortfolioConfig
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [aiProcessingTime, setAiProcessingTime] = useState<number>(0)
  const [portfolioSlug, setPortfolioSlug] = useState<string>('')

  useEffect(() => {
    console.log('Dashboard auth status:', status, 'session:', !!session)
    if (status === 'authenticated') {
      fetchDashboardData()
    } else if (status === 'unauthenticated') {
      // Redirect to signin if not authenticated
      window.location.href = '/auth/signin'
    }
  }, [status, session])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      
      if (response.ok && data.portfolios) {
        setPortfolios(data.portfolios)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (files: File[]) => {
    if (files.length === 0) return
    
    const selectedFile = files[0]
    if (selectedFile.type === 'application/pdf' || 
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.name.endsWith('.pdf') ||
        selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile)
      setError('')
      // Auto-upload after file selection
      handleUpload(selectedFile)
    } else {
      setError('Please upload a PDF or DOCX file')
      setFile(null)
    }
  }

  const handleUpload = async (uploadFile?: File) => {
    const fileToUpload = uploadFile || file
    if (!fileToUpload) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', fileToUpload)
    formData.append('anonymous', 'false')

    try {
      const startTime = Date.now()
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const endTime = Date.now()

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      // Upload complete, now processing
      setUploading(false)
      setProcessing(true)

      // Calculate actual AI processing time
      const processingTime = (endTime - startTime) / 1000
      setAiProcessingTime(processingTime)
      setPortfolioSlug(data.slug)

      // Don't refresh immediately, let animation complete
    } catch (err) {
      setError('An error occurred. Please try again.')
      setUploading(false)
      setProcessing(false)
    }
  }

  const handleAnimationComplete = async () => {
    // Refresh portfolios list after animation
    await fetchDashboardData()
    setFile(null)
    setProcessing(false)
  }

  const handleDeletePortfolio = async (slug: string) => {
    try {
      const response = await fetch(`/api/portfolio?slug=${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Immediately update the UI by removing the deleted portfolio
        setPortfolios(prevPortfolios => 
          prevPortfolios.filter(portfolio => portfolio.slug !== slug)
        )
      } else {
        setError('Failed to delete portfolio')
      }
    } catch (err) {
      setError('An error occurred while deleting')
    }
  }

  const handleTemplateChange = async (slug: string, template: string) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, template }),
      })

      if (response.ok) {
        await fetchDashboardData()
      } else {
        setError('Failed to update template')
      }
    } catch (err) {
      setError('An error occurred while updating template')
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Show processing animation when processing */}
      {processing && portfolioSlug && (
        <ProcessingAnimation 
          aiProcessingTime={aiProcessingTime}
          portfolioSlug={portfolioSlug}
          onComplete={handleAnimationComplete}
        />
      )}

      {/* Header - Sticky with glassmorph design like landing page */}
      <header className="sticky top-8 z-10 w-full h-[60px] flex items-center justify-center ">
        <div className="w-[90%] md:w-[60%] h-[60px] rounded-[50px] px-6 flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          <Link href="/" className="flex items-center">
            <h2 className="text-white text-xl font-bold tracking-tight">Relio</h2>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80 hidden sm:block">
              {session?.user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, {session?.user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your portfolio and keep it up to date
            </p>
          </div>

          {/* Upload Section - Always visible at the top */}
          <div className="bg-card rounded-lg border border-border p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {portfolios.length === 0 ? 'Create Your Portfolio' : 'Create Another Portfolio'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {portfolios.length === 0 
                ? 'Upload your resume to generate your first portfolio'
                : 'Upload a different resume or use different information to create a new portfolio'
              }
            </p>

            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm mb-4">
                {error}
              </div>
            )}

            <FileUpload onChange={handleFileChange} />

            {uploading && (
              <div className="text-center py-8 mt-4">
                <div className="inline-block">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
                <p className="mt-4 text-muted-foreground">
                  Uploading your resume...
                </p>
              </div>
            )}
            
            {portfolios.length === 0 && (
              <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-100 mb-2 text-sm">
                  📄 Supported Formats
                </h3>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>✓ PDF files (.pdf)</li>
                  <li>✓ Word documents (.docx)</li>
                </ul>
              </div>
            )}
          </div>

          {/* Portfolio Management */}
          {portfolios.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Portfolios ({portfolios.length})
                </h2>
              </div>

              {/* Portfolio Cards */}
              <div className="grid gap-6">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="bg-card rounded-lg border border-border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-semibold text-foreground">
                            {portfolio.title}
                          </h3>
                          {portfolio.isDefault && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          /{portfolio.slug}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/edit?slug=${portfolio.slug}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                        <Link href={`/${portfolio.slug}`} target="_blank">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </Link>
                        {!portfolio.isDefault && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Portfolio?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &ldquo;{portfolio.title}&rdquo;? This action cannot be undone and will permanently remove your portfolio.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePortfolio(portfolio.slug)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground mb-1">Name</p>
                        <p className="font-medium">{portfolio.config.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Title</p>
                        <p className="font-medium">{portfolio.config.title}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {portfolio.config.skills.slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                          {portfolio.config.skills.length > 5 && (
                            <span className="px-2 py-1 text-muted-foreground text-xs">
                              +{portfolio.config.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Template Selector */}
                    <div className="pt-4 border-t border-border">
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Portfolio Design Template
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleTemplateChange(portfolio.slug, 'default')}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            portfolio.template === 'default'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">Classic</span>
                            {portfolio.template === 'default' && (
                              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Clean & professional design
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-muted text-xs rounded">Fast</span>
                            <span className="px-1.5 py-0.5 bg-muted text-xs rounded">Simple</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleTemplateChange(portfolio.slug, 'animated')}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            portfolio.template === 'animated'
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">Animated</span>
                            {portfolio.template === 'animated' && (
                              <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Modern with smooth animations
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-muted text-xs rounded">✨ Effects</span>
                            <span className="px-1.5 py-0.5 bg-muted text-xs rounded">Creative</span>
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {portfolio.template === 'animated' 
                          ? '🎨 Your portfolio uses smooth animations and aurora background'
                          : '📄 Your portfolio uses a clean, professional layout'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
