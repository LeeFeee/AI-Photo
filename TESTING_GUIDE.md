# Testing Guide

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint check
npm run lint
```

Visit: http://localhost:3000

---

## Manual Testing Checklist

### Pages to Test

- [ ] **Home** (`/`) - Hero, features, CTAs
- [ ] **Prompts** (`/prompts`) - Category grid, search
- [ ] **Generate** (`/generate`) - Input, presets, generation
- [ ] **Dashboard** (`/dashboard`) - Image grid, empty state
- [ ] **404** (visit `/test`) - Error page

### Responsive Testing

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test these viewports:
   - Mobile: 375px (iPhone)
   - Tablet: 768px (iPad)
   - Desktop: 1920px

### Mobile Menu

1. Resize to < 768px
2. Click hamburger icon (top-right)
3. Verify drawer slides in from right
4. Click backdrop to dismiss
5. Click menu item to navigate
6. Verify menu closes on navigation

### Interactions to Test

- [ ] Hover over buttons (color + shadow changes)
- [ ] Hover over cards (scale + shadow)
- [ ] Click buttons (scale down active state)
- [ ] Focus elements with Tab (visible ring)
- [ ] Generate image with preset prompt
- [ ] See loading spinner during generation
- [ ] See toast notification on success

### Accessibility Testing

- [ ] Navigate entire site with keyboard only
- [ ] Tab through all interactive elements
- [ ] Verify focus is always visible
- [ ] Use screen reader (NVDA/JAWS) to test
- [ ] Verify all images have alt text
- [ ] Check form labels are associated

---

## Lighthouse Testing

### Run Lighthouse Audit

1. **Open Chrome DevTools** (F12)
2. **Go to Lighthouse tab**
3. **Configuration**:
   - Device: Desktop & Mobile
   - Categories: All (Performance, Accessibility, Best Practices, SEO)
   - Mode: Navigation
4. **Click "Analyze page load"**

### Expected Scores (Development Build)

#### Desktop

- Performance: 85-95
- Accessibility: 95-100
- Best Practices: 90-95
- SEO: 95-100

#### Mobile

- Performance: 80-90
- Accessibility: 95-100
- Best Practices: 90-95
- SEO: 95-100

### Common Issues & Fixes

#### If Performance < 85

- External images (Picsum) may slow down
- In production, replace with optimized images
- Use Next.js Image component

#### If Accessibility < 90

- Check console for ARIA errors
- Verify color contrast
- Test keyboard navigation

#### If SEO < 90

- Verify meta tags are rendering
- Check robots.txt accessibility
- Ensure proper heading structure

---

## Color Contrast Testing

### Tool: Chrome DevTools

1. Inspect element
2. Check "Contrast ratio" in Styles panel

### Minimum Ratios (WCAG AA)

- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

### Our Implementation

- Text on white (gray-900): 21:1 ✓
- Body text (gray-600): 7:1 ✓
- Links (brand-600): 4.5:1 ✓

---

## Keyboard Navigation Testing

### Navigation Flow

1. Start at top of page
2. Press **Tab** repeatedly
3. Verify order follows visual layout
4. Check all interactive elements are reachable

### Elements to Reach

- [ ] Logo link
- [ ] Navigation links
- [ ] Hamburger menu (mobile)
- [ ] All buttons
- [ ] All links
- [ ] Form inputs
- [ ] Card elements (if clickable)

### Focus Indicators

- Should see blue ring on focused element
- Ring should be clearly visible
- No hidden focus states

---

## Screen Reader Testing

### Tools

- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS, built-in)

### Test Points

- [ ] Page title announced
- [ ] Landmarks identified (header, main, nav, footer)
- [ ] Headings read in order
- [ ] Button labels are descriptive
- [ ] Image alt text is meaningful
- [ ] Form labels are associated
- [ ] Loading states announced

### VoiceOver (macOS)

```
Cmd + F5 to enable
Ctrl + Option + Arrow Keys to navigate
Ctrl + Option + Space to activate
```

---

## Cross-Browser Testing

### Browsers to Test

- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Edge

### Features to Verify

- [ ] Layout renders correctly
- [ ] Animations work smoothly
- [ ] Focus states visible
- [ ] Toast notifications appear
- [ ] Drawer navigation works
- [ ] Responsive breakpoints trigger

---

## Performance Testing

### Chrome DevTools Performance Tab

1. Open DevTools > Performance
2. Click Record
3. Navigate through site
4. Stop recording
5. Analyze results

### Key Metrics

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TBT** (Total Blocking Time): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Network Tab

- Check bundle sizes
- Verify no 404 errors
- Check API response times (if applicable)

---

## Chinese Text Testing

### Verify

- [ ] All UI text is in Simplified Chinese
- [ ] Font renders correctly
- [ ] No English fallbacks (except brand name "AI Photo")
- [ ] Character spacing is appropriate
- [ ] Line breaks work correctly

### Pages to Check

- Home page hero text
- Navigation labels
- Button text
- Form labels
- Error messages
- Empty states
- Loading states
- Toast notifications

---

## Animation Testing

### Smooth Transitions

- [ ] Buttons scale on click (active:scale-95)
- [ ] Cards scale on hover (hover:scale-105)
- [ ] Colors transition smoothly
- [ ] Shadows elevate on hover
- [ ] Spinner rotates smoothly
- [ ] Drawer slides in/out
- [ ] Toasts fade in/out

### Performance

- No janky animations
- 60 FPS maintained
- No layout shifts

---

## Responsive Grid Testing

### Breakpoint Checks

#### Mobile (< 768px)

- [ ] Single column grids
- [ ] Stacked layouts
- [ ] Full-width elements
- [ ] Readable text size
- [ ] Touch targets ≥ 44px

#### Tablet (768px - 1024px)

- [ ] 2-column grids (where appropriate)
- [ ] Sidebar layouts
- [ ] Comfortable spacing

#### Desktop (> 1024px)

- [ ] 3-column grids
- [ ] Side-by-side layouts
- [ ] Optimal line length

---

## SEO Testing

### Meta Tags Check

1. View page source (Ctrl+U)
2. Look for:
   - [ ] `<title>` tag
   - [ ] `<meta name="description">`
   - [ ] `<meta property="og:*">` (OpenGraph)
   - [ ] `<meta name="twitter:*">`
   - [ ] `<link rel="canonical">`

### Tools

- **Google Search Console** (after deployment)
- **OpenGraph Debugger**: https://www.opengraph.xyz
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator

### Files to Check

- [ ] `/robots.txt` accessible
- [ ] `/sitemap.xml` accessible
- [ ] All pages have unique titles
- [ ] All pages have descriptions

---

## Load Testing

### Simulate Slow Network

1. Chrome DevTools > Network tab
2. Throttling: "Slow 3G"
3. Reload page
4. Verify:
   - [ ] Loading states appear
   - [ ] Content loads progressively
   - [ ] No layout shifts
   - [ ] Spinners show for async operations

---

## Error Testing

### Trigger Errors

1. **404 Page**: Visit `/invalid-url`
   - Verify friendly 404 page
   - Action buttons work
2. **Error Boundary**: Simulate component error
   - Verify error boundary catches it
   - Shows user-friendly message
   - Refresh button works

---

## Form Testing (Generate Page)

### Test Cases

1. **Empty submission**
   - Click "生成图片" without prompt
   - Verify error toast appears
2. **Text input**
   - Type custom prompt
   - Verify textarea updates
3. **Preset selection**
   - Click preset button
   - Verify textarea fills
4. **Generation**
   - Submit with prompt
   - Verify loading state
   - Verify success toast
   - Verify result displays
5. **Reset**
   - Click reset button
   - Verify form clears
   - Verify success toast

---

## Device Testing Matrix

### Recommended Devices

- **Desktop**: Windows 10/11, macOS
- **Mobile**: iPhone 12+, Samsung Galaxy S21+
- **Tablet**: iPad Pro, Samsung Tab

### Orientations

- Portrait
- Landscape

---

## Final Checklist

Before marking complete:

- [ ] All pages load without errors
- [ ] Console is clean (no errors)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] All links work
- [ ] All buttons function
- [ ] Mobile menu works
- [ ] Forms submit correctly
- [ ] Animations are smooth
- [ ] Text is readable
- [ ] Images have alt text
- [ ] Keyboard navigation works
- [ ] Focus is always visible
- [ ] Lighthouse scores meet targets
- [ ] Chinese text renders correctly

---

## Reporting Issues

If you find issues, document:

1. **What**: Description of the issue
2. **Where**: Page/component affected
3. **How to reproduce**: Step-by-step
4. **Expected**: What should happen
5. **Actual**: What actually happens
6. **Screenshot**: If visual issue
7. **Browser/Device**: Environment details

---

## Quick Reference

### Key URLs

- Home: `http://localhost:3000/`
- Prompts: `http://localhost:3000/prompts`
- Generate: `http://localhost:3000/generate`
- Dashboard: `http://localhost:3000/dashboard`
- 404: `http://localhost:3000/test`

### Key Commands

```bash
npm install      # Install dependencies
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # Lint check
```

### Keyboard Shortcuts

- **Tab**: Next element
- **Shift+Tab**: Previous element
- **Enter/Space**: Activate button
- **Esc**: Close modal/drawer
- **F12**: DevTools
- **Ctrl+Shift+M**: Toggle device toolbar

---

**Happy Testing! 🧪**
