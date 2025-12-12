# Wedding Site - Complete Todo List

**Generated:** January 2025  
**Status:** Ready to Execute

---

## 🎯 **Phase 1: Get Site Live (Priority 1)**

### 1.1 Repository Setup
- [ ] Initialize git repository in `apps/wedding/`
- [ ] Create initial commit with all wedding site files
- [ ] Create GitHub repository (or use existing monorepo)
- [ ] Push code to GitHub
- [ ] Verify repository is accessible

**Otto Can Help:**
- ⏳ Create GitHub repo (can add skill)
- ✅ Git commands (manual or scripted)

### 1.2 Vercel Deployment
- [ ] Set up Vercel project via Otto or manually
- [ ] Configure root directory: `apps/wedding`
- [ ] Set framework: Next.js
- [ ] Add environment variables (if needed)
- [ ] Trigger initial deployment
- [ ] Verify deployment succeeds
- [ ] Test site at Vercel URL

**Otto Can Do:**
- ✅ Create Vercel project (`setup-vercel-project` command exists)
- ✅ Configure root directory
- ✅ Set environment variables
- ✅ Trigger deployments
- ✅ Monitor deployment status

### 1.3 Domain Configuration
- [ ] Add custom domain `solsticeof26.com` to Vercel project
- [ ] Get DNS configuration from Vercel
- [ ] Update DNS records at domain registrar
- [ ] Verify domain propagation
- [ ] Test site at custom domain

**Otto Can Do:**
- ✅ Add domain to Vercel project (via API)
- ✅ Get DNS records
- ⏳ DNS update (requires registrar API access)

---

## 🔧 **Phase 2: Backend Integration (Priority 2)**

### 2.1 Supabase Setup
- [ ] Create Supabase project
- [ ] Set up database schema:
  - [ ] `households` table (id, code, created_at)
  - [ ] `guests` table (id, household_id, name, email, phone, etc.)
  - [ ] `rsvps` table (id, guest_id, event_id, attending, meal_choice, etc.)
  - [ ] `events` table (id, name, date, time, location, etc.)
- [ ] Create RLS (Row Level Security) policies
- [ ] Generate API keys
- [ ] Add Supabase env vars to Vercel

**Otto Can Do:**
- ⏳ Create Supabase project (can add skill)
- ⏳ Run SQL migrations (can add skill)
- ✅ Set environment variables in Vercel

### 2.2 RSVP Functionality
- [ ] Create API route for RSVP submission (`/api/rsvp`)
- [ ] Implement household code validation
- [ ] Connect RSVP form to database
- [ ] Add form validation
- [ ] Add success/error handling
- [ ] Test RSVP flow end-to-end

**Otto Can Do:**
- ⏳ Generate API route code (can add skill)
- ✅ Deployment after code changes

### 2.3 Admin Dashboard
- [ ] Create API routes for admin data:
  - [ ] `/api/admin/guests` - List all guests
  - [ ] `/api/admin/rsvps` - List all RSVPs
  - [ ] `/api/admin/stats` - Dashboard statistics
- [ ] Implement authentication (simple password or better)
- [ ] Connect admin dashboard to APIs
- [ ] Add real-time updates (optional: use Supabase realtime)

**Otto Can Do:**
- ⏳ Generate API route code (can add skill)

---

## 📧 **Phase 3: Notifications (Priority 3)**

### 3.1 Email Service Setup
- [ ] Choose email service (SendGrid, Resend, etc.)
- [ ] Create account and get API key
- [ ] Add email service env vars to Vercel
- [ ] Set up email templates:
  - [ ] RSVP confirmation
  - [ ] RSVP reminder (30 days, 7 days before)
  - [ ] Day-before reminder
  - [ ] Admin alerts on new RSVPs

**Otto Can Do:**
- ⏳ Set environment variables
- ⏳ Generate email template code (can add skill)

### 3.2 Email Implementation
- [ ] Create email service utility
- [ ] Implement RSVP confirmation email
- [ ] Implement reminder emails (scheduled)
- [ ] Implement admin alert emails
- [ ] Test all email flows

**Otto Can Do:**
- ⏳ Generate email service code (can add skill)

### 3.3 SMS Notifications (Optional)
- [ ] Choose SMS service (Twilio, etc.)
- [ ] Set up SMS service
- [ ] Implement day-of reminders
- [ ] Implement shuttle updates

---

## 🎨 **Phase 4: Enhanced Features (Priority 4)**

### 4.1 Kanban Board
- [ ] Implement drag-and-drop (use library like dnd-kit)
- [ ] Connect to database for persistence
- [ ] Add task creation/editing
- [ ] Add due dates
- [ ] Add task assignments
- [ ] Add task filtering

**Otto Can Do:**
- ⏳ Generate component code (can add skill)

### 4.2 Additional Features
- [ ] Add photo gallery
- [ ] Add registry links
- [ ] Add gift/honeymoon fund
- [ ] Add social sharing buttons
- [ ] Add analytics (Google Analytics, Plausible, etc.)

---

## 🤖 **Phase 5: Otto Skills Enhancement (Ongoing)**

### 5.1 Wedding-Specific Skills
- [ ] Create `wedding-deploy` skill - One-command deployment
- [ ] Create `wedding-setup-supabase` skill - Complete Supabase setup
- [ ] Create `wedding-generate-api-routes` skill - Generate API routes
- [ ] Create `wedding-setup-notifications` skill - Email/SMS setup

**Skills Location:**
- Infrastructure automation: `infra/` (existing)
- Project-specific skills: `apps/wedding/otto/` (to be created)

### 5.2 Generic Skills
- [ ] GitHub repo creation automation
- [ ] Supabase project creation automation
- [ ] Email service setup automation
- [ ] API route code generation
- [ ] Database migration runner

---

## 📊 **Progress Tracking**

**Overall Completion:** 70% (Frontend complete, backend pending)

- ✅ **Phase 1:** 0% (Not started)
- ⏳ **Phase 2:** 0% (Not started)
- ⏳ **Phase 3:** 0% (Not started)
- ⏳ **Phase 4:** 0% (Not started)
- ⏳ **Phase 5:** 20% (Otto infrastructure exists)

---

## 🚀 **Quick Start: Get Site Live in 30 Minutes**

### Automated Path (Using Otto):
```bash
# 1. Initialize git and push (manual or script)
cd apps/wedding
git init
git add .
git commit -m "Initial wedding website"
git remote add origin <repo-url>
git push -u origin main

# 2. Deploy with Otto
python tools/infra.py setup-vercel-project \
  --project wedding \
  --repo YOUR_USERNAME/wedding \
  --root-dir apps/wedding \
  --framework nextjs

# 3. Add domain
python tools/infra.py configure-domain \
  --project wedding \
  --domain solsticeof26.com
```

### Manual Path:
1. Push code to GitHub (5 min)
2. Import to Vercel (5 min)
3. Configure root directory (2 min)
4. Deploy (3 min)
5. Add domain (5 min)
6. Update DNS (10 min)

**Total: ~30 minutes**

---

## 📝 **Notes**

- ✅ = Complete
- ⏳ = In Progress / Can Be Done
- ❌ = Blocked / Needs Manual Action
- [ ] = Not Started

**Otto Status:**
- ✅ = Otto can do this now
- ⏳ = Otto can do this with new skill (needs to be built)
- ❌ = Manual only

---

**Next Action:** Start Phase 1 - Get Site Live!

