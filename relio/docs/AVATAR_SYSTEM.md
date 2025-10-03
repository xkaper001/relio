# Avatar System Setup

## Overview
Added a random avatar system using 100 illustrated SVG characters. Each new user is automatically assigned a random avatar from the collection.

## Implementation

### 1. Avatar Files
- **Location**: `/public/avatars/` (001.svg - 100.svg)
- **Source**: Copied from `/geeme/` folder
- **Access**: Publicly accessible via `/avatars/XXX.svg` URLs

### 2. Database Schema
Added `avatar` field to User model:
```prisma
model User {
  // ... existing fields
  avatar        String?   // Random avatar from 001-100
  // ... rest of fields
}
```

**Migration**: `20251003105750_add_avatar_field`

### 3. Utility Functions

**File**: `/src/lib/utils.ts`

#### `getRandomAvatar()`
Generates a random avatar URL from the collection:
```typescript
export function getRandomAvatar(): string {
  const avatarNumber = Math.floor(Math.random() * 100) + 1
  const avatarId = avatarNumber.toString().padStart(3, '0')
  return `/avatars/${avatarId}.svg`
}
```

**Returns**: `/avatars/001.svg` to `/avatars/100.svg`

#### `avatarDescriptions`
Reference object mapping avatar IDs to descriptions:
```typescript
export const avatarDescriptions: Record<string, string> = {
  "001": "man-with-glasses-and-a-laptop-bag",
  "002": "woman-with-brown-hair-and-a-football",
  // ... 98 more
}
```

### 4. Signup Integration

**File**: `/src/app/api/auth/signup/route.ts`

When a new user signs up, they're automatically assigned a random avatar:
```typescript
const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    username,
    avatar: getRandomAvatar(), // ← Random avatar assigned
    isTemporary: false,
  },
})
```

### 5. Portfolio Display

**File**: `/src/components/PortfolioView.tsx`

The avatar is used as a fallback when no profile image is uploaded:

```typescript
interface PortfolioViewProps {
  userImage?: string | null  // Cloudinary uploaded image
  avatar?: string | null     // Random SVG avatar
  // ... other props
}

// Display logic:
// 1. If userImage exists → show uploaded profile image
// 2. Else if avatar exists → show random SVG avatar  
// 3. Else → show default user icon
```

**File**: `/src/app/[username]/page.tsx`

Portfolio page queries both image and avatar:
```typescript
return {
  config: user.portfolio.config,
  userImage: user.image,  // Cloudinary image
  avatar: user.avatar,    // SVG avatar
  // ... other fields
}
```

## Usage Flow

### New User Signup
1. User signs up with email/password
2. `getRandomAvatar()` selects random SVG (e.g., `025.svg`)
3. Avatar URL (`/avatars/025.svg`) saved to database
4. User sees their avatar immediately on portfolio

### Profile Image Upload
1. User can upload custom image via Cloudinary
2. Custom image stored in `user.image` field
3. Portfolio displays custom image (takes precedence)
4. Avatar remains as fallback

### Avatar Display Priority
```
Custom Upload (user.image) 
    ↓ (if null)
Random Avatar (user.avatar)
    ↓ (if null)
Default User Icon
```

## Avatar Collection

100 diverse illustrated characters including:
- Various professions (developers, musicians, athletes, etc.)
- Different styles (casual, formal, traditional dress)
- Diverse accessories (glasses, bags, instruments, etc.)
- Gender representation
- Different activities and poses

Each avatar is uniquely identifiable and provides a friendly, personalized default profile image.

## Benefits

1. **Immediate Personalization**: Users get a unique avatar instantly
2. **Visual Diversity**: 100 options ensure variety
3. **Fallback System**: Always have an image even without upload
4. **Performance**: SVG files are small and fast to load
5. **No External Dependencies**: Self-hosted, no API calls needed

## Future Enhancements

- [ ] Allow users to manually select their preferred avatar
- [ ] Add avatar picker UI in dashboard/edit page
- [ ] Filter avatars by characteristics (gender, style, etc.)
- [ ] Add more avatar collections
- [ ] Generate avatar preview grid for selection

## Files Modified

- ✅ `prisma/schema.prisma` - Added avatar field
- ✅ `src/lib/utils.ts` - Added getRandomAvatar() and descriptions
- ✅ `src/app/api/auth/signup/route.ts` - Auto-assign avatar on signup
- ✅ `src/app/[username]/page.tsx` - Query avatar field
- ✅ `src/components/PortfolioView.tsx` - Display avatar with fallback logic
- ✅ `public/avatars/` - 100 SVG avatar files

## Testing

To test the avatar system:

1. **New Signup**: Create a new account and verify random avatar appears
2. **Portfolio View**: Visit `/{username}` and see avatar displayed
3. **Image Upload**: Upload custom image, verify it takes precedence
4. **Image Delete**: Remove custom image, verify avatar shows again

## Troubleshooting

If avatars don't appear:
- Verify files exist in `/public/avatars/`
- Check browser console for 404 errors
- Ensure avatar paths start with `/` (e.g., `/avatars/001.svg`)
- Restart dev server after file changes

If TypeScript errors about `avatar` field:
- Run `bunx prisma generate` to regenerate types
- Restart TypeScript server in VS Code (Cmd+Shift+P → "Restart TS Server")
- Clear `.next` cache and restart dev server
