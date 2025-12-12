# 🔧 DNS Issue - How to Fix

**Domain:** `britandkarl.com`  
**Status:** MISCONFIGURED (needs fixing)

---

## 🎯 **What "Misconfigured" Means**

Vercel shows the domain as **"Misconfigured"** which means:
- ✅ Domain is added to Vercel (that's good!)
- ❌ DNS records in Cloudflare aren't set correctly

**Fix:** Update DNS records in Cloudflare to match what Vercel expects.

---

## ✅ **Quick Fix Steps**

### **Step 1: Get DNS Records from Vercel**

1. Go to **Vercel Dashboard**
2. Project: **`wedding`**
3. **Settings** → **Domains**
4. Click on **`britandkarl.com`**

**Vercel will show you the exact DNS records needed!**

You should see something like:

```
Add these DNS records:

Record 1:
Type: A
Name: @
Value: 76.76.21.21

Record 2:
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**📋 Copy these values exactly!**

---

### **Step 2: Update Cloudflare DNS**

1. Go to **Cloudflare Dashboard**
2. Select **`britandkarl.com`**
3. Go to **DNS** → **Records**

**Check/Update:**

**Record 1 - Root Domain:**
- Type: **A**
- Name: `@` (or blank)
- Content/IP: **[Use IP from Vercel - usually 76.76.21.21]**
- Proxy: **ON** (orange cloud) ✅

**Record 2 - WWW:**
- Type: **CNAME**
- Name: `www`
- Target: **[Use value from Vercel - usually cname.vercel-dns.com]**
- Proxy: **ON** (orange cloud) ✅

---

### **Step 3: Common Issues to Check**

**If records exist but domain still misconfigured:**

1. **Wrong IP Address**
   - Delete old A record
   - Add new one with IP from Vercel

2. **Proxy is OFF**
   - Click gray cloud to turn orange
   - Both records need Proxy ON

3. **Wrong Target for CNAME**
   - Delete old CNAME
   - Add new one with exact value from Vercel

4. **Missing Records**
   - Make sure you have BOTH records
   - Not just one

---

### **Step 4: Wait for DNS Propagation**

After updating DNS:
- **Typical:** 5-10 minutes
- **Maximum:** 30 minutes

Vercel will automatically detect when DNS is correct and show "Valid Configuration"

---

## 🔍 **How to Check Status**

**Option 1: Vercel Dashboard**
1. Settings → Domains → Click `britandkarl.com`
2. Look for status:
   - ✅ **Valid Configuration** = Working!
   - ⚠️ **Invalid Configuration** = DNS still wrong
   - ⏳ **Pending** = Waiting for DNS

**Option 2: Run Diagnostic**
```bash
python apps/wedding/diagnose_dns.py
```

---

## 📋 **Checklist**

- [ ] Domain added in Vercel ✅ (already done)
- [ ] Got DNS records from Vercel
- [ ] Added A record in Cloudflare with correct IP
- [ ] Added CNAME record in Cloudflare with correct target
- [ ] Both records have Proxy ON (orange cloud)
- [ ] Waited 10-30 minutes
- [ ] Vercel shows "Valid Configuration"

---

## 🆘 **Still Not Working?**

**Share:**
1. What DNS records you have in Cloudflare (Type, Name, Value)
2. What Vercel shows in the domain settings
3. Any error messages

**I'll help fix it!** 🎯

---

## 💡 **Key Point**

**This is a Cloudflare DNS issue, not Vercel.**

Vercel is correctly configured - you just need to:
1. Update DNS records in Cloudflare
2. Match them exactly to what Vercel shows
3. Wait for propagation

**No need to change anything in Vercel!** ✅

