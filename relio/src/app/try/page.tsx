'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function TryPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

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
    formData.append('anonymous', 'true')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      // Redirect to temporary portfolio
      router.push(`/${data.username}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Try Relio Without Signing Up
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload your resume and see your portfolio in seconds. No account required.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <AlertCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Your portfolio will be deleted in 24 hours
              </span>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-xl p-8 space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
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
              className="w-full py-6 text-lg"
              size="lg"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Create My Portfolio'
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Want to save your portfolio permanently?
              </p>
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Create a free account
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
