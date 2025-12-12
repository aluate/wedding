# 🔍 Quick Guide: Where to Find CNAME in Vercel

**Domain:** `britandkarl.com`

---

## 🎯 **Quick Answer**

The CNAME record appears **right after you add your domain** to Vercel. Here's exactly where:

---

## 📍 **Where It Shows Up**

### **Location: Vercel Dashboard → Project → Settings → Domains**

1. **Add the domain** (Settings → Domains → Add → `britandkarl.com`)
2. **CNAME is displayed immediately** on the next screen
3. **Copy the "Target" or "Value"** field

---

## 📸 **What It Looks Like**

After clicking "Add" for your domain, you'll see a page that says:

```
╔════════════════════════════════════════╗
║  Configure DNS for britandkarl.com    ║
╠════════════════════════════════════════╣
║                                        ║
║  Add this DNS record in Cloudflare:   ║
║                                        ║
║  ┌──────────────────────────────────┐ ║
║  │ Type:    CNAME                   │ ║
║  │ Name:    @                       │ ║
║  │ Target:  cname.vercel-dns.com    │ ║ ← COPY THIS!
║  └──────────────────────────────────┘ ║
║                                        ║
║  [Copy]  [Instructions]                ║
╚════════════════════════════════════════╝
```

**You need the "Target" value** (the part after "Target:")

---

## 🚀 **Step-by-Step**

### **Step 1: Add Domain**
```
Vercel Dashboard
  → Click "wedding" project
  → Settings (top menu)
  → Domains (left sidebar)
  → Click "Add" button
  → Type: britandkarl.com
  → Click "Add"
```

### **Step 2: Copy CNAME**
```
Next screen shows:
  Type: CNAME
  Name: @
  Target: cname.vercel-dns.com  ← COPY THIS ENTIRE VALUE
```

### **Step 3: Use in Cloudflare**
```
Cloudflare Dashboard
  → Select britandkarl.com
  → DNS → Records
  → Add Record
  → Type: CNAME
  → Name: @
  → Target: [paste value from Vercel]
  → Proxy: OFF (gray cloud)
  → Save
```

---

## 🔄 **If You Missed It**

If you already added the domain and missed the CNAME:

1. Go to: **Settings → Domains**
2. Click on **`britandkarl.com`** in the list
3. Look for **"DNS Records"** or **"Configuration"** section
4. The CNAME value will be shown there

Or:

1. Remove the domain (Settings → Domains → click domain → Remove)
2. Add it again
3. The CNAME will show during the add process

---

## 📋 **What You'll Copy**

The CNAME "Target" value will look something like:

- `cname.vercel-dns.com`
- `cname.vercel-dns.com.` (with trailing dot)
- Or similar Vercel DNS target

**Copy the entire value exactly as shown!**

---

## ✅ **Quick Checklist**

- [ ] Added domain to Vercel project
- [ ] Copied CNAME Target value
- [ ] Ready to add to Cloudflare

---

**Need more detail?** See `FIND_CNAME_IN_VERCEL.md` for the full guide!  
**Ready to add to Cloudflare?** See `DNS_CLOUDFLARE_GUIDE.md`!

