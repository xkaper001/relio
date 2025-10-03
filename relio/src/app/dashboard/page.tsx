'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, ExternalLink, Edit, Loader2, LogOut, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { FileUpload } from '@/components/ui/file-upload'
import type { PortfolioConfig } from '@/types'

interface Portfolio {
  id: string
  slug: string
  title: string
  isDefault: boolean
  config: PortfolioConfig
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

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
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      // Refresh portfolios list
      await fetchDashboardData()
      setFile(null)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePortfolio = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return

    try {
      const response = await fetch(`/api/portfolio?slug=${slug}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchDashboardData()
      } else {
        setError('Failed to delete portfolio')
      }
    } catch (err) {
      setError('An error occurred while deleting')
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Relio
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {session?.user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
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

          {/* Upload Section */}
          {portfolios.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Create Your Portfolio
              </h2>
              <p className="text-muted-foreground mb-6">
                Upload your resume to generate your first portfolio
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
                    Processing your resume with AI...
                  </p>
                </div>
              )}

              <div className="mt-6 bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-100 mb-2 text-sm">
                  📄 Supported Formats
                </h3>
                <ul className="text-blue-200 space-y-1 text-sm">
                  <li>✓ PDF files (.pdf)</li>
                  <li>✓ Word documents (.docx)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Portfolio Management */}
          {portfolios.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">
                  Your Portfolios ({portfolios.length})
                </h2>
                <Button onClick={() => document.getElementById('add-resume')?.click()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Portfolio
                </Button>
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePortfolio(portfolio.slug)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                  </div>
                ))}
              </div>

              {/* Add New Portfolio */}
              <div className="bg-card rounded-lg border border-dashed border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Create Another Portfolio
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a different resume or use different information to create a new portfolio
                </p>

                <FileUpload onChange={handleFileChange} />

                {uploading && (
                  <div className="text-center py-8 mt-4">
                    <div className="inline-block">
                      <Loader2 className="w-12 h-12 animate-spin text-primary" />
                    </div>
                    <p className="mt-4 text-muted-foreground">
                      Creating your new portfolio with AI...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
