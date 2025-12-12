# Deploy Wedding Site with Otto - Step by Step

**Quick deployment guide using Otto automation**

---

## 🚀 **Prerequisites**

1. ✅ Otto infrastructure tool is set up (`infra/` directory)
2. ✅ Environment variables configured (Vercel token, GitHub token)
3. ✅ Git repository initialized in `apps/wedding/`

---

## **Step 1: Initialize Git Repository**

If not already initialized:

```powershell
cd "E:\My Drive\apps\wedding"
git init
git add .
git commit -m "Initial wedding website - Karl & Brit's Solstice of '26"
```

---

## **Step 2: Create GitHub Repository**

### Option A: Using Otto (if skill exists)
```bash
python tools/infra.py create-github-repo --name wedding
```

### Option B: Manual
1. Go to https://github.com/new
2. Create repository: `wedding`
3. Don't initialize with README (we have one)
4. Copy the repository URL

---

## **Step 3: Push to GitHub**

```powershell
cd "E:\My Drive\apps\wedding"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding.git
git push -u origin main
```

---

## **Step 4: Update Project Spec**

Edit `infra/project-specs/wedding.yaml`:

```yaml
repo: "YOUR_USERNAME/wedding"  # Replace with your actual GitHub username/repo
```

---

## **Step 5: Deploy to Vercel with Otto**

### Method 1: Using Otto CLI Command

```bash
python tools/infra.py setup-vercel-project \
  --project wedding \
  --repo YOUR_USERNAME/wedding \
  --root-dir apps/wedding \
  --framework nextjs
```

### Method 2: Using Project Spec

```bash
python tools/infra.py provision-project \
  --spec infra/project-specs/wedding.yaml \
  --env=prod
```

---

## **Step 6: Configure Custom Domain**

```bash
python tools/infra.py configure-domain \
  --project wedding \
  --domain solsticeof26.com
```

Then update DNS records at your domain registrar as instructed by Otto/Vercel.

---

## **Step 7: Verify Deployment**

```bash
python tools/infra.py diag --env=prod --provider vercel
```

Check the site at:
- Vercel URL: `https://wedding.vercel.app`
- Custom domain: `https://solsticeof26.com` (after DNS propagates)

---

## **Troubleshooting**

### Build Fails?
- Check that `root_dir` is set to `apps/wedding`
- Verify `package.json` has all dependencies
- Check Vercel build logs

### Domain Not Working?
- Verify DNS records are correct
- Wait 24-48 hours for DNS propagation
- Check domain status in Vercel dashboard

### Need Environment Variables?
Add them via Otto:
```bash
python tools/infra.py set-env-var \
  --project wedding \
  --name NEXT_PUBLIC_SITE_URL \
  --value https://solsticeof26.com
```

---

## **Quick Deploy Script**

Save this as `deploy_wedding.ps1`:

```powershell
# Deploy Wedding Site Script
Write-Host "🚀 Deploying Wedding Site..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial wedding website"
}

# Push to GitHub (requires manual setup of remote)
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git branch -M main
Write-Host "⚠️  Make sure you've added the GitHub remote:" -ForegroundColor Yellow
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/wedding.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray

# Deploy with Otto
Write-Host "🚀 Deploying to Vercel with Otto..." -ForegroundColor Yellow
python tools/infra.py setup-vercel-project `
  --project wedding `
  --repo YOUR_USERNAME/wedding `
  --root-dir apps/wedding `
  --framework nextjs

Write-Host "✅ Deployment complete! Check Vercel dashboard for URL." -ForegroundColor Green
```

---

**Next Steps:**
- Set up Supabase for RSVP functionality
- Add email notifications
- Enhance admin dashboard

