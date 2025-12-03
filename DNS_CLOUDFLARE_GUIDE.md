# DNS Configuration with Cloudflare - Wedding Site

**Domain:** britandkarl.com  
**Deployment:** Vercel

---

## 🌐 **DNS Setup Overview**

After Otto deploys your site to Vercel, you'll need to configure DNS records in Cloudflare to point your domain to Vercel.

---

## ✅ **Step 1: Add Domain to Vercel**

Otto will handle this automatically when you run the domain configuration command, or you can do it manually:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `britandkarl.com`
4. Vercel will show you DNS records to add

**You'll see something like:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

---

## ✅ **Step 2: Configure DNS in Cloudflare**

### **For Root Domain (britandkarl.com):**

1. **Go to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select your domain: `britandkarl.com`

2. **Go to DNS Settings**
   - Click **"DNS"** in the left sidebar
   - Click **"Records"** tab

3. **Add CNAME Record**
   - Click **"Add record"**
   - **Type:** `CNAME`
   - **Name:** `@` (or leave blank for root domain)
   - **Target:** `cname.vercel-dns.com` (or what Vercel provides)
   - **Proxy status:** 
     - **DNS only** (gray cloud) - Recommended initially
     - You can enable proxy (orange cloud) later if needed
   - **TTL:** Auto
   - Click **"Save"**

### **For WWW Subdomain (optional):**

If you want `www.britandkarl.com` to also work:

1. Click **"Add record"** again
2. **Type:** `CNAME`
3. **Name:** `www`
4. **Target:** `cname.vercel-dns.com` (same as root)
5. **Proxy status:** DNS only (gray cloud)
6. **TTL:** Auto
7. Click **"Save"**

---

## ⚠️ **Important Notes**

### **Proxy Status (Orange vs Gray Cloud)**

- **Gray Cloud (DNS only):** 
  - ✅ Recommended for Vercel
  - Direct DNS resolution
  - Faster propagation
  - Better for Vercel's edge network

- **Orange Cloud (Proxied):**
  - Uses Cloudflare's proxy/CDN
  - Can sometimes conflict with Vercel's CDN
  - Start with gray cloud, enable later if needed

### **Existing Records**

- **Check for conflicting records:**
  - Look for existing `A` or `CNAME` records for `@` (root)
  - Remove or update conflicting records
  - Vercel needs the CNAME to work properly

### **SSL/TLS Settings**

- **In Cloudflare:** 
  - Go to **SSL/TLS** settings
  - Choose **"Full"** or **"Full (strict)"** mode
  - This ensures HTTPS works properly

---

## ⏱️ **DNS Propagation**

**Typical Timeline:**
- **Immediate:** Usually works within minutes
- **Full Propagation:** Can take up to 24-48 hours
- **Most users:** Working within 1-2 hours

**Check Status:**
- Vercel dashboard will show domain status
- Look for "Valid Configuration" checkmark
- Site should be accessible at `https://britandkarl.com`

---

## 🔍 **Troubleshooting**

### **Domain Not Working?**

1. **Check DNS Records:**
   - Verify CNAME record is correct
   - Check that proxy is OFF (gray cloud)
   - Remove any conflicting A records

2. **Check Vercel Status:**
   - Go to Vercel Dashboard → Domains
   - Look for error messages
   - Should show "Valid Configuration"

3. **Wait for Propagation:**
   - DNS changes can take time
   - Try again in 1-2 hours
   - Use DNS checker: https://dnschecker.org

### **SSL Certificate Issues?**

- Vercel automatically provisions SSL certificates
- May take a few minutes after DNS is configured
- Check SSL/TLS mode in Cloudflare (should be "Full")

---

## 📋 **Quick Checklist**

- [ ] Domain added to Vercel project
- [ ] CNAME record added in Cloudflare (root domain)
- [ ] CNAME record added for www (optional)
- [ ] Proxy status set to DNS only (gray cloud)
- [ ] Conflicting records removed
- [ ] SSL/TLS mode set to "Full" in Cloudflare
- [ ] Wait for DNS propagation (1-48 hours)
- [ ] Verify site works at https://britandkarl.com

---

## 🚀 **After DNS is Configured**

Once DNS propagates:

1. **Site will be live** at `https://britandkarl.com`
2. **Vercel automatically:**
   - Provisions SSL certificate
   - Routes traffic to your site
   - Handles all edge caching

3. **Test the site:**
   - Visit https://britandkarl.com
   - Check all pages load correctly
   - Verify HTTPS is working

---

**Need Help?** Check Vercel's domain documentation or Cloudflare's DNS guides!

