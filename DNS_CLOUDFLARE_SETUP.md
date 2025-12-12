# 🌐 Cloudflare DNS → Vercel Setup (From Frat)

**Super simple setup - just two DNS records!**

---

## ✅ **Prerequisites**

- ✅ Your domain is in Cloudflare (`britandkarl.com`)
- ✅ The wedding app is deployed on Vercel
- ✅ Vercel project name: `wedding`

---

## 1️⃣ **Add Custom Domain in Vercel**

**Do this first!**

1. Go to **Vercel Dashboard**
2. Open the **`wedding`** project
3. Go to **Settings → Domains**
4. Click **"Add Domain"**
5. Enter: **`britandkarl.com`**
6. Click **"Add"**

**Vercel will show you exact DNS records it expects.**

They'll look something like:

| Type  | Name | Target               |
| ----- | ---- | -------------------- |
| CNAME | www  | cname.vercel-dns.com |
| A     | @    | 76.76.21.21          |

**📋 Write down these values - you'll need them!**

---

## 2️⃣ **Go to Cloudflare → DNS Tab**

1. Open **Cloudflare Dashboard**
2. Select **`britandkarl.com`**
3. Go to **DNS** tab

---

## 3️⃣ **Add DNS Records in Cloudflare**

Add **two records** exactly as Vercel showed:

### **Record 1 — Root Domain (`britandkarl.com`)**

| Field        | Value         |
| ------------ | ------------- |
| Type         | **A**         |
| Name         | `@`           |
| IP Address   | `76.76.21.21` |
| Proxy Status | **Proxied** (orange cloud ON) ✅ |

**Notes:**
- `@` means root domain: `britandkarl.com`
- `76.76.21.21` is Vercel's IP (Vercel will show you the exact IP)

---

### **Record 2 — www Subdomain**

| Field        | Value                  |
| ------------ | ---------------------- |
| Type         | **CNAME**              |
| Name         | `www`                  |
| Target       | `cname.vercel-dns.com` |
| Proxy Status | **Proxied** (orange cloud ON) ✅ |

This means `www.britandkarl.com` also points to Vercel.

---

## 4️⃣ **DNS Propagation**

**Usually:** 30 seconds  
**Worst case:** 10–30 minutes

Vercel will turn **green** in the domain list once it validates.

---

## 5️⃣ **Edit "www" Redirect (Optional but Recommended)**

If someone types `www.britandkarl.com`, redirect to bare `britandkarl.com`:

1. Cloudflare → **Rules** → **Redirect Rules**
2. Create rule:
   - **If:** Hostname equals `www.britandkarl.com`
   - **Then:** Redirect to `https://britandkarl.com` (301)

Keeps URLs clean - most modern wedding sites go bare domain!

---

## 6️⃣ **SSL Configuration**

**Cloudflare:**
- **SSL/TLS** → Set to **Full**

**Vercel:**
- Automatically issues real certificates
- No custom cert needed

---

## 7️⃣ **Enable Caching & Performance (Optional)**

Once site is stable:

Cloudflare → **Caching** → Enable:
- Automatic Cache Management
- Brotli compression
- Early hints

**Totally optional**, but makes the site fast!

---

## 8️⃣ **Test**

Try in browser:
- ✅ `http://britandkarl.com`
- ✅ `https://britandkarl.com`
- ✅ `https://www.britandkarl.com`

All should land on your Vercel app!

---

## ✅ **Mini Checklist**

- [ ] Domain added to Vercel project
- [ ] Two DNS records entered in Cloudflare
  - [ ] A record for `@` (root)
  - [ ] CNAME record for `www`
- [ ] Proxy status: **ON** (orange cloud) for both
- [ ] SSL set to **Full** in Cloudflare
- [ ] `.vercel.app` URL already works
- [ ] Domain resolves
- [ ] Test all three URLs

---

## 🎯 **Optional: Ditch `www` (Clean Brand Look)**

If you want **ONLY** the bare domain:

1. Keep the **A record** for `@`
2. **Remove** the `www` CNAME
3. Add redirect rule: `www.britandkarl.com` → `britandkarl.com`

Most modern wedding sites go bare domain - looks cleaner!

---

## 🧠 **Optional: Subdomain Staging**

If you want a private beta before launch:

Example: `beta.britandkarl.com`

Just add:
| Type  | Name | Target               |
| ----- | ---- | -------------------- |
| CNAME | beta | cname.vercel-dns.com |

Point Vercel preview deploys there - guests never see it!

---

## 💡 **Final Reassurance**

> After the DNS is added, Cloudflare just steps back
> and your site is a first-class Vercel deployment
> with your custom domain.

**No Render. No backend server. No extra infra bill.**

It's as plug-and-play as modern hosting gets!

**And `britandkarl.com` looks perfect as a wedding URL!** 💍

---

**Ready?** Follow the steps above and you'll be live in minutes! 🚀

