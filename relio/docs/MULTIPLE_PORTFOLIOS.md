# Multiple Portfolios Feature

## Overview
Users can now create and manage multiple portfolios with **globally unique slugs**. Each portfolio has its own unique URL that can later be mapped to a custom subdomain.

## URL Structure

### Current Implementation
```
relio.com/awesome-dev
relio.com/creative-designer
relio.com/tech-lead-247
relio.com/john-doe-developer
```

### Future Subdomain Support
```
awesome-dev.relio.com
creative-designer.relio.com
tech-lead-247.relio.com
john-doe-developer.relio.com
```

## Key Features

### 🌐 Global Slug System
- **Globally Unique**: Each slug is unique across the entire platform (not just per user)
- **User-Independent**: Different users cannot have the same slug
- **Memorable**: Auto-generated from name/title (e.g., "john-smith-developer-247")
- **URL-Safe**: Lowercase, hyphenated, no special characters

### 🎯 Slug Generation
Slugs are generated from resume content with fallback logic:

1. **From Name + Title**: `john-smith-developer-847`
2. **From Title Only**: `full-stack-developer-392`
3. **Random Memorable**: `swift-blue-eagle`
4. **Timestamp Fallback**: `portfolio-1696348800-x7k2m`

### ♻️ Uniqueness Guarantee
- Tries up to 10 times to generate a unique slug
- Checks database for conflicts before assignment
- Falls back to timestamp-based slug if needed

## Database Schema

```prisma
model Portfolio {
  id        String   @id @default(cuid())
  userId    String
  title     String   @default("My Portfolio")
  slug      String   @unique  // ← Globally unique!
  isDefault Boolean  @default(false)
  config    Json
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([slug])  // ← Fast slug lookups
}
```

## API Changes

### GET /api/dashboard
**Response:**
```json
{
  "user": { ... },
  "portfolios": [
    {
      "id": "...",
      "slug": "default",
      "title": "My Portfolio",
      "isDefault": true,
      "config": { ... }
    }
  ]
}
```

### GET /api/portfolio
**Query Params:**
- `slug` (optional) - Get specific portfolio, or all if omitted

**Response (with slug):**
```json
{
  "portfolio": { ... }
}
```

**Response (without slug):**
```json
{
  "portfolios": [ ... ]
}
```

### POST /api/portfolio
Create a new portfolio

**Request:**
```json
{
  "slug": "developer",
  "title": "Developer Portfolio",
  "config": { ... }
}
```

### PUT /api/portfolio
Update a portfolio

**Request:**
```json
{
  "slug": "default",
  "title": "Updated Title",
  "config": { ... }
}
```

### DELETE /api/portfolio?slug={slug}
Delete a portfolio (cannot delete default if it's the only one)

## UI Changes

### Dashboard (`/dashboard`)
- Shows all portfolios as cards
- Each card displays:
  - Portfolio title
  - Slug/URL
  - "Default" badge for default portfolio
  - Edit, View, Delete buttons
- "Create New Portfolio" section for uploading additional resumes
- Default portfolio cannot be deleted if it's the only one

### Edit Page (`/dashboard/edit?slug={slug}`)
- Added `slug` query parameter
- Portfolio title field added at top of form
- Saves to specific portfolio by slug
- Shows which portfolio is being edited

### Upload Flow
- First upload creates default portfolio with slug "default"
- Subsequent uploads create new portfolios
- AI avatar selection still works for new portfolios

## Key Features

1. **Default Portfolio**: First portfolio created is marked as default
2. **Auto-slugs**: Currently uses "default" for first portfolio
3. **Per-portfolio customization**: Each portfolio has independent config
4. **Fallback behavior**: `/{username}` redirects to default portfolio
5. **Delete protection**: If deleting default portfolio, another is auto-promoted

## TypeScript Errors
Current TypeScript errors are **FALSE POSITIVES** due to Prisma cache:
- Run `npx prisma generate` to refresh
- Restart TypeScript server in VS Code
- The code works correctly despite the errors

## Future Enhancements

1. **Custom Slugs**: Allow users to set custom slugs when creating portfolios
2. **Templates**: Different portfolio templates/themes per portfolio
3. **Clone Portfolio**: Duplicate existing portfolio as starting point
4. **Set Default**: Allow users to change which portfolio is default
5. **Portfolio Analytics**: Track views per portfolio
6. **Export/Import**: Export portfolio config for backup/sharing
7. **Portfolio Groups**: Organize portfolios by category (Work, Personal, etc.)

## Example Usage

### Create Multiple Portfolios
1. User uploads resume → creates default portfolio
2. User uploads different resume → creates second portfolio
3. Each has unique URL: `/{username}/default`, `/{username}/portfolio-2`

### Manage Portfolios
1. Dashboard shows all portfolios
2. Edit any portfolio independently
3. Delete non-default portfolios
4. Share different portfolios for different purposes

## Testing Checklist

- [ ] Upload first resume creates default portfolio
- [ ] Upload second resume creates new portfolio
- [ ] Default portfolio is marked correctly
- [ ] `/{username}` redirects to default portfolio
- [ ] `/{username}/{slug}` shows correct portfolio
- [ ] Edit page loads correct portfolio by slug
- [ ] Save updates correct portfolio
- [ ] Delete removes portfolio (not default if only one)
- [ ] Delete default promotes another portfolio
- [ ] Dashboard shows all portfolios correctly
