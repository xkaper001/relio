# User Profile Image Storage Guide

## Overview
This guide covers three approaches to storing user profile images in your Relio application.

---

## Option 1: Vercel Blob Storage (Recommended for Production)

### Why Vercel Blob?
- ✅ Serverless, no infrastructure management
- ✅ Global CDN for fast image delivery
- ✅ Automatic image optimization
- ✅ Pay-as-you-go pricing (free tier available)
- ✅ Simple API
- ✅ Perfect integration with Next.js/Vercel

### Setup Steps

#### 1. Install Vercel Blob
\`\`\`bash
npm install @vercel/blob
\`\`\`

#### 2. Add Environment Variable
Add to your `.env`:
\`\`\`
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
\`\`\`

Get your token from: https://vercel.com/dashboard/stores

#### 3. Create Image Upload API Route
Create `/src/app/api/upload-image/route.ts`:
\`\`\`typescript
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const filename = \`profile-images/\${session.user.id}-\${Date.now()}.\${file.name.split('.').pop()}\`
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    // Update user profile in database
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: blob.url },
    })

    return NextResponse.json({ 
      success: true, 
      imageUrl: blob.url,
      user 
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
\`\`\`

#### 4. Add Image Upload Component
Create `/src/components/ImageUpload.tsx`:
\`\`\`typescript
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  currentImage?: string | null
  onImageUploaded: (url: string) => void
}

export default function ImageUpload({ currentImage, onImageUploaded }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
        alert(data.error || 'Failed to upload image')
        setPreview(currentImage || null)
      }
    } catch (error) {
      alert('An error occurred while uploading')
      setPreview(currentImage || null)
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
          className="absolute bottom-0 right-0 rounded-full"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Click camera icon to upload (max 5MB)
      </p>
    </div>
  )
}
\`\`\`

---

## Option 2: Cloudinary (Great Alternative)

### Why Cloudinary?
- ✅ Free tier: 25GB storage, 25GB bandwidth
- ✅ Automatic image optimization and transformations
- ✅ Built-in CDN
- ✅ Easy to use

### Setup Steps

#### 1. Install Cloudinary
\`\`\`bash
npm install cloudinary
\`\`\`

#### 2. Add Environment Variables
\`\`\`
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

#### 3. Create Upload API
\`\`\`typescript
import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'relio-profiles',
          public_id: \`user-\${session.user.id}\`,
          overwrite: true,
          transformation: [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const uploadResult = result as any

    // Update user profile
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: uploadResult.secure_url },
    })

    return NextResponse.json({ 
      success: true, 
      imageUrl: uploadResult.secure_url,
      user 
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
\`\`\`

---

## Option 3: Base64 in Database (Simple but Limited)

### Pros & Cons
- ✅ Simple, no external services
- ✅ Works immediately
- ❌ Increases database size significantly
- ❌ Slower page loads
- ❌ Not recommended for production
- ❌ Better for small images only

### Implementation

Update your Portfolio config in TypeScript:
\`\`\`typescript
export interface PortfolioConfig {
  name: string
  title: string
  about: string
  profileImage?: string // base64 string
  // ... rest of fields
}
\`\`\`

Add to your edit page:
\`\`\`typescript
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validate size (max 100KB for base64)
  if (file.size > 100 * 1024) {
    alert('Image too large. Please use an image under 100KB.')
    return
  }

  const reader = new FileReader()
  reader.onloadend = () => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        profileImage: reader.result as string
      })
    }
  }
  reader.readAsDataURL(file)
}
\`\`\`

---

## Option 4: Local File System (Development Only)

### ⚠️ Warning
Only use this for local development. Does NOT work on Vercel or other serverless platforms.

### Implementation
Store in \`public/uploads/\` directory and save path to database.

---

## Recommended Approach for Your App

**For Production: Use Vercel Blob or Cloudinary**

### Quick Decision Guide:
- Already on Vercel? → **Vercel Blob**
- Want free tier with transformations? → **Cloudinary**
- Just testing locally? → **Base64** (temporary)

### Next Steps:
1. Choose your storage provider
2. Install the package
3. Set up environment variables
4. Create the upload API route
5. Add the ImageUpload component to your edit page
6. Update your portfolio view to display the profile image

Would you like me to implement one of these solutions for you?
