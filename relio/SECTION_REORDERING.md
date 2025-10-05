# Section Reordering Feature

## Overview
This feature allows users to customize the order of sections in their portfolio. Users can drag and drop sections to reorder them according to their preference.

## Available Sections
- **Skills**: Display your technical and professional skills
- **Experience**: Show your work history and achievements
- **Education**: Present your academic background
- **Projects**: Showcase your projects and work samples

## How to Use

### 1. Access Section Reordering
1. Navigate to your portfolio edit page (`/dashboard/edit?slug=your-portfolio-slug`)
2. Find the "Section Order" collapsible panel
3. Click to expand it

### 2. Reorder Sections
1. Click and hold on any section item (you'll see a grip icon)
2. Drag it to your desired position
3. Drop it in place
4. The sections will automatically reorder

### 3. Save Your Changes
Click the "Save Changes" button to persist your section order

## Technical Implementation

### Type Definition
```typescript
export interface PortfolioConfig {
  // ... other fields
  sectionOrder?: string[]  // Array of section keys in desired order
}
```

### Default Order
If `sectionOrder` is not specified, the default order is:
1. Skills
2. Experience
3. Education
4. Projects

### Components Updated
- **PortfolioView**: Renders sections dynamically based on `sectionOrder`
- **PortfolioViewAnimated**: Animated version also respects `sectionOrder`
- **EditPortfolio**: Includes drag-and-drop UI for reordering

### Database Schema
The `sectionOrder` field is stored in the JSON `config` column of the `Portfolio` table, so no database migration is required.

## Examples

### Custom Order
```json
{
  "sectionOrder": ["projects", "skills", "experience", "education"]
}
```
This configuration will display Projects first, followed by Skills, Experience, and Education.

### Partial Order
If a section key is missing from `sectionOrder`, it won't be displayed (if the section has no content, it's hidden anyway).

## Features
- ✅ Drag and drop interface
- ✅ Visual feedback during dragging
- ✅ Real-time preview in edit mode
- ✅ Persisted to database
- ✅ Works with both PortfolioView and PortfolioViewAnimated
- ✅ Backward compatible (uses default order if not specified)
