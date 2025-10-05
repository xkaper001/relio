'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'
import ProcessingAnimation from '@/components/ProcessingAnimation'
import ShinyText from '@/components/ShinyText'

export default function TryPage() {
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aiProcessingTime, setAiProcessingTime] = useState<number>(0)
  const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null)
  const router = useRouter()

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    const file = files[0]
    
    // Validate file type
    if (!file.type.includes('pdf') && !file.name.endsWith('.docx')) {
      setError('Please upload a PDF or DOCX file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('anonymous', 'true')

      const startTime = Date.now()
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const endTime = Date.now()

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume')
      }

      // Upload complete, now processing
      setUploading(false)
      setProcessing(true)

      // Calculate actual AI processing time
      const processingTime = (endTime - startTime) / 1000
      setAiProcessingTime(processingTime)
      
      // Store the slug and let the animation complete before redirecting
      setPortfolioSlug(data.slug)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resume')
      setUploading(false)
      setProcessing(false)
    }
  }

  const handleAnimationComplete = () => {
    if (portfolioSlug) {
      router.push(`/${portfolioSlug}`)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Show processing animation when processing */}
      {processing && portfolioSlug && (
        <ProcessingAnimation 
          aiProcessingTime={aiProcessingTime}
          portfolioSlug={portfolioSlug}
          onComplete={handleAnimationComplete}
        />
      )}

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Try Relio Without Signup
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              Upload your resume and get a portfolio website in seconds
            </p>
            <p className="text-sm text-amber-400">
              ⚠️ Demo portfolios expire in 24 hours. Sign up to save permanently.
            </p>
          </div>

          <div className="mb-8">
            <FileUpload onChange={handleFileUpload} />
          </div>

          {uploading && (
            <div className="text-center py-8">
              <div className="inline-block">
                <ShinyText
                  text="RELIO"
                  disabled={false}
                  speed={3}
                  className="text-4xl font-bold"
                  style={{ fontFamily: 'var(--font-array)' }}
                />
              </div>
              <p className="mt-4 text-gray-400">
                Uploading your resume...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="mt-12 bg-blue-900/20 border border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-100 mb-2">
              📄 Supported Formats
            </h3>
            <ul className="text-blue-200 space-y-1">
              <li>✓ PDF files (.pdf)</li>
              <li>✓ Word documents (.docx)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
