# Cloudinary Profile Image Setup - Complete Guide

## ✅ Installation Complete!

Cloudinary has been successfully integrated into your Relio application for storing user profile images.

---

## 🔧 Setup Instructions

### Step 1: Get Your Cloudinary Credentials

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (or log in if you have one)
3. Go to your **Dashboard**
4. You'll see your account details:
   - **Cloud Name**: e.g., `dms8qtx4b`
   - **API Key**: e.g., `943473332332317`
   - **API Secret**: Click "Reveal" to see your secret

### Step 2: Update Environment Variables

Add these to your `.env` file:

\`\`\`bash
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
\`\`\`

**Note:** I detected you already have some Cloudinary credentials! Update the `<your_api_secret>` placeholder in your `.env` file with the actual secret from your Cloudinary dashboard.

### Step 3: Restart Your Development Server

\`\`\`bash
# Stop the current server (Ctrl+C)
npm run dev
\`\`\`

---

## 🎨 Features Implemented

### 1. **Image Upload API** (`/api/upload-image`)
- **POST**: Upload a new profile image
- **DELETE**: Remove profile image
- Supports: JPEG, PNG, WebP, GIF
- Max file size: 5MB
- Automatic transformations:
  - Resize to 500x500px
  - Smart crop with face detection
  - Auto quality optimization
  - Auto format conversion (WebP for supported browsers)

### 2. **ImageUpload Component**
A reusable React component with:
- Click-to-upload functionality
- Image preview
- Loading states
- Error handling
- Remove image option
- File validation (type & size)

### 3. **Profile Picture in Edit Page**
- Located at the top of `/dashboard/edit`
- Real-time preview after upload
- Success/error notifications
- Persistent across sessions

### 4. **Profile Picture Display**
- Shows on portfolio pages (`/[username]`)
- Circular profile image with border
- Fallback to user icon if no image
- Responsive design

---

## 📁 Files Created/Modified

### New Files:
1. **`/src/app/api/upload-image/route.ts`**
   - Handles image upload to Cloudinary
   - Validates file type and size
   - Updates user profile in database

2. **`/src/components/ImageUpload.tsx`**
   - Reusable image upload component
   - Handles UI, validation, and upload logic

### Modified Files:
1. **`/src/app/dashboard/edit/page.tsx`**
   - Added profile picture section
   - Integrated ImageUpload component
   - Tracks user image state

2. **`/src/components/PortfolioView.tsx`**
   - Displays user profile image
   - Shows fallback icon if no image

3. **`/src/app/[username]/page.tsx`**
   - Fetches user image from database
   - Passes to PortfolioView component

4. **`.env.example`**
   - Added Cloudinary environment variables

---

## 🚀 How to Use

### For Users:

1. **Navigate to Edit Page**
   - Go to `/dashboard`
   - Click "Edit" button

2. **Upload Profile Picture**
   - Scroll to "Profile Picture" section (at the top)
   - Click the camera icon
   - Select an image (JPEG, PNG, WebP, or GIF)
   - Image uploads automatically

3. **Remove Profile Picture** (Optional)
   - Click the "X" button on the top-right of the image
   - Confirms removal

4. **View on Portfolio**
   - Your profile image appears at the top of your portfolio
   - Visible to anyone visiting `/[your-username]`

### Image Storage:

- **Where**: Cloudinary cloud storage
- **Folder**: `relio-profiles/`
- **Naming**: `user-{userId}.{extension}`
- **CDN**: Globally distributed for fast loading
- **Optimizations**: Automatic compression and format conversion

---

## 🎯 Image Transformations Applied

Cloudinary automatically applies these transformations:

\`\`\`javascript
{
  width: 500,
  height: 500,
  crop: 'fill',
  gravity: 'face',  // Smart crop focusing on faces
  quality: 'auto',  // Automatic quality optimization
  fetch_format: 'auto'  // Serves WebP to supported browsers
}
\`\`\`

---

## 🔒 Security Features

✅ **Authentication Required**: Only logged-in users can upload  
✅ **User Isolation**: Users can only modify their own profile image  
✅ **File Type Validation**: Only image formats allowed  
✅ **File Size Limit**: Maximum 5MB  
✅ **Secure Storage**: Images stored on Cloudinary's secure CDN  

---

## 💰 Cloudinary Free Tier

Perfect for your application:
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Images**: Unlimited

This is more than enough for thousands of users!

---

## 🐛 Troubleshooting

### "Unauthorized" Error
- Ensure user is logged in
- Check NextAuth session is valid

### "Failed to upload image"
- Verify Cloudinary credentials in `.env`
- Check file size is under 5MB
- Ensure file is a valid image format
- Restart development server after adding env variables

### Image Not Displaying
- Check if `userImage` URL is valid
- Verify Cloudinary cloud name is correct
- Check browser console for errors
- Ensure Next.js Image optimization allows Cloudinary domain

### Add Cloudinary to Next.js Image Config

If images don't load, add to `next.config.ts`:

\`\`\`typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}
\`\`\`

---

## 📊 Database Schema

The user image is stored in the existing `User` model:

\`\`\`prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  image         String?   // ← Profile image URL stored here
  // ... other fields
}
\`\`\`

No database migration needed! The `image` field already exists.

---

## 🔄 Flow Diagram

\`\`\`
User clicks camera icon
    ↓
Selects image file
    ↓
ImageUpload component validates file
    ↓
Sends to /api/upload-image (POST)
    ↓
API validates authentication & file
    ↓
Uploads to Cloudinary with transformations
    ↓
Cloudinary returns secure URL
    ↓
API updates User.image in database
    ↓
Returns URL to frontend
    ↓
ImageUpload shows preview
    ↓
Profile image appears on portfolio
\`\`\`

---

## 🎨 Customization Options

### Change Image Size
Edit `/src/app/api/upload-image/route.ts`:

\`\`\`typescript
transformation: [
  { width: 800, height: 800, crop: 'fill', gravity: 'face' },
  // ... other transformations
]
\`\`\`

### Change Max File Size
Edit `/src/app/api/upload-image/route.ts`:

\`\`\`typescript
if (file.size > 10 * 1024 * 1024) { // 10MB instead of 5MB
  return NextResponse.json(...)
}
\`\`\`

### Change Allowed Formats
Edit `/src/app/api/upload-image/route.ts`:

\`\`\`typescript
const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
\`\`\`

---

## ✨ Next Steps

Your profile image feature is ready to use! Here's what to do:

1. ✅ Add your Cloudinary API secret to `.env`
2. ✅ Restart your development server
3. ✅ Test uploading an image in `/dashboard/edit`
4. ✅ View your portfolio to see the profile picture
5. ✅ (Optional) Configure Next.js image domains if needed

Enjoy your new profile picture feature! 🎉
