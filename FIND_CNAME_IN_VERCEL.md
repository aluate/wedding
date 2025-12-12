# 📍 Where to Find Your CNAME Record in Vercel

**Domain:** `britandkarl.com`

---

## 🎯 **Quick Answer: Where to Find CNAME**

After you add your domain to Vercel, the CNAME record is shown in **two places**:

1. **Domain Configuration Page** (when you add the domain)
2. **Domain Settings Page** (after domain is added)

---

## 📋 **Step-by-Step: Finding Your CNAME**

### **Step 1: Add Domain to Vercel**

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click on your **"wedding"** project
3. Go to **Settings** (top navigation bar)
4. Click **"Domains"** (left sidebar)
5. Click **"Add"** button
6. Enter: `britandkarl.com`
7. Click **"Add"**

---

### **Step 2: CNAME Record is Displayed**

**Right after adding the domain**, Vercel will show you a screen that looks like this:

```
┌─────────────────────────────────────────┐
│  Configure DNS                          │
│                                         │
│  To point britandkarl.com to Vercel:   │
│                                         │
│  Add the following DNS record:          │
│                                         │
│  Type:   CNAME                          │
│  Name:   @                              │
│  Value:  cname.vercel-dns.com          │
│          (or similar)                   │
└─────────────────────────────────────────┘
```

**📋 Copy these values:**
- **Type:** CNAME
- **Name:** `@` (or blank for root domain)
- **Value:** Something like `cname.vercel-dns.com` or `cname.vercel-dns.com.`

**⚠️ IMPORTANT:** Write down the **Value** (Target) - you'll need this for Cloudflare!

---

### **Step 3: View Domain Status Later**

If you need to see the CNAME record again later:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Click on **`britandkarl.com`** in the domains list
4. You'll see:
   - **Configuration Status**
   - **DNS Records needed** section
   - The CNAME value you need

---

## 🔍 **Visual Guide**

### **Location 1: When Adding Domain**

```
Vercel Dashboard
  └── Your Project (wedding)
      └── Settings
          └── Domains
              └── [Click "Add"]
                  └── Enter: britandkarl.com
                      └── [Click "Add"]
                          └── **CNAME DISPLAYED HERE** ⭐
```

### **Location 2: Domain Settings (Later)**

```
Vercel Dashboard
  └── Your Project (wedding)
      └── Settings
          └── Domains
              └── britandkarl.com (click on it)
                  └── **CNAME DISPLAYED HERE** ⭐
```

---

## 📝 **What You'll See**

The DNS configuration page typically shows something like:

**For Root Domain:**
```
Type:    CNAME
Name:    @
Value:   cname.vercel-dns.com
```

**Or it might show:**
```
Type:    CNAME  
Name:    @
Target:  cname.vercel-dns.com
```

**Or even:**
```
Type:    CNAME
Host:    @
Points to:  cname.vercel-dns.com
```

The **value/target/points to** is what you need - that's your CNAME value!

---

## ⚠️ **Important Notes**

1. **The Value Might Vary:**
   - Common: `cname.vercel-dns.com`
   - Might include: `.` at the end
   - Might be project-specific

2. **Copy Exactly:**
   - Copy the entire value exactly as shown
   - Include trailing dots if present
   - Don't modify it

3. **Status Indicators:**
   - ❌ **Invalid Configuration** = DNS not set up yet
   - ⏳ **Pending** = DNS is set, waiting to verify
   - ✅ **Valid Configuration** = DNS is working!

---

## ✅ **After You Copy the CNAME**

Take that CNAME value and add it to Cloudflare:

1. Go to Cloudflare Dashboard
2. Select `britandkarl.com`
3. DNS → Records → Add Record
4. Type: CNAME
5. Name: `@`
6. Target: **[Paste the value from Vercel]**
7. Proxy: OFF (gray cloud)
8. Save

See `DNS_CLOUDFLARE_GUIDE.md` for detailed Cloudflare instructions.

---

## 🆘 **Can't Find It?**

If you don't see the CNAME record:

1. **Check Domain Status:**
   - Settings → Domains
   - Look for status messages
   - Click on the domain name

2. **Try Adding Domain Again:**
   - If it's already added, remove it and re-add
   - The CNAME will show during the add process

3. **Check Vercel Docs:**
   - https://vercel.com/docs/concepts/projects/domains

---

## 📸 **Screenshot Reference**

The CNAME is typically shown in a section like:

```
┌─────────────────────────────────────┐
│ Configure DNS                       │
├─────────────────────────────────────┤
│                                     │
│ Add this record in your DNS:        │
│                                     │
│  Type: CNAME                        │
│  Name: @                            │
│  Target: cname.vercel-dns.com      │ ← THIS IS WHAT YOU NEED
│                                     │
│  [Copy] [Learn more]                │
└─────────────────────────────────────┘
```

---

**Got the CNAME value?** Now go to Cloudflare and add it! See `DNS_CLOUDFLARE_GUIDE.md` for next steps. 🚀

