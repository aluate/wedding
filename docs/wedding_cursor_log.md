# Wedding Site Cursor Log

This log tracks changes, decisions, and open questions for the wedding site UI cleanup work.

---

## 2025-12-02 - Initial Assessment

### Summary
Completed initial codebase scan and documentation setup. Created three documentation files:
- `wedding_ui_overview.md` - Comprehensive overview of pages, layout, typography, colors, and known issues
- `wedding_ui_roadmap.md` - Prioritized checklist of cosmetic/UX tasks
- `wedding_cursor_log.md` - This conversation log

### Files Touched
- Created `docs/wedding_ui_overview.md`
- Created `docs/wedding_ui_roadmap.md`
- Created `docs/wedding_cursor_log.md`

### Findings

**Pages Identified:**
- Guest-facing: Home, Gallery, Schedule, Travel, RSVP (entry + form), Game
- Admin: Dashboard with Overview, Guests table, Kanban board

**Main Components:**
- PhotoSlideshow, PhotoGrid, PhotoStrip, KanbanBoard

**Layout System:**
- Next.js 14 App Router
- Tailwind CSS with custom theme (Tiffany Blue primary, black accent, light gray background)
- Playfair Display (headings) + Inter (body) fonts

**Key Issues Identified:**
1. Inconsistent typography scale (H1 sizes vary)
2. Inconsistent section padding (py-12, py-16, py-20 mixed)
3. Hero section may overflow on mobile
4. Missing focus states for accessibility
5. Form inputs need better styling and validation feedback
6. Photo gallery could feel more premium
7. Button/link hover states need standardization

### Top 5 Recommended Fixes
1. **Hero section mobile spacing** (P0, S) - Critical for mobile UX
2. **Focus states for accessibility** (P0, M) - Required for keyboard navigation
3. **Standardize section padding** (P1, S) - Quick win for visual consistency
4. **Form input styling & validation** (P1, M) - Improves user experience
5. **Typography scale consistency** (P1, S) - Establishes clear hierarchy

### Files We'll Work In Most
- `app/page.tsx` - Home page (hero, navigation)
- `app/globals.css` - Global styles, focus states
- `app/rsvp/[code]/page.tsx` - RSVP form (styling, validation)
- `components/PhotoGrid.tsx` - Gallery enhancement
- All page components for typography/spacing standardization

### Open Questions
- Should we create reusable Button/Card components, or keep utility-based approach?
- Do we want a proper header navigation, or keep footer links?
- Any specific brand guidelines beyond the current color/font choices?
- Should admin views get the same polish, or keep them minimal?

### Next Steps
Waiting for specific cosmetic task requests. Ready to iterate on:
- Spacing adjustments
- Typography cleanup
- Button/link styling
- Form improvements
- Mobile optimizations
- Photo gallery enhancements

---

## 2025-12-02 - Moved Game to Bottom Banner

### Summary
Moved the runner game from its own page (`/game`) to a compact banner component at the bottom of all pages. The game now appears as a fixed footer element across the site.

### Files Touched
- Created `components/GameBanner.tsx` - New compact game banner component
- Modified `app/layout.tsx` - Added GameBanner to root layout
- Modified `app/page.tsx` - Removed game link from navigation

### Changes Made
- **Created GameBanner component:**
  - Compact design (400x80px canvas vs 800x400px original)
  - Inline controls and score display
  - Auto-pause on hover
  - Reset button
  - Smaller player/obstacle sizes for banner format
  - Styled to match site theme with border and background

- **Updated layout:**
  - Added GameBanner to root layout so it appears on all pages
  - Positioned at bottom with border-top separator

- **Removed game navigation:**
  - Removed game link from home page navigation footer
  - Game is now always accessible via banner (no separate page needed)

### Follow-up Recommendations
- Consider making the banner collapsible/dismissible if users want to hide it
- The `/game` route still exists but is no longer linked - could be removed or kept as a fallback
- Test game performance in banner format on mobile devices
- Consider adding a subtle animation or indicator when game is available

### Open Questions
- Should the game banner be visible on all pages, or just the home page?
- Do we want to keep the `/game` route for a full-screen version, or remove it entirely?

### Visual Inspection
- Check all pages to ensure banner appears correctly at bottom
- Test game functionality in banner format (click/space to jump)
- Verify banner doesn't interfere with page content
- Test on mobile to ensure banner is appropriately sized

---

## 2025-12-02 - Name Order & Date Format Updates

### Summary
Updated site to match URL domain (britandkarl.com) by changing name order from "Karl & Brit" to "Brit & Karl" throughout. Also implemented American date format (M.D.YYYY) for all user-facing dates, with ISO format (YYYY-MM-DD) maintained in config/data files.

### Files Touched
- Modified `config/wedding_config.json` - Updated title, displayNames, blockName
- Modified `app/layout.tsx` - Updated metadata title
- Modified `app/page.tsx` - Added date formatting utilities, updated date displays
- Modified `app/schedule/page.tsx` - Added 12-hour time formatting
- Modified `app/rsvp/[code]/page.tsx` - Added American date formatting for deadline
- Created `lib/dateUtils.ts` - New date formatting utility functions
- Modified `lib/photos.ts` - Updated alt text to "Brit & Karl"
- Modified `update_photos.py` - Updated script to generate "Brit & Karl" alt text
- Created `infra/templates/DATE_FORMAT_GUIDELINES.md` - Documentation for date format standards
- Modified `infra/templates/README.md` - Added date format standards section

### Changes Made
- **Name order updates:**
  - Changed all instances of "Karl & Brit" to "Brit & Karl" to match domain (britandkarl.com)
  - Updated config, metadata, photo alt text, and documentation

- **Date formatting system:**
  - Created `lib/dateUtils.ts` with:
    - `formatAmericanDate()` - Converts ISO (YYYY-MM-DD) to American (M.D.YYYY)
    - `formatAmericanDateWithMonth()` - Converts to "Month D, YYYY" format
    - `format12HourTime()` - Converts 24-hour to 12-hour format
  - Updated all user-facing date displays:
    - Home page hero: `6.20.2026` (was showing raw ISO date)
    - Home page "When" section: `6.20.2026` and `4:30 PM`
    - Home page "RSVP By": `5.20.2026`
    - Schedule page: Times now show as `4:30 PM` format
    - RSVP page: Deadline shows as `5.20.2026`
  - Config files still use ISO format (YYYY-MM-DD) for data integrity

- **Documentation:**
  - Created date format guidelines for templates
  - Documented standard: American format for display, ISO for storage

### Follow-up Recommendations
- Consider updating any remaining documentation files that reference "Karl & Brit"
- Test date formatting on all pages to ensure consistency
- Consider adding date formatting to any other date displays we might have missed

### Open Questions
- None - changes are complete

### Visual Inspection
- Home page: Check hero date shows as `6.20.2026`
- Home page: Check "When" and "RSVP By" sections show American format
- Schedule page: Check times show in 12-hour format (e.g., `4:30 PM`)
- RSVP page: Check deadline shows as `5.20.2026`

---

## 2025-12-07 - Triggered Redeploy to Fix Live Site

### Summary
User reported changes not reflected on live site. Triggered new deployment by creating empty commit and pushing to ensure Vercel picks up all changes.

### Files Touched
- Triggered git commit and push to force Vercel redeploy

### Changes Made
- Created empty commit to trigger Vercel deployment
- Verified all changes are in codebase:
  - ✅ `app/layout.tsx` - Title shows "Brit & Karl"
  - ✅ `app/page.tsx` - Uses `formatAmericanDate()` 
  - ✅ `app/rsvp/[code]/page.tsx` - Uses `formatAmericanDate()`
  - ✅ `lib/dateUtils.ts` - Date formatting utilities exist
  - ✅ `config/wedding_config.json` - Shows "Brit & Karl"

### Follow-up Recommendations
- Monitor Vercel dashboard to confirm deployment completes
- Verify live site at https://britandkarl.com shows:
  - Title: "Brit & Karl — Solstice of '26"
  - Dates in American format (6.20.2026)
  - Times in 12-hour format (4:30 PM)

### Open Questions
- None - waiting for deployment to complete

### Visual Inspection
- Check https://britandkarl.com after deployment completes
- Verify browser tab title shows "Brit & Karl"
- Check hero section date shows as "6.20.2026"
- Check schedule page times show as "4:30 PM" format

---

## IMPORTANT SCOPE CLARIFICATION

### DO NOT: Multi-Event Architecture
**This wedding repo is for the wedding site ONLY. Do NOT:**
- Add multi-event support
- Introduce a generic "Event" model
- Build a reusable event hub architecture
- Add complex new features like photo upload systems (unless explicitly requested)

### DO: Focus on Cosmetic Polish
**This repo should focus ONLY on:**
- Visual polish (spacing, typography, colors)
- Layout improvements
- Small UX tweaks
- Minor copy tweaks (when asked)
- Treat as a single-purpose wedding site that needs to be stable through the wedding date

### Ideas for Future Party/Event Template (NOT FOR THIS REPO)
**These ideas should be noted here but NOT implemented in the wedding repo:**

- **Separate party/event hub template** for:
  - New Year's parties
  - Brit's 10/25 birthday bash
  - Other recurring events (3-4 times per year)
- **Photo submission system** with:
  - QR code-friendly upload URLs
  - Mobile-first upload flow
  - Per-event photo galleries
  - Could link FROM wedding site TO party hub (without touching wedding architecture)
- **Multi-event architecture** with:
  - Event model (id, slug, name, type, date, etc.)
  - Routes: `/`, `/events`, `/events/[slug]`, `/events/[slug]/photos`, `/events/[slug]/photos/upload`
  - Reusable event components (EventHero, EventDetails, EventSchedule, etc.)
  - Primary event selection for homepage

**These will be built in a SEPARATE repo/app, not here.**

---

## Change Log Template

For future entries, use this format:

```
## YYYY-MM-DD - [Task Name]

### Summary
[Brief description of what was changed]

### Files Touched
- [List of files modified]

### Changes Made
- [Specific changes with context]

### Follow-up Recommendations
- [Any additional polish or related improvements]

### Open Questions
- [Questions for user/Frat]

### Visual Inspection
- [Pages/viewports to check]
```
