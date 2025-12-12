# 🔧 DNS Troubleshooting Guide

**Domain:** `britandkarl.com`

---

## 🔍 **Quick Diagnostic**

Run this to check domain status:

```bash
python apps/wedding/check_domain_status.py
```

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: Domain Shows as "Invalid Configuration" in Vercel**

**What it means:** DNS records aren't set up correctly in Cloudflare.

**Fix:**
1. Go to Cloudflare Dashboard → DNS → Records
2. Check you have BOTH records:
   - ✅ A record: `@` → `76.76.21.21` (use IP from Vercel)
   - ✅ CNAME: `www` → `cname.vercel-dns.com`
3. Make sure both have **Proxy ON** (orange cloud)
4. Wait 5-10 minutes

---

### **Issue 2: Domain Not Verified**

**What it means:** Vercel can't verify DNS is set up correctly.

**Fix:**
1. Verify DNS records match exactly what Vercel shows
2. Check Cloudflare SSL/TLS is set to **Full**
3. Make sure Proxy is **ON** for both records
4. Wait for DNS propagation (can take 10-30 minutes)

---

### **Issue 3: Domain Added But Site Not Loading**

**Possible causes:**

1. **DNS Not Propagated Yet**
   - Wait 10-30 minutes
   - Check again

2. **Wrong DNS Records**
   - Verify records match Vercel exactly
   - Check for typos

3. **Proxy Status Wrong**
   - Should be **ON** (orange cloud) for both records
   - Not DNS only (gray cloud)

4. **SSL Configuration**
   - Cloudflare SSL/TLS should be **Full**
   - Not Flexible

---

### **Issue 4: One URL Works, Other Doesn't**

**If `britandkarl.com` works but `www.britandkarl.com` doesn't:**
- Check CNAME record for `www` is set correctly

**If `www.britandkarl.com` works but `britandkarl.com` doesn't:**
- Check A record for `@` is set correctly
- Verify IP address matches Vercel

---

## 🔍 **Step-by-Step Diagnosis**

### **Step 1: Check Vercel Domain Status**

1. Go to Vercel Dashboard
2. Project: `wedding`
3. Settings → Domains
4. Click on `britandkarl.com`

**Look for:**
- ✅ **Valid Configuration** = Good!
- ⚠️ **Invalid Configuration** = DNS issue
- ⏳ **Pending** = Waiting for DNS

---

### **Step 2: Check Cloudflare DNS Records**

1. Cloudflare Dashboard → `britandkarl.com`
2. DNS → Records

**Verify you have:**

| Type  | Name | Content/Target          | Proxy |
| ----- | ---- | ----------------------- | ----- |
| A     | @    | 76.76.21.21 (from Vercel) | ON ✅ |
| CNAME | www  | cname.vercel-dns.com    | ON ✅ |

**If missing or wrong:**
- Delete incorrect records
- Add correct records
- Wait 5-10 minutes

---

### **Step 3: Check Cloudflare SSL/TLS**

1. Cloudflare Dashboard
2. SSL/TLS
3. Should be set to: **Full**

**Not "Flexible"** - that causes issues!

---

### **Step 4: Wait for Propagation**

- **Typical:** 5-10 minutes
- **Maximum:** 30 minutes
- **Check again** after waiting

---

## 🎯 **Quick Fixes**

### **If DNS Records Are Wrong:**

1. **Delete old records** in Cloudflare
2. **Get exact values** from Vercel (when you add domain)
3. **Add new records** with exact values
4. **Enable Proxy** (orange cloud)
5. **Wait 10 minutes**

### **If Proxy is OFF:**

1. Click the **gray cloud** in Cloudflare
2. It should turn **orange**
3. Wait 5 minutes

### **If SSL is Flexible:**

1. Cloudflare → SSL/TLS
2. Change from **Flexible** to **Full**
3. Wait 5 minutes

---

## 📊 **Status Check**

Run diagnostic:

```bash
python apps/wedding/check_domain_status.py
```

**Or check manually:**

1. **Vercel:** Settings → Domains → Click domain
   - Status will show: Valid/Invalid/Pending

2. **Cloudflare:** DNS → Records
   - Should show 2 records (A and CNAME)

3. **Test in browser:**
   - `https://britandkarl.com`
   - `https://www.britandkarl.com`

---

## ⏱️ **Timeline**

- **Add domain to Vercel:** Immediate
- **Add DNS records:** 2 minutes
- **DNS propagation:** 10-30 minutes
- **Site accessible:** After propagation

---

## 🆘 **Still Not Working?**

**Share these details:**

1. What Vercel shows (Valid/Invalid/Pending)
2. What Cloudflare DNS records you have
3. Error message (if any)
4. How long you've waited

**I'll help diagnose!** 🎯

