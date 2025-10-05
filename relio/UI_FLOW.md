# Section Reordering - UI Flow

## User Journey

### Step 1: Navigate to Edit Page
User clicks "Edit" on their portfolio from the dashboard → Navigates to `/dashboard/edit?slug=portfolio-slug`

### Step 2: Open Section Order Panel
1. On the left sidebar, find the "Section Order" collapsible panel
2. Click to expand it
3. See a list of all portfolio sections with drag handles (GripVertical icon)

### Step 3: Drag and Drop
1. Click and hold on any section (cursor changes to move cursor)
2. Drag up or down to reorder
3. Visual feedback:
   - Dragged item becomes 50% transparent
   - Sections highlight on hover
   - Border color changes to primary on hover
4. Drop in desired position

### Step 4: Preview Changes
- Right side preview (70% width) shows real-time portfolio preview
- Sections reorder immediately in the preview
- Background colors alternate for better visual separation

### Step 5: Save
Click "Save Changes" button at the top or bottom of the page
- Changes persist to database
- Section order saved in portfolio config JSON

## Visual Elements

### Section Order Panel (Collapsed)
```
┌──────────────────────────────────────┐
│ Section Order              [▼]       │
└──────────────────────────────────────┘
```

### Section Order Panel (Expanded)
```
┌──────────────────────────────────────┐
│ Section Order              [▲]       │
├──────────────────────────────────────┤
│ Drag sections to reorder how they   │
│ appear on your portfolio             │
│                                      │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Skills                    │   │ ← Draggable
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Experience                │   │ ← Draggable
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Education                 │   │ ← Draggable
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Projects                  │   │ ← Draggable
│ └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

### During Drag
```
┌──────────────────────────────────────┐
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Skills                    │   │
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Education                 │   │ ← Drop target (highlighted)
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Experience (dragging...)  │   │ ← 50% opacity
│ └──────────────────────────────┘   │
│ ┌──────────────────────────────┐   │
│ │ ≡≡ Projects                  │   │
│ └──────────────────────────────┘   │
└──────────────────────────────────────┘
```

## Code Flow

### 1. State Management
```typescript
const [draggedSection, setDraggedSection] = useState<string | null>(null)
const DEFAULT_SECTION_ORDER = ['skills', 'experience', 'education', 'projects']
```

### 2. Drag Handlers
```typescript
handleDragStart(e, sectionName) → Sets draggedSection state
handleDragOver(e) → Prevents default, allows drop
handleDrop(e, targetSection) → Reorders array, updates portfolio state
handleDragEnd() → Clears draggedSection state
```

### 3. Rendering
```typescript
// Edit page renders sections in order
{(portfolio?.sectionOrder || DEFAULT_SECTION_ORDER).map(sectionKey => ...)}

// Portfolio view renders sections dynamically
{sectionOrder.map((sectionKey, index) => renderSection(sectionKey, index))}
```

## Data Structure

### Before Reordering
```json
{
  "sectionOrder": ["skills", "experience", "education", "projects"]
}
```

### After Reordering (Projects moved to first)
```json
{
  "sectionOrder": ["projects", "skills", "experience", "education"]
}
```

## Implementation Details

### HTML5 Drag and Drop API
- Uses native `draggable` attribute
- Event handlers: `onDragStart`, `onDragOver`, `onDrop`, `onDragEnd`
- No external libraries required
- Works on all modern browsers

### Styling
- Cursor changes to `move` on hover
- 50% opacity during drag
- Border highlight on hover (`hover:border-primary`)
- Smooth transitions

### Accessibility
- Keyboard support via native drag/drop
- Visual feedback for all states
- Clear labels and icons
