'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string | null
  onImageUploaded: (url: string) => void
  onImageRemoved?: () => void
}

export default function ImageUpload({ 
  currentImage, 
  onImageUploaded,
  onImageRemoved 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        onImageUploaded(data.imageUrl)
      } else {
        setError(data.error || 'Failed to upload image')
        setPreview(currentImage || null)
      }
    } catch (error) {
      console.error('Image upload error:', error)
      setError('An error occurred while uploading')
      setPreview(currentImage || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!preview || !onImageRemoved) return

    setUploading(true)
    setError('')

    try {
      const response = await fetch('/api/upload-image', {
        method: 'DELETE',
      })

      if (response.ok) {
        setPreview(null)
        onImageRemoved()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to remove image')
      }
    } catch (error) {
      console.error('Image remove error:', error)
      setError('An error occurred while removing image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-muted border-4 border-border">
          {preview ? (
            <Image
              src={preview}
              alt="Profile"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          size="sm"
          className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          type="button"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>
        {preview && onImageRemoved && !uploading && (
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-0 right-0 rounded-full w-8 h-8 p-0"
            onClick={handleRemoveImage}
            type="button"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Click camera icon to upload
        </p>
        <p className="text-xs text-muted-foreground">
          Max 5MB • JPEG, PNG, WebP, or GIF
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
