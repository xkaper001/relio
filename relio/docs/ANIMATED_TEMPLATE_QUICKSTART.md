# 🎨 Animated Portfolio Template - Quick Start Guide

## What's New?

Relio now has a **stunning animated portfolio template** with:

- ✨ **Aurora Background**: Beautiful WebGL shader effects with northern lights
- 🎭 **Smooth Animations**: Framer Motion powered scroll and hover effects
- 🎯 **Active Navigation**: Auto-highlighting navigation based on scroll position
- 💫 **Interactive Elements**: Hover, tap, and scroll animations throughout
- 📱 **Fully Responsive**: Works perfectly on all devices

## Quick Test

### Option 1: Using the Script (Easiest)

```bash
# Update an existing portfolio to use animated template
node scripts/update-template.js <your-portfolio-slug> animated

# Example:
node scripts/update-template.js john-smith-developer animated

# Switch back to default:
node scripts/update-template.js john-smith-developer default
```

### Option 2: Manual Database Update

```sql
-- Find your portfolio slug first
SELECT slug, template FROM "Portfolio";

-- Update to animated template
UPDATE "Portfolio" 
SET template = 'animated' 
WHERE slug = 'your-portfolio-slug';

-- Verify
SELECT slug, template FROM "Portfolio" WHERE slug = 'your-portfolio-slug';
```

### Option 3: Via API (when implemented)

```typescript
const response = await fetch('/api/portfolio', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'your-slug',
    template: 'animated'
  })
})
```

## View Your Animated Portfolio

1. Update template using one of the methods above
2. Navigate to: `http://localhost:3000/<your-portfolio-slug>`
3. Enjoy the animations! 🎉

## Features in Action

### 1. Aurora Background
- WebGL-powered animated gradient
- Northern lights effect
- Subtle color shifts (purple, blue, teal)
- Performance optimized

### 2. Scroll Animations
- **Hero Section**: Fades in with your profile
- **About**: Slides up when scrolled into view
- **Experience**: Cards stagger animate in
- **Skills**: Tags pop in with rotation
- **Projects**: Grid items animate sequentially
- **Education**: Smooth reveal

### 3. Interactive Hover Effects
- **Experience Cards**: Lift up on hover with background glow
- **Project Cards**: Rise animation with shadow
- **Skill Tags**: Scale and rotate
- **Social Icons**: Vertical bounce
- **Navigation**: Smooth color transitions

### 4. Smart Navigation
- Fixed header with blur backdrop
- Auto-highlights active section
- Smooth scroll to sections
- Mobile-friendly hamburger menu (if added)

## Comparing Templates

| Feature | Default | Animated |
|---------|---------|----------|
| Load Speed | ⚡ Very Fast | ⚡ Fast |
| Animations | ❌ None | ✅ Full |
| Background | Static | Aurora |
| Interactivity | Basic | Advanced |
| Best For | Professional | Creative |
| File Size | Small | Medium |
| Browser Support | All | Modern |

## Template Selection Guide

**Choose Default if:**
- You want fastest load times
- Professional/corporate audience
- Simple, clean design preference
- Minimal animations needed

**Choose Animated if:**
- You're in a creative field
- Want to stand out
- Modern tech audience
- Showcase technical skills

## Customization Ideas

The animated template can be customized:

### Colors
Edit `PortfolioViewAnimated.tsx`:
```typescript
// Change gradient colors
<span className="bg-gradient-to-r from-primary to-purple-500">
  {config.title}
</span>

// Change to different colors:
<span className="bg-gradient-to-r from-blue-500 to-cyan-500">
  {config.title}
</span>
```

### Animation Speed
```typescript
// Faster animations
transition={{ duration: 0.3 }}

// Slower animations
transition={{ duration: 1.0 }}
```

### Hover Effects
```typescript
// More dramatic lift
whileHover={{ y: -20 }}

// Subtle lift
whileHover={{ y: -5 }}
```

## Performance

Optimizations in place:
- ✅ Animations run at 60fps
- ✅ Three.js cleanup on unmount
- ✅ One-time scroll animations
- ✅ Efficient shader calculations
- ✅ Responsive image loading

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ Requires WebGL for aurora background

## Troubleshooting

### Aurora background not showing
- Check browser supports WebGL
- Open browser console for errors
- Try different browser

### Animations choppy
- Close other heavy tabs
- Reduce animation complexity
- Check CPU/GPU usage

### Template not updating
1. Clear browser cache
2. Restart dev server
3. Verify database update
4. Check Prisma client regenerated

## Next Steps

1. **Test both templates**: Upload a resume and switch between them
2. **Customize colors**: Match your brand/personality
3. **Add more sections**: Extend the template
4. **Share feedback**: Let us know what you think!

## Examples

### Default Template
```
http://localhost:3000/john-smith-developer
(Set template = 'default')
```

### Animated Template
```
http://localhost:3000/john-smith-developer
(Set template = 'animated')
```

## Support

Having issues? Check:
1. [Portfolio Templates Documentation](./PORTFOLIO_TEMPLATES.md)
2. Dev server console logs
3. Browser console errors
4. Prisma client updated (`npx prisma generate`)

---

**Enjoy your new animated portfolio! 🚀✨**
