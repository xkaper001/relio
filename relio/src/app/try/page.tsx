'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@/components/ui/file-upload'

export default function TryPage() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload resume')
      }

      // Redirect to the temporary portfolio
      router.push(`/${data.username}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload resume')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Try Relio Without Signup
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Upload your resume and get a portfolio website in seconds
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-500">
              ⚠️ Demo portfolios expire in 24 hours. Sign up to save permanently.
            </p>
          </div>

          <div className="mb-8">
            <FileUpload onChange={handleFileUpload} />
          </div>

          {uploading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Processing your resume with AI...
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              📄 Supported Formats
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-1">
              <li>✓ PDF files (.pdf)</li>
              <li>✓ Word documents (.docx)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
