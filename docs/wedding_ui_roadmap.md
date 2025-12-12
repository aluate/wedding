# Wedding Site UI Cleanup Roadmap

**Last Updated:** 2025-12-02  
**Status:** Initial assessment complete

This document tracks cosmetic and UX improvements for the wedding site. Tasks are prioritized and sized for iterative cleanup.

## Priority Legend
- **P0:** Critical visual/UX issues
- **P1:** High-impact polish
- **P2:** Nice-to-have improvements
- **P3:** Future enhancements

## Size Legend
- **XS:** < 30 min
- **S:** 30 min - 1 hour
- **M:** 1-2 hours
- **L:** 2+ hours

---

## Typography Cleanup

### TYPO-001: Establish consistent heading scale
- **Priority:** P1
- **Size:** S
- **Description:** Create a consistent typography scale for H1/H2/H3 across all pages. Currently mixing `text-5xl`, `text-6xl`, `text-8xl` for H1s. Standardize to a clear hierarchy.
- **Files:** All page components

### TYPO-002: Unify body text sizes
- **Priority:** P2
- **Size:** XS
- **Description:** Review and standardize body text sizes. Some pages use `text-lg`, others use base. Create clear patterns for body, large body, small text.
- **Files:** All page components

### TYPO-003: Improve text color hierarchy
- **Priority:** P1
- **Size:** XS
- **Description:** Reduce over-reliance on opacity for text hierarchy. Consider using actual color variations or font weights instead of just `text-accent/70`.
- **Files:** All page components, `app/globals.css`

---

## Spacing & Rhythm

### SPACE-001: Standardize section padding
- **Priority:** P1
- **Size:** S
- **Description:** Create consistent vertical rhythm. Currently mixing `py-12`, `py-16`, `py-20`. Establish a pattern (e.g., `py-16` for major sections, `py-12` for minor).
- **Files:** All page components

### SPACE-002: Fix hero section mobile spacing
- **Priority:** P0
- **Size:** S
- **Description:** Hero uses `h-screen` which may be too tall on mobile. Text sizes (`text-6xl md:text-8xl`) may overflow. Adjust mobile spacing and text sizes.
- **Files:** `app/page.tsx`

### SPACE-003: Improve component gap consistency
- **Priority:** P2
- **Size:** XS
- **Description:** Standardize gap sizes between components. Some use `gap-4`, others `gap-6` or `gap-8` without clear reasoning.
- **Files:** All page components

### SPACE-004: Add consistent max-widths
- **Priority:** P2
- **Size:** XS
- **Description:** Some pages use `max-w-2xl`, others `max-w-4xl`. Establish a pattern for content width based on content type.
- **Files:** All page components

---

## Color Usage

### COLOR-001: Improve card contrast
- **Priority:** P1
- **Size:** XS
- **Description:** White cards (`bg-white`) on light gray background (`bg-background: #F7F7F7`) may need more contrast. Consider subtle shadows or borders.
- **Files:** `app/travel/page.tsx`, `app/rsvp/[code]/page.tsx`, `app/admin/page.tsx`

### COLOR-002: Standardize hover states
- **Priority:** P1
- **Size:** S
- **Description:** Create consistent hover patterns for buttons, links, and interactive elements. Some use opacity, others use background changes.
- **Files:** All page components

### COLOR-003: Add focus states for accessibility
- **Priority:** P0
- **Size:** M
- **Description:** Add visible focus states for all interactive elements (buttons, links, form inputs). Critical for keyboard navigation and accessibility.
- **Files:** All page components, `app/globals.css`

---

## Buttons & Links

### BTN-001: Unify button styles
- **Priority:** P1
- **Size:** S
- **Description:** Create a button component system or at least consistent utility classes. Primary and secondary buttons exist but could be more standardized.
- **Files:** All page components, consider `components/Button.tsx`

### BTN-002: Improve form input styling
- **Priority:** P1
- **Size:** S
- **Description:** Form inputs use basic `border rounded` styling. Add focus states, better padding, and consistent styling across all forms.
- **Files:** `app/rsvp/page.tsx`, `app/rsvp/[code]/page.tsx`

### BTN-003: Add loading states
- **Priority:** P2
- **Size:** M
- **Description:** Forms and actions should show loading states. RSVP form, game start, etc. need feedback during async operations.
- **Files:** `app/rsvp/[code]/page.tsx`, `app/game/page.tsx`

---

## Mobile Layout

### MOBILE-001: Fix hero section mobile overflow
- **Priority:** P0
- **Size:** S
- **Description:** Hero section text may overflow on small screens. Test and adjust text sizes, padding, and layout for mobile.
- **Files:** `app/page.tsx`

### MOBILE-002: Improve navigation footer on mobile
- **Priority:** P2
- **Size:** XS
- **Description:** Navigation links footer wraps but could be better organized (maybe a proper mobile menu or better spacing).
- **Files:** `app/page.tsx`

### MOBILE-003: Optimize photo grid for mobile
- **Priority:** P2
- **Size:** XS
- **Description:** Photo grid is responsive but could benefit from better mobile-first sizing and spacing.
- **Files:** `components/PhotoGrid.tsx`

### MOBILE-004: Fix game canvas mobile scaling
- **Priority:** P2
- **Size:** S
- **Description:** Game canvas may not scale well on mobile. Ensure it's responsive and touch-friendly.
- **Files:** `app/game/page.tsx`

### MOBILE-005: Improve form mobile spacing
- **Priority:** P1
- **Size:** XS
- **Description:** Form inputs and labels may need better spacing on mobile devices.
- **Files:** `app/rsvp/page.tsx`, `app/rsvp/[code]/page.tsx`

---

## Image Handling

### IMG-001: Enhance photo gallery presentation
- **Priority:** P1
- **Size:** M
- **Description:** Gallery grid could feel more premium. Consider better spacing, hover effects, or masonry layout. Make it feel less cluttered.
- **Files:** `components/PhotoGrid.tsx`, `app/gallery/page.tsx`

### IMG-002: Add image loading states
- **Priority:** P2
- **Size:** S
- **Description:** Add skeleton loaders or placeholders for images while loading. Improve perceived performance.
- **Files:** `components/PhotoSlideshow.tsx`, `components/PhotoGrid.tsx`, `components/PhotoStrip.tsx`

### IMG-003: Improve photo slideshow controls
- **Priority:** P2
- **Size:** S
- **Description:** Slideshow navigation arrows and dots could be more polished. Consider better positioning and styling.
- **Files:** `components/PhotoSlideshow.tsx`

### IMG-004: Standardize image aspect ratios
- **Priority:** P2
- **Size:** XS
- **Description:** Review all image usage and ensure consistent aspect ratios where appropriate. Some use 4:3, others square.
- **Files:** All photo components

---

## Component Consistency

### COMP-001: Create reusable card component
- **Priority:** P2
- **Size:** M
- **Description:** Many pages use `bg-white p-6 rounded-lg shadow-sm` pattern. Extract to a reusable Card component for consistency.
- **Files:** Create `components/Card.tsx`, update pages

### COMP-002: Standardize page headers
- **Priority:** P1
- **Size:** S
- **Description:** Page headers (H1 + back link) are repeated. Create a consistent pattern or component.
- **Files:** All page components

### COMP-003: Unify section containers
- **Priority:** P2
- **Size:** XS
- **Description:** Standardize max-width and padding patterns for content sections.
- **Files:** All page components

---

## UX Improvements

### UX-001: Add form validation feedback
- **Priority:** P1
- **Size:** M
- **Description:** RSVP form doesn't show validation errors. Add inline validation and error messages.
- **Files:** `app/rsvp/[code]/page.tsx`

### UX-002: Improve navigation experience
- **Priority:** P2
- **Size:** S
- **Description:** Consider adding a proper header navigation instead of footer links. Or improve footer navigation styling.
- **Files:** `app/page.tsx`, consider `components/Header.tsx`

### UX-003: Add skip-to-content link
- **Priority:** P2
- **Size:** XS
- **Description:** Add accessibility skip link for keyboard users.
- **Files:** `app/layout.tsx`

### UX-004: Improve error handling
- **Priority:** P2
- **Size:** M
- **Description:** Add error boundaries and user-friendly error messages for failed operations.
- **Files:** All page components

---

## Admin Views

### ADMIN-001: Polish Kanban board styling
- **Priority:** P3
- **Size:** S
- **Description:** Kanban board is functional but could be more visually polished. Improve column styling, card design, drag feedback.
- **Files:** `components/KanbanBoard.tsx`

### ADMIN-002: Enhance admin table view
- **Priority:** P3
- **Size:** M
- **Description:** Add sorting, filtering, and better styling to the guest table view.
- **Files:** `app/admin/page.tsx`

### ADMIN-003: Improve admin tab navigation
- **Priority:** P3
- **Size:** XS
- **Description:** Tab navigation styling is basic. Add better active states and transitions.
- **Files:** `app/admin/page.tsx`

---

## Summary

### Quick Wins (XS/S, P0/P1)
- TYPO-003: Text color hierarchy
- SPACE-001: Standardize section padding
- SPACE-002: Fix hero mobile
- COLOR-003: Focus states
- BTN-002: Form input styling
- MOBILE-001: Hero mobile overflow
- MOBILE-005: Form mobile spacing
- COMP-002: Standardize page headers

### Medium Effort (M, P1)
- TYPO-001: Heading scale
- COLOR-001: Card contrast
- COLOR-002: Hover states
- BTN-001: Button unification
- IMG-001: Gallery enhancement
- UX-001: Form validation

### Larger Projects (L, P2/P3)
- COMP-001: Card component
- UX-002: Navigation system
- ADMIN-002: Admin table enhancements

---

## Notes

- Focus on guest-facing pages first
- Keep admin views functional but don't overbuild
- Maintain mobile-first approach
- Test on actual devices when possible
- Consider accessibility throughout
