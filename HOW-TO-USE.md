# 🎯 How to Make This Your Own Website

## Quick Start (3 steps)

### Step 1: Replace Your Photos
Open **`src/config.ts`** — this is the **ONLY file you need to edit**.

Replace the stock photos with your own macro photos:

**Option A — Upload photos online (easiest):**
1. Upload your photos to [Imgur](https://imgur.com), [Cloudinary](https://cloudinary.com), or [imgbb](https://imgbb.com)
2. Copy the direct image URL
3. Paste it in the `src` and `srcFull` fields in `config.ts`

**Option B — Use local files:**
1. Create a `public/photos/` folder
2. Put your macro photos there (e.g., `public/photos/my-spider.jpg`)
3. Reference them as `/photos/my-spider.jpg` in `config.ts`

### Step 2: Update Your Info
Still in **`src/config.ts`**, update:
- `SITE.name` — your brand name
- `SITE.tagline` — your tagline
- `SITE.email` — your email
- `ABOUT.paragraphs` — your bio text
- `SOCIAL` — your social media links
- `HERO_STATS` — your stats/achievements

### Step 3: Deploy It (Free!)

Run the build:
```bash
npm run build
```

Your website is now in the `dist/` folder. Deploy it for free:

| Platform | How |
|---|---|
| **Netlify** (easiest) | Go to [app.netlify.com/drop](https://app.netlify.com/drop), drag & drop your `dist/` folder |
| **Vercel** | Push to GitHub → connect at [vercel.com](https://vercel.com) |
| **GitHub Pages** | Push to GitHub → Settings → Pages → Deploy from branch |
| **Cloudflare Pages** | Connect GitHub at [pages.cloudflare.com](https://pages.cloudflare.com) |

---

## File Structure

```
src/
├── config.ts      ← ✏️  EDIT THIS (your photos, bio, links)
├── App.tsx        ← 🚫 Don't edit (layout & components)
├── index.css      ← 🚫 Don't edit (styling)
└── main.tsx       ← 🚫 Don't edit (entry point)

public/
└── photos/        ← 📸 Put your macro photos here (optional)
```

---

## Adding a New Photo

In `src/config.ts`, add a new entry to the `PORTFOLIO_IMAGES` array:

```ts
{
  id: "13",                              // unique ID
  src: "/photos/my-photo.jpg",           // thumbnail (grid view)
  srcFull: "/photos/my-photo-full.jpg",  // full-res (lightbox)
  title: "My Amazing Macro Shot",        // title shown in gallery
  category: "Insects",                   // must match a CATEGORIES entry
  tags: ["macro", "insect", "dew"],      // searchable keywords
  description: "The story behind...",    // shown in lightbox detail
  gear: "Camera + Lens",                // your gear info
  location: "City, Country",             // where you shot it
},
```

## Adding a New Category

In `src/config.ts`, add it to the `CATEGORIES` array:

```ts
export const CATEGORIES = [
  "All",
  "Insects",
  "Flies & Bugs",
  "Tiny Animals",
  "Nature & Flora",
  "My New Category",   // ← add here
];
```

Then use `"My New Category"` in your photo's `category` field.

---

## Custom Domain

After deploying on Netlify/Vercel, you can connect a custom domain:
1. Buy a domain (e.g., from Namecheap, Google Domains, Cloudflare)
2. In your hosting dashboard, go to Domain Settings
3. Add your custom domain and follow the DNS instructions

---

## Need Help?

- The site is fully responsive (mobile + desktop)
- All animations work automatically
- The gallery filter, search, and lightbox are built-in
- The contact form shows a success toast (connect to a real backend like Formspree for actual emails)
