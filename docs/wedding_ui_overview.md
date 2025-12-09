# Wedding Site UI Overview

**Last Updated:** 2025-12-02  
**Site:** Karl & Brit — Solstice of '26  
**Deployment:** Vercel (wedding website for June 20, 2026 wedding)

## Pages & Routes

### Guest-Facing Pages

1. **Home (`/`)** - `app/page.tsx`
   - Hero section with couple names, date, venue
   - Primary CTA buttons (RSVP, Schedule)
   - Photo slideshow section
   - Quick info grid (When/Where/RSVP By)
   - Navigation links footer

2. **Gallery (`/gallery`)** - `app/gallery/page.tsx`
   - Photo grid display (3 columns)
   - Simple header with description

3. **Schedule (`/schedule`)** - `app/schedule/page.tsx`
   - Event timeline with left border accent
   - Photo strip at top
   - Back to home link

4. **Travel & Stay (`/travel`)** - `app/travel/page.tsx`
   - Venue photo hero
   - Venue info card
   - Airport information
   - Driving directions
   - Hotel/lodging cards with booking links

5. **RSVP Entry (`/rsvp`)** - `app/rsvp/page.tsx`
   - Code input form
   - Simple centered layout

6. **RSVP Form (`/rsvp/[code]`)** - `app/rsvp/[code]/page.tsx`
   - Multi-field form (attending, meal, dietary, song, notes)
   - White card container
   - Thank you confirmation state

7. **Game (`/game`)** - `app/game/page.tsx`
   - Simple T-Rex style endless runner
   - Canvas-based game
   - Start screen and game screen

### Admin/Internal Pages

8. **Admin Dashboard (`/admin`)** - `app/admin/page.tsx`
   - Tab navigation (Overview, Guests, Task Board)
   - RSVP stats cards
   - Guest table view
   - Kanban board for wedding tasks

## Layout System

### Root Layout
- **File:** `app/layout.tsx`
- Fonts: Inter (body), Playfair Display (heading)
- CSS variables for fonts via Next.js font optimization
- Minimal structure (just body wrapper)

### Global Styles
- **File:** `app/globals.css`
- Tailwind base/components/utilities
- CSS custom properties for colors
- Font family utilities

## Typography

### Fonts
- **Heading:** Playfair Display (serif) - via `font-heading` class
- **Body:** Inter (sans-serif) - via `font-body` class
- Loaded via Next.js Google Fonts

### Heading Sizes (observed)
- H1: `text-5xl` to `text-8xl` (home hero), `text-5xl` (page headers)
- H2: `text-2xl` to `text-3xl` (section headers)
- H3: `text-2xl` (subsections)

### Body Text
- Default: base size
- Large: `text-xl`, `text-2xl`
- Small: `text-sm`, `text-lg`

## Color System

### Theme Colors (from `tailwind.config.js`)
- **Primary:** `#81D8D0` (Tiffany Blue) - `primary`
- **Accent:** `#000000` (Black) - `accent`
- **Background:** `#F7F7F7` (Light Gray) - `background`

### Usage Patterns
- Primary: buttons, links, borders, highlights
- Accent: text (often with opacity: `text-accent/70`, `text-accent/80`)
- Background: page backgrounds, card backgrounds (white used for cards)

### Opacity Variations
- Common: `/70`, `/80`, `/90`, `/10`, `/20`, `/50`
- Used for text hierarchy and hover states

## Components

### Photo Components
1. **PhotoSlideshow** (`components/PhotoSlideshow.tsx`)
   - Auto-play carousel
   - Navigation arrows
   - Dot indicators
   - Aspect ratio: 4:3

2. **PhotoGrid** (`components/PhotoGrid.tsx`)
   - Responsive grid (1/2/3 columns)
   - Hover scale effect
   - Aspect square images

3. **PhotoStrip** (`components/PhotoStrip.tsx`)
   - Horizontal scrollable strip
   - Fixed size thumbnails (128px/160px)

### Admin Components
4. **KanbanBoard** (`components/KanbanBoard.tsx`)
   - Drag-and-drop task board
   - 4 columns (To Do, In Progress, Review, Done)
   - Color-coded columns

## Button & Link Styles

### Primary Buttons
- Pattern: `px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition`
- Used for: RSVP, Submit, Start Game

### Secondary Buttons
- Pattern: `px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition`
- Used for: Schedule link on hero

### Text Links
- Pattern: `text-primary hover:text-primary/80 transition` or `text-accent hover:text-primary transition`
- Back links: `text-primary mb-6 inline-block hover:underline`

### Form Inputs
- Pattern: `w-full p-2 border rounded`
- Basic styling, no focus states visible

## Spacing Patterns

### Section Padding
- Common: `py-12`, `py-16`, `py-20`
- Page containers: `px-4`
- Max widths: `max-w-2xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`

### Component Gaps
- Grid gaps: `gap-4`, `gap-6`, `gap-8`
- Flex gaps: `gap-4`, `gap-6`
- Space-y: `space-y-4`, `space-y-6`

## Known Rough Edges & Issues

### Typography
- Inconsistent heading sizes across pages (some `text-5xl`, some vary)
- No clear typography scale system
- Body text sizes vary without clear hierarchy

### Spacing
- Inconsistent section padding (`py-12` vs `py-16` vs `py-20`)
- Some pages have tighter spacing than others
- Hero section uses `h-screen` which may be too tall on mobile

### Buttons & Links
- Buttons have consistent styling but no focus states for accessibility
- Form inputs lack focus states
- Link hover states are minimal (just color change)

### Color Usage
- Heavy reliance on opacity for text hierarchy (could be more intentional)
- White cards on light gray background may need more contrast
- No hover state consistency for interactive elements

### Mobile Layout
- Hero section may overflow on small screens (text-6xl/8xl)
- Photo grid responsive but could be optimized
- Navigation footer wraps but could be better organized
- Form inputs may need better mobile spacing

### Image Handling
- Photo components use Next.js Image with proper sizing
- Aspect ratios are consistent
- But: no loading states or error handling visible
- Gallery grid could benefit from masonry or better aspect ratio handling

### Component Consistency
- Cards use `bg-white p-6 rounded-lg shadow-sm` pattern (good)
- But some sections use different padding/spacing
- Back links are consistent (good)

### Admin Views
- Kanban board uses color-coded columns but could be more polished
- Table view is basic (no sorting, filtering)
- Tab navigation is functional but basic styling

### UX Issues
- No loading states for forms
- No error handling visible in forms
- RSVP form doesn't show validation feedback
- Game canvas may not scale well on mobile
- No skip-to-content or accessibility landmarks

## Breakpoints

Using Tailwind defaults:
- `md:` 768px
- `lg:` 1024px

Most responsive patterns use `md:` breakpoint.
