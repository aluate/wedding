# What Otto Can Do for the Wedding Site

**Last Updated:** January 2025

---

## 🎯 **Otto Overview**

Otto is your automation assistant with **two main components**:

1. **Infrastructure Automation Tool** (`infra/` + `tools/infra.py`)
   - Handles deployments, provisioning, diagnostics
   - Works with Vercel, Supabase, Stripe, GitHub, Render

2. **AI Agent** (`apps/otto/`)
   - HTTP API server for running tasks
   - Skills-based system for various automation

---

## ✅ **What Otto Can Do NOW**

### **1. Vercel Deployment** ✅

**Commands Available:**
```bash
# Set up new Vercel project
python tools/infra.py setup-vercel-project \
  --project wedding \
  --repo YOUR_USERNAME/wedding \
  --root-dir apps/wedding \
  --framework nextjs

# Configure domain
python tools/infra.py configure-domain \
  --project wedding \
  --domain solsticeof26.com

# Set environment variables
python tools/infra.py set-env-var \
  --project wedding \
  --name NEXT_PUBLIC_SITE_URL \
  --value https://solsticeof26.com
```

**What It Does:**
- ✅ Creates Vercel project via API
- ✅ Connects GitHub repository
- ✅ Sets root directory
- ✅ Configures framework
- ✅ Triggers initial deployment
- ✅ Monitors deployment status
- ✅ Sets environment variables

---

### **2. Diagnostics & Health Checks** ✅

```bash
# Check Vercel deployment health
python tools/infra.py diag --env=prod --provider vercel

# Check all services
python tools/infra.py diag --env=prod
```

**What It Does:**
- ✅ Checks deployment status
- ✅ Verifies site is accessible
- ✅ Tests health endpoints
- ✅ Generates reports

---

### **3. Project Provisioning** ✅

```bash
# Provision from project spec
python tools/infra.py provision-project \
  --spec infra/project-specs/wedding.yaml \
  --env=prod
```

**What It Does:**
- ✅ Reads project specification
- ✅ Creates/updates infrastructure
- ✅ Configures all components
- ✅ Sets up environment variables
- ✅ All from one YAML file!

---

### **4. Dry-Run Testing** ✅

All commands support `--dry-run`:

```bash
python tools/infra.py setup-vercel-project \
  --project wedding \
  --repo test/wedding \
  --dry-run
```

**What It Does:**
- ✅ Shows what would happen
- ✅ Validates configuration
- ✅ No actual changes made
- ✅ Perfect for testing

---

## ⏳ **What Otto CAN Do (With New Skills)**

### **1. GitHub Repository Creation** ⏳

**Needed Skill:**
- Create GitHub repo via API
- Initialize with proper settings
- Return repo URL

**Status:** Can be added to Otto infrastructure tool

---

### **2. Supabase Setup** ⏳

**Needed Skills:**
- Create Supabase project
- Run SQL migrations
- Generate API keys
- Configure RLS policies

**Status:** Can be added to Otto infrastructure tool

---

### **3. Email Service Setup** ⏳

**Needed Skills:**
- Configure SendGrid/Resend
- Set up email templates
- Test email sending
- Schedule reminder emails

**Status:** Can be added as new skill

---

### **4. Code Generation** ⏳

**Needed Skills:**
- Generate API routes
- Generate database schemas
- Generate email templates
- Generate component code

**Status:** Can be added as AI agent skill

---

## 🚀 **Wedding Site Deployment Flow**

### **Current Automation Level: ~70%**

**Otto Can Automate:**
1. ✅ Vercel project creation
2. ✅ Repository connection
3. ✅ Environment variable setup
4. ✅ Domain configuration (Vercel side)
5. ✅ Deployment triggering
6. ✅ Health checks

**Manual Steps:**
1. ⏳ Git initialization (one-time)
2. ⏳ GitHub repo creation (can automate)
3. ⏳ Code push to GitHub (git commands)
4. ⏳ DNS updates (needs registrar API)

---

## 📋 **Quick Reference: Otto Commands for Wedding Site**

### **Initial Setup**
```bash
# 1. Create project spec (DONE - see infra/project-specs/wedding.yaml)
# 2. Deploy to Vercel
python tools/infra.py setup-vercel-project \
  --project wedding \
  --repo YOUR_USERNAME/wedding \
  --root-dir apps/wedding \
  --framework nextjs

# 3. Add custom domain
python tools/infra.py configure-domain \
  --project wedding \
  --domain solsticeof26.com
```

### **Ongoing Management**
```bash
# Check site health
python tools/infra.py diag --env=prod --provider vercel

# Update environment variables
python tools/infra.py set-env-var \
  --project wedding \
  --name NEXT_PUBLIC_SITE_URL \
  --value https://solsticeof26.com

# Re-deploy (or just push to GitHub for auto-deploy)
```

---

## 🎯 **Otto Skills Roadmap**

### **Phase 1: Deploy Site (NOW)**
- ✅ Use existing Vercel automation
- ✅ Manual git/GitHub setup
- **Result:** Site live in ~30 minutes

### **Phase 2: Add GitHub Automation**
- ⏳ Auto-create GitHub repos
- ⏳ Auto-push code
- **Result:** Fully automated deployment

### **Phase 3: Add Backend Automation**
- ⏳ Supabase project creation
- ⏳ Database schema generation
- ⏳ API route generation
- **Result:** Backend setup in minutes

### **Phase 4: Add Email Automation**
- ⏳ Email service setup
- ⏳ Template generation
- ⏳ Notification scheduling
- **Result:** Complete notification system

---

## 📝 **Notes**

**Otto Infrastructure Tool Location:**
- Main CLI: `tools/infra.py`
- Config: `infra/providers/vercel.yaml`
- Project Specs: `infra/project-specs/wedding.yaml`

**Environment Variables Needed:**
- `VERCEL_TOKEN` - Vercel API token
- `GITHUB_TOKEN` - GitHub API token (for future automation)

**Project Spec:**
- Already created: `infra/project-specs/wedding.yaml`
- Just needs repo URL updated

---

**Bottom Line:** Otto can handle **~70% of deployment** automatically. The remaining 30% is manual git/GitHub steps that can be automated with a few new skills!

