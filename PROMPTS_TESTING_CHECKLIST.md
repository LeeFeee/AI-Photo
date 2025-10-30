# Prompts Library Testing Checklist

## 🎯 Core Functionality Tests

### Membership Gating
- [ ] **Guest Mode (未登录)**
  - [ ] Prompt card shows preview image
  - [ ] Prompt card shows name and category
  - [ ] Prompt card shows description
  - [ ] Prompt content is blurred with `blur-sm` effect
  - [ ] Lock icon is visible on card
  - [ ] Click card opens modal
  - [ ] Modal shows blurred prompt content
  - [ ] Modal shows "登录 / 注册" CTA
  - [ ] Modal explains membership benefits
  - [ ] Cannot copy prompt content

- [ ] **Non-Member Mode (已登录非会员)**
  - [ ] Same blur and lock behavior as guest
  - [ ] Modal shows "成为会员" CTA instead of login
  - [ ] Shows membership upsell messaging
  - [ ] Different CTA text than guest mode

- [ ] **Member Mode (会员)**
  - [ ] No blur on prompt content
  - [ ] No lock icons
  - [ ] "会员内容" badge visible on cards
  - [ ] Can see full prompt content in modal
  - [ ] Copy button works (copies to clipboard)
  - [ ] Shows toast notification on copy
  - [ ] "使用此提示词" button visible
  - [ ] Click "使用此提示词" stores in localStorage
  - [ ] Shows success toast on selection

### Search & Filter
- [ ] **Search Functionality**
  - [ ] Search box is visible and accessible
  - [ ] Type text filters results in real-time
  - [ ] Search matches prompt name
  - [ ] Search matches prompt description
  - [ ] Search matches prompt content (even for non-members)
  - [ ] Empty state shows when no matches
  - [ ] Clear search shows all prompts again

- [ ] **Category Filter**
  - [ ] 7 category buttons visible (全部, 风景, 人物, 抽象, 动物, 建筑, 艺术)
  - [ ] Each button has correct color coding
  - [ ] Click category filters prompts
  - [ ] Active category has different styling
  - [ ] "全部" shows all prompts
  - [ ] Can combine search + category filter
  - [ ] Empty state shows when category has no prompts

### UI Components
- [ ] **Prompt Cards**
  - [ ] Preview images load correctly
  - [ ] Images are optimized (Next.js Image)
  - [ ] Hover effect scales card slightly
  - [ ] Card has smooth animation on page load
  - [ ] Staggered animation delay (50ms per card)
  - [ ] Category badge shows correct category
  - [ ] Description truncates to 2 lines
  - [ ] Card is keyboard accessible (Tab)
  - [ ] Enter/Space opens modal

- [ ] **Prompt Detail Modal**
  - [ ] Opens with smooth scale-in animation
  - [ ] Backdrop shows with blur effect
  - [ ] Full preview image displays
  - [ ] Title and description visible
  - [ ] Category badge in header
  - [ ] Close button (X) works
  - [ ] Click outside closes modal
  - [ ] Escape key closes modal
  - [ ] Scrollable on small screens
  - [ ] Copy button has icon
  - [ ] Copy button shows "已复制" after click
  - [ ] Use button links to /generate

- [ ] **Loading States**
  - [ ] Skeleton cards show during initial load
  - [ ] Skeleton has pulse animation
  - [ ] 9 skeleton cards visible in grid
  - [ ] Loading spinner shows in loading.tsx
  - [ ] "加载提示词库中..." text visible

- [ ] **Empty States**
  - [ ] Shows when search has no results
  - [ ] Shows appropriate icon (Search or Sparkles)
  - [ ] Clear messaging based on context
  - [ ] Suggests actions (adjust search, browse categories)

### Layout & Responsive Design
- [ ] **Mobile (< 768px)**
  - [ ] 1 column grid layout
  - [ ] Search box full width
  - [ ] Category buttons wrap properly
  - [ ] Cards are touch-friendly (min 44px targets)
  - [ ] Modal fits screen with proper margins
  - [ ] Modal is scrollable
  - [ ] Text is readable (no tiny fonts)

- [ ] **Tablet (768px - 1024px)**
  - [ ] 2 column grid layout
  - [ ] Search box in header (right side)
  - [ ] Category buttons in single row if possible
  - [ ] Cards maintain aspect ratio

- [ ] **Desktop (> 1024px)**
  - [ ] 3 column grid layout
  - [ ] Search box 384px wide
  - [ ] All category buttons visible in one row
  - [ ] Modal max-width 768px (2xl)

### Accessibility
- [ ] **Keyboard Navigation**
  - [ ] Tab through all interactive elements
  - [ ] Focus states clearly visible (ring-2)
  - [ ] Enter/Space activates buttons
  - [ ] Escape closes modal
  - [ ] Focus trapped in modal when open
  - [ ] Focus returns to trigger after close

- [ ] **Screen Readers**
  - [ ] Search input has label (sr-only)
  - [ ] Cards have aria-label
  - [ ] Modal has proper aria-labelledby
  - [ ] Buttons have descriptive labels
  - [ ] Icons have aria-hidden="true"
  - [ ] Lock icons explained by text
  - [ ] Category buttons have aria-pressed

- [ ] **Semantic HTML**
  - [ ] Proper heading hierarchy (h1 → h2)
  - [ ] Section elements with labelledby
  - [ ] List role on grid
  - [ ] Listitem role on cards
  - [ ] Button vs link appropriately used

### Additional Features
- [ ] **Membership Switcher (Dev Only)**
  - [ ] Orange card visible in development
  - [ ] Shows current membership status
  - [ ] Three buttons to toggle status
  - [ ] Status updates immediately
  - [ ] Cards re-render with new status
  - [ ] Hidden in production build

- [ ] **CTAs & Upsells**
  - [ ] "需要自定义提示词?" section visible
  - [ ] Gradient background (brand → accent)
  - [ ] "前往生成页面" button links correctly
  - [ ] Non-members see membership benefits section
  - [ ] Benefits section has checkmarks
  - [ ] Members don't see upsell

- [ ] **Animations**
  - [ ] Page fade-in on mount
  - [ ] Cards stagger in (50ms delay each)
  - [ ] Hover scale on cards smooth
  - [ ] Hover scale on category buttons
  - [ ] Dialog opens with scale-in
  - [ ] Dialog closes with fade-out
  - [ ] Backdrop fades in/out
  - [ ] Toast notifications animate

## 🔍 Edge Cases & Error Handling
- [ ] No prompts in database (empty state)
- [ ] Network error during fetch (error state)
- [ ] Image fails to load (alt text)
- [ ] Very long prompt content (scrollable)
- [ ] Very long prompt name (truncate/wrap)
- [ ] Copy fails (error toast)
- [ ] Slow network (loading state persists)
- [ ] Multiple rapid category clicks
- [ ] Rapid search typing (debounce not needed yet)

## 🎨 Visual Polish
- [ ] Consistent spacing (6-unit gaps)
- [ ] Smooth transitions (200ms)
- [ ] Brand colors used correctly
- [ ] No layout shift on load
- [ ] Images maintain aspect ratio
- [ ] Text contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Hover states obvious
- [ ] Loading states not jarring

## 📱 Cross-Browser Testing
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## ⚡ Performance
- [ ] Page loads in < 2 seconds
- [ ] Images are optimized/compressed
- [ ] No console errors
- [ ] No console warnings
- [ ] Bundle size reasonable
- [ ] Code splitting working
- [ ] No memory leaks (check DevTools)

## 📊 Lighthouse Audit Goals
- [ ] Performance: > 85
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90

---

## Test Results

**Date**: _________________
**Tester**: _________________
**Environment**: _________________

### Summary
- Total Tests: _____ / _____
- Passed: _____
- Failed: _____
- Blocked: _____

### Critical Issues
1. 
2. 
3. 

### Minor Issues
1. 
2. 
3. 

### Recommendations
1. 
2. 
3. 
