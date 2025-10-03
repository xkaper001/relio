'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, ExternalLink, Edit, Loader2, LogOut } from 'lucide-react'
import Link from 'next/link'
import type { PortfolioConfig } from '@/types'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [portfolio, setPortfolio] = useState<{ config: PortfolioConfig } | null>(null)
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
      
      if (response.ok && data.portfolio) {
        setPortfolio(data.portfolio)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please upload a PDF or DOCX file')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
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

      setPortfolio(data.portfolio)
      setFile(null)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setUploading(false)
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
          {!portfolio && (
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

              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors mb-4">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {file ? file.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PDF or DOCX file up to 10MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full"
                size="lg"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Generate Portfolio'
                )}
              </Button>
            </div>
          )}

          {/* Portfolio Management */}
          {portfolio && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">
                      Your Portfolio
                    </h2>
                    <p className="text-muted-foreground">
                      Your portfolio is live and ready to share
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/dashboard/edit">
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/${session?.user?.username}`} target="_blank">
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Portfolio URL</p>
                  <div className="flex items-center gap-2">
                    <code className="text-foreground bg-background px-3 py-2 rounded border border-border flex-1">
                      {typeof window !== 'undefined' ? window.location.origin : ''}/{session?.user?.username}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/${session?.user?.username}`)
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Name</p>
                    <p className="text-muted-foreground">{portfolio.config.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Title</p>
                    <p className="text-muted-foreground">{portfolio.config.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Skills</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {portfolio.config.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Resume */}
              <div className="bg-card rounded-lg border border-border p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Update Your Portfolio
                </h3>
                <p className="text-muted-foreground mb-6">
                  Upload a new resume to update your portfolio
                </p>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <input
                    type="file"
                    id="update-resume"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="update-resume" className="flex-1">
                    <div className="border border-border rounded-md p-4 cursor-pointer hover:border-primary transition-colors text-center">
                      <p className="text-sm text-muted-foreground">
                        {file ? file.name : 'Choose a new resume file'}
                      </p>
                    </div>
                  </label>
                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Update
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
