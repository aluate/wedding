# 🚀 Deploy Wedding Site NOW - Quick Guide

**Status:** Code is pushed to GitHub! Ready to deploy!

---

## ✅ **What's Already Done**

1. ✅ Git repository initialized
2. ✅ Code pushed to GitHub: `aluate/wedding`
3. ✅ All deployment automation ready

---

## 🚀 **Deploy to Vercel (Choose One)**

### **Option 1: Manual (FASTEST - 2 minutes)**

1. Go to: **https://vercel.com/new**
2. Sign in with GitHub
3. Click **"Import Git Repository"**
4. Select: **`aluate/wedding`**
5. Click **"Import"**
6. **IMPORTANT:** Under "Root Directory", click **"Edit"**
   - Change from `/` to **`apps/wedding`**
   - Click **"Continue"**
7. Click **"Deploy"**
8. Wait ~2 minutes
9. **Done!** Your site is live at: `https://wedding.vercel.app`

---

### **Option 2: Use Otto (Requires Vercel Token)**

**Get Vercel Token:**
1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `wedding-deploy`
4. Copy the token

**Set Token & Deploy:**
```powershell
# Set token (PowerShell)
$env:VERCEL_TOKEN='your_token_here'

# Deploy
cd "E:\My Drive"
python apps/wedding/deploy_to_vercel.py
```

---

## 🌐 **Configure Custom Domain (After Deployment)**

### **Step 1: Add Domain to Vercel**

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `britandkarl.com`
4. Click **"Add"**
5. Vercel will show you DNS records to add

**You'll see something like:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

### **Step 2: Update DNS in Cloudflare**

1. **Go to Cloudflare Dashboard:**
   - https://dash.cloudflare.com
   - Select domain: `britandkarl.com`

2. **Go to DNS:**
   - Click **"DNS"** → **"Records"**

3. **Add CNAME Record:**
   - Click **"Add record"**
   - **Type:** `CNAME`
   - **Name:** `@` (or leave blank for root)
   - **Target:** `cname.vercel-dns.com` (use value from Vercel)
   - **Proxy status:** **DNS only** (gray cloud) ⚠️ Important!
   - **TTL:** Auto
   - Click **"Save"**

4. **Optional - Add WWW:**
   - Add another CNAME:
   - **Name:** `www`
   - **Target:** Same as root domain

---

## ⏱️ **Timeline**

- **Vercel Deployment:** ~2 minutes
- **DNS Propagation:** 1-48 hours (usually 1-2 hours)
- **Site Live:** Immediately on `wedding.vercel.app`
- **Custom Domain:** After DNS propagates

---

## ✅ **Checklist**

- [x] Git initialized ✅
- [x] Code pushed to GitHub ✅
- [ ] Deployed to Vercel
- [ ] Added custom domain in Vercel
- [ ] Updated DNS in Cloudflare
- [ ] Site working at britandkarl.com

---

## 📋 **Quick Reference**

- **GitHub Repo:** https://github.com/aluate/wedding
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Cloudflare DNS:** https://dash.cloudflare.com
- **Site URL:** https://wedding.vercel.app (temporary)
- **Custom Domain:** https://britandkarl.com (after DNS)

---

## 🔍 **Troubleshooting**

### **Build Fails?**
- Check Root Directory is set to `apps/wedding`
- Check Vercel build logs for errors

### **Domain Not Working?**
- Verify CNAME record is correct in Cloudflare
- Make sure proxy is **OFF** (gray cloud)
- Wait 1-2 hours for DNS propagation
- Check Vercel dashboard for domain status

### **Need Help?**
- Full DNS guide: `DNS_CLOUDFLARE_GUIDE.md`
- Full deployment guide: `DEPLOY_WITH_OTTO.md`

---

**Ready?** Go to https://vercel.com/new and deploy! 🎉

