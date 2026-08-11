/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  UPACERS ART — SITE CONFIGURATION                          ║
 * ║                                                             ║
 * ║  This file holds the DEFAULT content for your site.          ║
 * ║  You can also change everything on the live site using the   ║
 * ║  gear button ⚙️ (bottom-right) — no code editing needed!     ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  HOW TO ADD YOUR OWN PHOTOS (easiest way):
 *  ─────────────────────────────────────────
 *  1. Open your website and click the ⚙️ gear button (bottom-right)
 *  2. Go to the "Photos" tab → "Add Photo" → "Upload Photo"
 *  3. Pick a photo, choose its category, and add a title/description
 *
 *  Your photos save automatically on your device.
 *
 *  HOW TO DEPLOY (put it online):
 *  ──────────────────────────────
 *  Run "npm run build", then upload the "dist/" folder to:
 *   • Netlify   → https://app.netlify.com/drop (drag & drop)
 *   • Vercel    → https://vercel.com
 *   • Cloudflare Pages → https://pages.cloudflare.com
 */

// ─── YOUR BRAND ───
export const SITE = {
  name: "Upacers Art", // Your brand name
  tagline: "Unseen Tiny Worlds", // Your tagline
  email: "upacers@gmail.com", // Your contact email
  heroDescription:
    "Exploring the hidden worlds most people never see. Handheld macro photography revealing the extraordinary details of nature's smallest creations.",
};

// ─── HERO STATS (shown below the hero CTA) ───
export const HERO_STATS = [
  { label: "Handheld Macro" },
  { label: "3+ Years" },
  { label: "Hidden Worlds" },
];

// ─── HERO BACKGROUND IMAGE ───
// Replace with your own best macro shot (use the ⚙️ editor or upload to /explore-nature/).
export const HERO_BG_IMAGE =
  "https://images.pexels.com/photos/6527217/pexels-photo-6527217.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000";

// ─── ABOUT SECTION ───
export const ABOUT = {
  // Change this on the live site by hovering your About photo → "Change Photo"
  photo:
    "https://images.pexels.com/photos/7875578/pexels-photo-7875578.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  specialty: "Handheld Macro Photography",
  paragraphs: [
    'I\'m <strong class="text-dark-800">Peteris</strong>, the eye behind Upacers Art. I\'ve been shooting nature\'s creations for three years, drawn to the miniature worlds that exist just beyond our everyday sight.',
    'I love discovering <strong class="text-dark-800">hidden worlds most people never see</strong> — the tiny creatures, delicate textures, and fleeting moments of light that reveal themselves only when you look closely enough.',
    "Through handheld macro photography, I share that wonder. Every frame is an invitation to slow down and notice the extraordinary life unfolding right beneath our feet.",
  ],
  badges: ["Handheld Macro", "Natural Light", "Nature Focus", "3+ Years"],
  quote: '"Macro photography trains you in focus, patience, and creativity."',
};

// ─── SOCIAL LINKS ───
// Leave a value as "" to hide that link.
export const SOCIAL = {
  facebook: "https://www.facebook.com/peteris.upacers", // Your Facebook URL
  email: "mailto:upacers@gmail.com", // Your email
  website: "", // Your website (leave empty if none)
};

// ─── GALLERY CATEGORIES ───
// Each matches a folder in public/explore-nature/
export const CATEGORIES = [
  "All",
  "Bugs",
  "Flies",
  "Ants",
  "People & Lifestyle",
  "Snails",
  "Spiders",
  "Worms",
  "Flowers",
  "Animals",
  "Birds",
];

// ─── YOUR PORTFOLIO PHOTOS ───
// The gallery is currently EMPTY — ready for YOUR photos.
// Add them easily with the ⚙️ editor (Photos tab → Add Photo),
// or add entries here using the format below.
//
//   id          → unique string (e.g. "1", "my-spider-shot")
//   src         → image shown in the grid
//   srcFull     → image shown in the lightbox (can be the same as src)
//   title       → photo title
//   category    → must match a CATEGORIES entry above
//   tags        → searchable keywords
//   description → story behind the shot (shown in lightbox)
//   gear        → camera + lens used
//   location    → where you took it
//
export const PORTFOLIO_IMAGES = [
  // Example (remove the // to use it):
  // {
  //   id: "1",
  //   src: "/explore-nature/spiders/my-spider.jpg",
  //   srcFull: "/explore-nature/spiders/my-spider.jpg",
  //   title: "My First Macro Shot",
  //   category: "Spiders",
  //   tags: ["spider", "macro", "eyes"],
  //   description: "The story behind this shot...",
  //   gear: "Camera + Lens",
  //   location: "City, Country",
  // },
];
