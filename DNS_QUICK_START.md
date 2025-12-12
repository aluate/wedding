# ⚡ DNS Quick Start - britandkarl.com

**From Frat's Instructions - Super Simple!**

---

## 🎯 **Quick Answer**

Route `britandkarl.com` → Vercel with **just two DNS records**.

---

## 📋 **Step-by-Step**

### **1. Add Domain in Vercel**

1. Vercel Dashboard → `wedding` project
2. **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter: `britandkarl.com`
5. **Copy the DNS records** Vercel shows you

---

### **2. Add DNS in Cloudflare**

1. Cloudflare Dashboard → `britandkarl.com`
2. **DNS** tab
3. Add **two records**:

**Record 1 - Root Domain:**
- Type: **A**
- Name: `@`
- IP: `76.76.21.21` (use value from Vercel)
- Proxy: **ON** (orange cloud)

**Record 2 - WWW:**
- Type: **CNAME**
- Name: `www`
- Target: `cname.vercel-dns.com` (use value from Vercel)
- Proxy: **ON** (orange cloud)

---

### **3. Wait 30 Seconds**

DNS propagates quickly. Vercel will show green checkmark when ready.

---

### **4. Test**

Visit:
- ✅ `https://britandkarl.com`
- ✅ `https://www.britandkarl.com`

Both should work!

---

## 💡 **Optional: Redirect www → bare domain**

Cloudflare → **Rules** → **Redirect Rules**:
- `www.britandkarl.com` → `britandkarl.com` (301)

Keeps URLs clean!

---

## 📚 **Full Details**

See `DNS_CLOUDFLARE_SETUP.md` for complete guide with all options!

---

**That's it!** Just two DNS records and you're live! 🚀

