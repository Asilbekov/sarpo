# Task 5 - Mobile Layout Redesign

## Summary
Redesigned the SARPO e-commerce mobile layout to match design mockups. All changes target the `md:` breakpoint boundary (mobile below md, desktop at md and above).

## Changes Made

### Header (Mobile)
- Hamburger menu (≡) on LEFT, white on maroon background
- SARPO logo CENTERED using absolute positioning on mobile
- Search icon + Cart icon as white circular buttons on RIGHT
- Header height: 56px on mobile
- Logo size: h-10 on mobile
- Nav bar hidden on mobile (`hidden md:block`)
- Full-height slide-out drawer from LEFT with:
  - Semi-transparent overlay
  - Maroon header with "Меню" + X close button
  - Collection links as list items
  - Smooth slide animation (translate-x)
  - Body scroll lock when open

### Hero Section (Mobile)
- minHeight: 280px on mobile
- Title: text-xl on mobile
- Subtitle: text-[11px] on mobile
- Carousel arrows: w-6 h-6 on mobile
- Carousel dots: smaller on mobile (w-6 active outer, w-3 inner, w-4 inactive)

### Product Cards (Mobile)
- Category badge: text-[9px] on mobile
- Product name: text-[11px] on mobile
- Price: text-[11px] on mobile
- Smaller margins/padding on mobile

### Catalog Page (Mobile)
- Filters sidebar COLLAPSED by default on mobile
- "Фильтры" toggle button with SlidersHorizontal icon
- Sidebar shows full-width when expanded
- `hidden md:block` when collapsed on mobile

### Product Detail Page (Mobile)
- Circular thumbnails (w-12 h-12 rounded-full) below main image on mobile
- Desktop thumbnails remain as aspect-[3/4] grid above product info
- Separate rendering paths for mobile vs desktop

### Footer (Mobile)
- Padding: pt-8 pb-6 on mobile
- Newsletter form: flex-col on mobile, sm:flex-row on larger
- Proper border handling for stacked layout

## Files Modified
- `/home/z/my-project/src/app/page.tsx` - All component changes

## Verification
- ESLint: passed (no errors)
- Dev server: compiles and runs successfully (HTTP 200)
