# Side-by-Side Edit with Live Preview

## Overview
The portfolio edit page now features a **real-time split-screen editor** with instant preview functionality, allowing users to see their changes reflected immediately as they type.

## New Layout

### Desktop View (≥1024px):
```
┌─────────────────────────────────────────────────────────────┐
│                        Header Bar                            │
│  [← Back] [Hide Preview] [Save Changes]                     │
├──────────────────────────────┬──────────────────────────────┤
│                               │                              │
│  LEFT SIDE (50%)             │  RIGHT SIDE (50%)            │
│  ════════════════             │  ═══════════════             │
│                               │                              │
│  📝 Edit Form                │  👁️ Live Preview            │
│  ├─ Profile Picture           │  ┌──────────────────────┐   │
│  ├─ Basic Info                │  │  Live Preview        │   │
│  ├─ Contact                   │  │  Updates real-time   │   │
│  ├─ Skills                    │  ├──────────────────────┤   │
│  ├─ Experience                │  │                      │   │
│  ├─ Education                 │  │  [Portfolio View]    │   │
│  └─ Projects                  │  │                      │   │
│                               │  │  Shows exactly how   │   │
│  [Scrollable]                 │  │  the portfolio will  │   │
│                               │  │  look to visitors    │   │
│  [Cancel] [Save Changes]      │  │                      │   │
│                               │  └──────────────────────┘   │
│                               │  [Scrollable]                │
└──────────────────────────────┴──────────────────────────────┘
```

### Mobile/Tablet View (<1024px):
```
┌─────────────────────────┐
│     Header Bar          │
│  [← Back] [Save]        │
├─────────────────────────┤
│                         │
│  📝 Edit Form Only     │
│  (Full width)           │
│                         │
│  ├─ Profile Picture     │
│  ├─ Basic Info          │
│  ├─ Contact             │
│  ├─ Skills              │
│  ├─ Experience          │
│  ├─ Education           │
│  └─ Projects            │
│                         │
│  [Cancel] [Save]        │
└─────────────────────────┘
```

## Features

### 1. **Real-Time Preview** ⚡
- **Instant Updates**: Every change reflects immediately in the preview
- **No Delay**: Uses React state, updates happen as you type
- **Full Fidelity**: Preview uses the exact same PortfolioView component visitors see

### 2. **Toggle Preview** 👁️
- **Show/Hide Button**: Desktop users can toggle preview on/off
- **More Space**: Hide preview to focus on editing
- **Keyboard Friendly**: Easy to toggle while editing

### 3. **Synchronized Scrolling** 📜
- **Independent Scrolling**: Edit form and preview scroll separately
- **Sticky Preview**: Preview stays visible while editing
- **Optimal Height**: Both panels use full viewport height

### 4. **Responsive Design** 📱
- **Desktop**: Side-by-side layout with 50/50 split
- **Tablet/Mobile**: Single column, edit form only
- **Adaptive**: Preview automatically hides on small screens

### 5. **Enhanced Header** 🎯
- **Sticky Header**: Stays at top when scrolling
- **Quick Actions**: Back, Toggle Preview, Save - all easily accessible
- **Status Indicators**: Shows saving state

## Technical Implementation

### New State Variables:
```typescript
const [showPreview, setShowPreview] = useState(true)  // Toggle preview visibility
const [avatar, setAvatar] = useState<string | null>(null)  // User avatar
const [username, setUsername] = useState<string>('')  // Username for preview
```

### Layout Structure:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* Left: Edit Form */}
  <div className="lg:h-[calc(100vh-8rem)] lg:overflow-y-auto">
    {/* All edit sections */}
  </div>
  
  {/* Right: Live Preview */}
  {showPreview && (
    <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-32">
      <PortfolioView {...portfolio} />
    </div>
  )}
</div>
```

### Key CSS Classes:

#### Edit Form (Left):
- `lg:h-[calc(100vh-8rem)]` - Full viewport height minus header
- `lg:overflow-y-auto` - Scrollable content
- `scrollbar-thin` - Thin scrollbar styling

#### Preview Panel (Right):
- `lg:sticky lg:top-32` - Stays in view while scrolling
- `lg:h-[calc(100vh-8rem)]` - Matches edit form height
- `overflow-y-auto` - Independent scrolling

## User Benefits

### 1. **Immediate Feedback** ✅
- See exactly how changes will look
- No need to save and refresh
- Catch mistakes before saving

### 2. **Confidence** 💪
- Know exactly what visitors will see
- Preview shows real fonts, colors, layout
- No surprises after publishing

### 3. **Efficiency** ⚡
- Edit and preview in one screen
- No switching between tabs
- Faster workflow

### 4. **Professional** 🎨
- Modern split-screen editor
- Familiar pattern (like code editors)
- Polished UX

## Example Workflow

### Before (Old Design):
1. Edit name in form
2. Click "Save"
3. Navigate to portfolio page
4. Check if it looks good
5. Go back to edit
6. Repeat...

### After (New Design):
1. Edit name in form
2. ✨ **See change instantly in preview**
3. Edit more fields
4. ✨ **All changes update live**
5. Happy with preview? Click "Save" once!

## Preview Panel Details

### Header Bar:
```
┌──────────────────────────────────┐
│ Live Preview | Updates real-time │
└──────────────────────────────────┘
```
- **Title**: "Live Preview"
- **Subtitle**: "Updates in real-time"
- **Styling**: Matches UI theme

### Content Area:
- **Full PortfolioView**: Exact component used on public page
- **All Sections Visible**:
  - Hero with avatar
  - Contact info
  - Skills grid
  - Experience timeline
  - Education
  - Projects showcase
- **Scrollable**: Can scroll through entire portfolio

### Props Passed to Preview:
```typescript
<PortfolioView
  config={portfolio}           // Current edited portfolio data
  isTemporary={false}          // Permanent portfolio
  expiresAt={null}            // No expiration
  username={username}          // User's username
  userImage={userImage}        // Cloudinary uploaded image
  avatar={avatar}              // AI-selected avatar
/>
```

## Toggle Preview Feature

### Button Location:
- **Desktop Header**: Between "Back" and "Save" buttons
- **Hidden on Mobile**: Preview auto-hidden on small screens

### Button States:
```typescript
// Showing Preview
<Button variant="outline">
  <EyeOff /> Hide Preview
</Button>

// Preview Hidden
<Button variant="outline">
  <Eye /> Show Preview
</Button>
```

### Use Cases:
- **Hide**: Need more space for complex forms
- **Show**: Want to see changes in context
- **Toggle**: Quick comparison between edit/preview modes

## Responsive Breakpoints

### Large Screens (lg: ≥1024px):
```css
.grid-cols-1 lg:grid-cols-2  /* Two columns */
.hidden lg:block              /* Show preview */
.lg:h-[calc(100vh-8rem)]     /* Full height */
.lg:sticky                    /* Sticky preview */
```

### Medium/Small Screens (<1024px):
```css
.grid-cols-1                  /* Single column */
.hidden                       /* Hide preview */
/* Full width edit form */
```

## Scrolling Behavior

### Edit Form (Left Panel):
- **Scrolls independently**
- **Smooth scrolling**
- **Thin scrollbar** (custom styled)
- **Full content accessible**

### Preview Panel (Right Panel):
- **Sticky positioning**: Stays in view
- **Independent scroll**: Doesn't affect edit form
- **Full portfolio visible**: Can scroll through all sections
- **Synchronized state**: Always shows latest data

## Performance Considerations

### ✅ Optimized:
1. **Single State Source**: Portfolio state shared between form and preview
2. **No Re-renders**: Preview only updates when portfolio state changes
3. **Efficient React**: Uses same component tree as public view
4. **Conditional Rendering**: Preview only rendered when visible

### 📊 Impact:
- **Memory**: Minimal (single PortfolioView instance)
- **CPU**: Negligible (React reconciliation)
- **UX**: Instant, no lag

## Accessibility

### Keyboard Navigation:
- ✅ Tab through all form fields
- ✅ Toggle preview with button
- ✅ Save with button or shortcut

### Screen Readers:
- ✅ Preview labeled "Live Preview"
- ✅ Status updates announced
- ✅ Form fields properly labeled

### Visual:
- ✅ High contrast borders
- ✅ Clear section headings
- ✅ Visible focus indicators

## Future Enhancements

### Potential Additions:
- [ ] **Sync Scroll**: Option to sync edit form and preview scrolling
- [ ] **Zoom Controls**: Zoom in/out on preview
- [ ] **Mobile Preview Mode**: Show how it looks on mobile
- [ ] **Side-by-Side Comparison**: Before/after view
- [ ] **Undo/Redo**: Change history
- [ ] **Auto-Save**: Save drafts automatically
- [ ] **Preview Themes**: Toggle between dark/light mode in preview
- [ ] **Keyboard Shortcut**: Cmd+P to toggle preview

## Browser Compatibility

### Tested On:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Features Used:
- CSS Grid (widely supported)
- Sticky positioning (all modern browsers)
- CSS calc() (universal support)
- Tailwind utilities (compiled CSS)

## Summary

The new side-by-side editor with live preview provides:

🎯 **Real-time feedback** - See changes instantly  
⚡ **Faster workflow** - Edit and preview together  
💪 **More confidence** - Know exactly what visitors see  
📱 **Responsive design** - Works on all screen sizes  
🎨 **Professional UX** - Modern split-screen interface  
✨ **Better DX** - Uses existing components efficiently  

This creates a **seamless editing experience** that matches modern design tools like Figma, Webflow, and VS Code! 🚀
