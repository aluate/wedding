# 🔧 Vercel Root Directory - What to Select

**IMPORTANT:** Based on your repository structure, here's what to select:

---

## ✅ **CORRECT Selection**

You should select: **`wedding`** (the root folder)

**NOT** `app` - that's just the Next.js pages directory!

---

## 📋 **What You're Seeing**

In the Vercel dialog, you'll see:

```
○ wedding          ← SELECT THIS ONE! ✅
  └─ ○ app         ← DON'T select this (wrong!)
     ├─ components
     └─ config
```

---

## 🎯 **Why?**

Your repository structure is:

```
wedding/              ← This is the ROOT
├── package.json      ← Project config is here
├── next.config.js    ← Next.js config is here
├── app/              ← This is just the pages folder
├── components/
├── config/
└── ...
```

Since `package.json` and `next.config.js` are at the **root** of the repo, Vercel needs the **root directory** set to the repo root (which is `wedding`).

---

## ✅ **What to Do**

1. **In the Vercel dialog:**
   - Click the radio button next to **`wedding`** (the top-level folder)
   - Make sure it's selected (filled in)

2. **Click "Continue"**

3. **Verify:**
   - Framework should auto-detect as "Next.js"
   - Build command should be `npm run build`
   - Everything should work!

---

## ❌ **If You Selected `app` (Wrong)**

If you selected `app` instead:
- Build will fail (can't find `package.json`)
- Vercel won't detect Next.js properly
- You'll get errors

**Fix:** Go back and select `wedding` (the root) instead!

---

## 🔍 **How to Know It's Right**

After selecting `wedding` and continuing:

- ✅ Vercel shows "Framework: Next.js"
- ✅ Build command is `npm run build`
- ✅ Root Directory shows as `/` or blank (repo root)

---

**TL;DR:** Select **`wedding`** (the root folder), not `app`! ✅

