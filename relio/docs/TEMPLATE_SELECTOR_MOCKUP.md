# Template Selector - Visual Mockup

## Dashboard View

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Relio Dashboard                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Welcome back, John Doe!                                            │
│  Manage your portfolio and keep it up to date                       │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Your Portfolios (2)                    [+ Create New Portfolio]│ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📁 John Smith - Full Stack Developer           [Default]    │   │
│  │ /john-smith-developer                                       │   │
│  │                                          [Edit] [↗] [🗑️]     │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ Name: John Smith                Title: Full Stack Developer │   │
│  │                                                              │   │
│  │ Skills: React  TypeScript  Node.js  Python  AWS  +5 more   │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ Portfolio Design Template                                    │   │
│  │ ┌─────────────────────┐  ┌──────────────────────┐          │   │
│  │ │    Classic      ✓   │  │     Animated         │          │   │
│  │ │                     │  │                      │          │   │
│  │ │ Clean &             │  │ Modern with          │          │   │
│  │ │ professional        │  │ smooth animations    │          │   │
│  │ │ design              │  │                      │          │   │
│  │ │                     │  │                      │          │   │
│  │ │ [Fast] [Simple]     │  │ [✨ Effects]         │          │   │
│  │ │                     │  │ [Creative]           │          │   │
│  │ └─────────────────────┘  └──────────────────────┘          │   │
│  │ 📄 Your portfolio uses a clean, professional layout         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📁 Jane Designer - Creative Director                        │   │
│  │ /jane-creative-designer                                     │   │
│  │                                          [Edit] [↗] [🗑️]     │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ Name: Jane Designer              Title: Creative Director   │   │
│  │                                                              │   │
│  │ Skills: Figma  Adobe XD  UI/UX  Branding  Typography       │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │ Portfolio Design Template                                    │   │
│  │ ┌─────────────────────┐  ┌──────────────────────┐          │   │
│  │ │    Classic          │  │     Animated     ✓   │          │   │
│  │ │                     │  │                      │          │   │
│  │ │ Clean &             │  │ Modern with          │          │   │
│  │ │ professional        │  │ smooth animations    │          │   │
│  │ │ design              │  │                      │          │   │
│  │ │                     │  │                      │          │   │
│  │ │ [Fast] [Simple]     │  │ [✨ Effects]         │          │   │
│  │ │                     │  │ [Creative]           │          │   │
│  │ └─────────────────────┘  └──────────────────────┘          │   │
│  │ 🎨 Your portfolio uses smooth animations and aurora...      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Template Cards - Detailed View

### Classic Template Card (Selected)
```
┌─────────────────────────────────────┐
│  Classic                        ✓   │ ← Checkmark when selected
│                                     │
│  Clean & professional design        │ ← Description
│                                     │
│  [Fast] [Simple]                    │ ← Feature tags
└─────────────────────────────────────┘
   Border: Primary color (selected)
   Background: Primary/5 opacity
```

### Animated Template Card (Unselected)
```
┌─────────────────────────────────────┐
│  Animated                           │ ← No checkmark
│                                     │
│  Modern with smooth animations      │ ← Description
│                                     │
│  [✨ Effects] [Creative]            │ ← Feature tags
└─────────────────────────────────────┘
   Border: Muted gray (unselected)
   Background: Transparent
   Hover: Border becomes primary/50
```

## Status Messages

### When Classic is Selected
```
📄 Your portfolio uses a clean, professional layout
```

### When Animated is Selected
```
🎨 Your portfolio uses smooth animations and aurora background
```

## Interaction States

### 1. Hover State (Unselected Card)
```
┌─────────────────────────────────────┐
│  Animated                           │
│                                     │
│  Modern with smooth animations      │
│                                     │
│  [✨ Effects] [Creative]            │
└─────────────────────────────────────┘
   Border: Primary/50 (lighter primary)
   Background: Slight hover effect
   Cursor: Pointer
```

### 2. Active/Selected State
```
┌─────────────────────────────────────┐
│  Classic                        ✓   │
│                                     │
│  Clean & professional design        │
│                                     │
│  [Fast] [Simple]                    │
└─────────────────────────────────────┘
   Border: Primary (full color)
   Background: Primary/5
   Checkmark: Visible
```

### 3. Click Animation
```
Click → Brief scale down → Update → Scale back up
```

## Mobile View

```
┌───────────────────────────────────┐
│  Portfolio Design Template        │
├───────────────────────────────────┤
│                                   │
│  ┌─────────────────────────────┐ │
│  │  Classic              ✓     │ │
│  │                             │ │
│  │  Clean & professional       │ │
│  │  design                     │ │
│  │                             │ │
│  │  [Fast] [Simple]            │ │
│  └─────────────────────────────┘ │
│                                   │
│  ┌─────────────────────────────┐ │
│  │  Animated                   │ │
│  │                             │ │
│  │  Modern with smooth         │ │
│  │  animations                 │ │
│  │                             │ │
│  │  [✨ Effects] [Creative]    │ │
│  └─────────────────────────────┘ │
│                                   │
│  📄 Your portfolio uses a clean,  │
│     professional layout           │
└───────────────────────────────────┘
```

## Color Palette

### Classic Template Card
```
Selected:
  Border: hsl(var(--primary))
  Background: hsl(var(--primary) / 0.05)
  Text: hsl(var(--foreground))
  
Unselected:
  Border: hsl(var(--border))
  Background: transparent
  Text: hsl(var(--foreground))
  
Hover:
  Border: hsl(var(--primary) / 0.5)
```

### Animated Template Card
```
Same as Classic but applied to the other card
```

### Tags
```
Background: hsl(var(--muted))
Text: hsl(var(--muted-foreground))
Padding: 4px 8px
Border-radius: 4px
Font-size: 12px
```

## Responsive Breakpoints

### Desktop (> 768px)
```
Grid: 2 columns (side by side)
Card padding: 16px
Gap: 12px
```

### Mobile (< 768px)
```
Stack: 1 column (vertical)
Card padding: 16px
Gap: 12px
Full width cards
```

## Animation Timeline

### Template Switch Animation
```
0ms  : User clicks template card
50ms : Card scales down slightly (0.98)
100ms: API call initiated
200ms: Response received
250ms: UI updates
300ms: Card scales back to normal (1.0)
350ms: Checkmark animates in
400ms: Status message fades in
```

## Accessibility Features

### Keyboard Navigation
```
Tab → Focuses on first template card
Tab → Focuses on second template card
Enter/Space → Selects focused card
Shift+Tab → Navigate backwards
```

### Screen Reader Announcements
```
"Classic template button"
"Selected" (if active)
"Clean and professional design"
"Modern with smooth animations"
"Template updated successfully"
```

### Focus Indicators
```
Outline: 2px solid primary
Offset: 2px
Visible on keyboard focus only
```

## User Journey Flow

```
┌─────────────────┐
│ User on         │
│ Dashboard       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sees portfolio  │
│ cards           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Scrolls to      │
│ template        │
│ selector        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Sees Classic ✓  │
│ and Animated    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Clicks          │
│ "Animated"      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Card animates   │
│ Checkmark moves │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Status updates  │
│ to "animations" │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Clicks external │
│ link to view    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Portfolio opens │
│ with Animated   │
│ template        │
└─────────────────┘
```

## Error States

### API Error
```
┌─────────────────────────────────────┐
│ ⚠️ Failed to update template        │
│    Please try again                 │
└─────────────────────────────────────┘
   Background: Destructive/10
   Border: Destructive
   Text: Destructive foreground
```

### Loading State (Optional)
```
┌─────────────────────────────────────┐
│  Animated              ⏳           │
│                                     │
│  Updating template...               │
└─────────────────────────────────────┘
   Spinner appears during update
```

## Tooltips (Future Enhancement)
```
Hover over template card:
  ┌─────────────────────────┐
  │ Click to apply this     │
  │ template to your        │
  │ portfolio               │
  └─────────────────────────┘
```

---

**Visual Guide Complete**

This mockup shows exactly what users will see when managing their portfolio templates in the dashboard.
