# Fancy Processing Animation

## Overview
A visually stunning processing animation that displays while uploading and processing resumes. Built using animated text components from reactbits.dev, this creates an engaging user experience during the AI processing stage.

## Components Used

### 1. ASCIIText
- **Source**: Custom implementation based on https://codepen.io/JuanFuentes/pen/eYEeoyE
- **Purpose**: Matrix-style ASCII animation with wave effects
- **Display**: "Cookin !" text with animated background
- **Duration**: First 2 seconds of animation

### 2. BlurText
- **Source**: https://reactbits.dev/r/BlurText-TS-TW
- **Purpose**: Animated text with blur-in effect
- **Used for**:
  - "Isn't this so cool?!" (appears at 2s)
  - "built with cerebras" (appears at 3.5s)
  - "in just" (appears at 5s)
- **Animation**: Words blur in from top direction with 150ms delay between words

### 3. ShinyText
- **Source**: https://reactbits.dev/r/ShinyText-TS-TW
- **Purpose**: Shimmering text effect
- **Display**: Processing time in seconds (appears at 6.5s)
- **Effect**: Animated shine gradient moving across text

## Animation Timeline

```
0.0s - ASCII animation starts ("Cookin !")
2.0s - BlurText #1 appears ("Isn't this so cool?!")
3.5s - BlurText #2 appears ("built with cerebras")
5.0s - BlurText #3 appears ("in just")
6.5s - ShinyText appears (processing time)
8.0s - Animation completes, redirects to portfolio
```

## Implementation

### File Structure
```
src/
├── components/
│   ├── ASCIIText.tsx          # Matrix-style ASCII animation
│   ├── BlurText.tsx           # Blur-in text animation
│   ├── ShinyText.tsx          # Shimmering text effect
│   └── ProcessingAnimation.tsx # Main orchestrator component
├── app/
│   ├── try/page.tsx           # Try without signup page
│   └── dashboard/page.tsx     # Dashboard page
└── app/globals.css            # Shine animation keyframes
```

### ProcessingAnimation Component

```typescript
interface ProcessingAnimationProps {
  startTime: number;          // Timestamp when upload started
  onComplete?: () => void;    // Callback when animation completes
}
```

**Features**:
- Full-screen overlay with black background
- Sequential animation stages
- Automatic time calculation
- Progress indicator dots
- Callback on completion

### Usage in Try Page

```typescript
const [uploading, setUploading] = useState(false)
const [startTime, setStartTime] = useState<number>(0)
const [portfolioSlug, setPortfolioSlug] = useState<string | null>(null)

const handleFileUpload = async (files: File[]) => {
  setUploading(true)
  setStartTime(Date.now())
  
  // Upload file...
  setPortfolioSlug(data.slug)
}

const handleAnimationComplete = () => {
  if (portfolioSlug) {
    router.push(`/${portfolioSlug}`)
  }
}

// Render
{uploading && (
  <ProcessingAnimation 
    startTime={startTime} 
    onComplete={handleAnimationComplete}
  />
)}
```

### Usage in Dashboard

```typescript
const [showProcessing, setShowProcessing] = useState(false)
const [startTime, setStartTime] = useState<number>(0)

const handleUpload = async (uploadFile?: File) => {
  setShowProcessing(true)
  setStartTime(Date.now())
  
  // Upload file...
}

const handleAnimationComplete = async () => {
  await fetchDashboardData() // Refresh portfolios
  setShowProcessing(false)
}

// Render
{showProcessing && (
  <ProcessingAnimation 
    startTime={startTime} 
    onComplete={handleAnimationComplete}
  />
)}
```

## Styling

### CSS Animations (globals.css)

```css
/* Shine animation for ShinyText component */
@keyframes shine {
  0% {
    background-position: 100%;
  }
  100% {
    background-position: -100%;
  }
}

.animate-shine {
  animation: shine 5s linear infinite;
}
```

### Component Styling

- **ASCIIText**: Black background (`#000`), green text (`#00ff00`), cyan accent for main text (`#00ffff`)
- **BlurText**: Customizable via className prop, white text by default
- **ShinyText**: Yellow text (`text-yellow-400`), gradient shine effect
- **Container**: Full-screen overlay (`fixed inset-0`), semi-transparent black background (`bg-black/95`)

## Performance Considerations

1. **Canvas Rendering**: ASCIIText uses HTML5 Canvas for smooth animation
2. **Animation Cleanup**: All timers are properly cleaned up in useEffect
3. **Frame Management**: ASCIIText animation frames are managed efficiently
4. **Z-Index**: Uses `z-50` to ensure overlay appears above all content

## Customization

### Adjust Animation Duration

Edit `ProcessingAnimation.tsx`:
```typescript
// Current timings (in milliseconds)
const timer1 = setTimeout(() => setStage(1), 2000);    // Stage 1
const timer2 = setTimeout(() => setStage(2), 3500);    // Stage 2
const timer3 = setTimeout(() => setStage(3), 5000);    // Stage 3
const timer4 = setTimeout(() => setStage(4), 6500);    // Stage 4
const timer5 = setTimeout(() => {...}, 8000);          // Calculate time
const timer6 = setTimeout(() => {...}, 10000);         // Complete
```

### Change Text Content

```typescript
// In ProcessingAnimation.tsx
<ASCIIText text="Your Text!" ... />
<BlurText text="Your message here" ... />
<ShinyText text={`${processingTime} seconds!`} ... />
```

### Modify Colors

```typescript
// Example: Change ShinyText color
<ShinyText 
  text={`${processingTime} seconds!`}
  className="text-5xl font-bold text-purple-500" // Changed from yellow-400
/>
```

## Testing

### Manual Test Flow

1. Navigate to `/try` or `/dashboard`
2. Upload a PDF or DOCX resume
3. Observe animation sequence:
   - ASCII matrix animation
   - Text blur-in effects
   - Processing time display
4. Wait for redirect/refresh

### Expected Behavior

- ✅ Animation starts immediately on upload
- ✅ Each stage appears at correct time
- ✅ Progress dots update with each stage
- ✅ Processing time is calculated accurately
- ✅ Animation completes and triggers callback
- ✅ User is redirected or dashboard refreshes

## Troubleshooting

### Animation doesn't show
- Check that `uploading`/`showProcessing` state is set to `true`
- Verify `startTime` is being set with `Date.now()`

### Text doesn't appear
- Check browser console for component errors
- Verify all components are properly imported
- Ensure Framer Motion is installed (`motion/react`)

### Animation freezes
- Check for JavaScript errors in console
- Verify all timers are properly cleaned up
- Ensure component is unmounted when animation completes

### Processing time is incorrect
- Verify `startTime` is set at the start of upload, not when processing begins
- Check that time calculation uses `Date.now()` correctly

## Future Enhancements

- [ ] Add sound effects for each stage
- [ ] Make animation duration configurable via props
- [ ] Add skip button for users who want to bypass animation
- [ ] Support for custom text messages per stage
- [ ] Add error state animation for failed uploads
- [ ] Implement pause/resume functionality
- [ ] Add particle effects or additional visual flourishes
- [ ] Create different animation themes (minimal, retro, futuristic)
