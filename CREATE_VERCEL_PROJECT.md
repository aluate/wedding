# 🚀 Create Vercel Project - Step by Step

**Domain:** `britandkarl.com`  
**GitHub Repo:** `aluate/wedding`

---

## ✅ **Quick Steps**

1. Go to Vercel and sign in
2. Import your GitHub repository
3. Configure the root directory
4. Deploy!

---

## 📋 **Detailed Instructions**

### **Step 1: Go to Vercel**

1. Open: **https://vercel.com/new**
2. Sign in with **GitHub** (if not already signed in)
   - Click "Continue with GitHub"
   - Authorize Vercel if prompted

---

### **Step 2: Import Repository**

1. You'll see a page with your GitHub repositories
2. Find and click: **`aluate/wedding`**
   - If you don't see it, click "Adjust GitHub App Permissions" and authorize
3. Click **"Import"** button

---

### **Step 3: Configure Project Settings**

**⚠️ IMPORTANT:** You MUST configure the root directory!

1. You'll see the project configuration page
2. Look for **"Root Directory"** section
3. Click **"Edit"** next to it
4. Type: **`apps/wedding`**
5. Click **"Continue"** or **"Update"**

**Why?** Your Next.js app is in the `apps/wedding` folder, not the root.

---

### **Step 4: Verify Framework Settings**

Vercel should auto-detect Next.js, but verify:

- **Framework Preset:** Should show "Next.js" ✅
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

These are usually correct by default - just verify they look right.

---

### **Step 5: Environment Variables (Skip for Now)**

You can add environment variables later if needed. For now:
- Click **"Deploy"** to continue

---

### **Step 6: Deploy!**

1. Click the big **"Deploy"** button
2. Wait ~2-3 minutes
3. You'll see the build progress
4. When done, you'll get a success message!

---

### **Step 7: Check Your Site**

After deployment completes:

1. Click **"Visit"** button or go to your dashboard
2. Your site will be at: **`https://wedding-xxxxx.vercel.app`**
   - Or similar Vercel-generated URL
3. Test it - should see your wedding homepage! 🎉

---

## ✅ **What You Should See**

After successful deployment:

- ✅ Build logs showing success
- ✅ "Deployment Ready" or "Visit" button
- ✅ Your site URL (something like `wedding-xxxxx.vercel.app`)

---

## 🎯 **Important Settings Checklist**

Before clicking "Deploy", make sure:

- ✅ **Root Directory:** Set to `apps/wedding`
- ✅ **Framework:** Next.js
- ✅ **Build Command:** `npm run build`
- ✅ **GitHub Repo:** `aluate/wedding`

---

## 🆘 **Troubleshooting**

### **Can't Find Repository?**

- Click "Adjust GitHub App Permissions"
- Make sure Vercel has access to your repositories
- Refresh the page

### **Build Fails?**

- Check that Root Directory is set to `apps/wedding`
- Check build logs for specific errors
- Make sure `package.json` exists in `apps/wedding`

### **Site Not Loading?**

- Wait a few more minutes
- Check deployment logs
- Try visiting the URL again

---

## 📍 **After Deployment**

Once your site is deployed:

1. ✅ **Site is live** at the Vercel URL
2. ⏭️ **Next step:** Add custom domain `britandkarl.com`
   - See `DEPLOY_NOW.md` for domain setup
   - Or `FIND_CNAME_IN_VERCEL.md` for finding the CNAME

---

## 🚀 **Quick Reference**

- **Vercel New Project:** https://vercel.com/new
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/aluate/wedding
- **Root Directory:** `apps/wedding` ⚠️ CRITICAL

---

**Ready?** Go to https://vercel.com/new and start importing! 🎉

