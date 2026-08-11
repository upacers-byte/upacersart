import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Menu,
  Camera,
  Sparkles,
  ChevronRight,
  Search,
  Grid3X3,
  Heart,
  Download,
  Eye,
  Mail,
  MapPin,
  ArrowRight,
  Quote,
  Send,
  ExternalLink,
  Award,
  Zap,
  Layers,
  Upload,
  RotateCcw,
  Settings,
  ShoppingBag,
  Package,
  CreditCard,
  Check,
} from "lucide-react";
import {
  ContentProvider,
  useContent,
  compressImage,
  readFileAsDataURL,
  type PortfolioImage,
} from "./content";
import AdminPanel from "./AdminPanel";

/* ─── Image Protection Utilities ─── */

/** Block right-click context menu */
const blockContextMenu = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

/** Block drag-and-drop saving */
const blockDrag = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

/**
 * ProtectedImage — A secure image wrapper that:
 * 1. Disables right-click (no "Save Image As...")
 * 2. Disables drag-and-drop (can't drag to desktop)
 * 3. Places a transparent overlay (attempts to save capture blank)
 * 4. Applies CSS user-select: none + -webkit-user-drag: none
 *
 * Use `variant="lightbox"` for the stronger lightbox shield.
 */
function ProtectedImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loading,
  variant = "default",
}: {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  loading?: "eager" | "lazy";
  variant?: "default" | "lightbox";
}) {
  const shieldClass =
    variant === "lightbox" ? "lightbox-image-shield" : "protected-image-wrap";

  return (
    <div
      className={`${shieldClass} ${wrapperClassName}`}
      onContextMenu={blockContextMenu}
      onDragStart={blockDrag}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={className}
        onContextMenu={blockContextMenu}
        onDragStart={blockDrag}
        draggable={false}
      />
    </div>
  );
}

/* ─── ScrollReveal ─── */
function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const dirMap = {
    up: { y: 36, x: 0 },
    left: { x: -36, y: 0 },
    right: { x: 36, y: 0 },
    none: { x: 0, y: 0 },
  };
  const { y, x } = dirMap[direction];
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 26 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const { site: SITE } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Gallery", "Shop", "About", "Contact"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark-strong" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-500/20 transition-transform duration-300 group-hover:scale-110">
            <Camera className="h-[18px] w-[18px] text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-bold tracking-tight text-dark-950">
            {SITE.name.split(" ")[0]}
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-dark-700 transition-colors hover:bg-dark-200 hover:text-dark-950"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="#gallery"
            className="shimmer rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-600/20 transition-all hover:shadow-xl hover:shadow-accent-600/30 hover:brightness-110"
          >
            Explore Gallery
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-dark-700 hover:bg-dark-200 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <motion.div
        initial={{ height: 0 }}
        animate={mobileOpen ? { height: "auto" } : { height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden md:hidden"
      >
        <div className="glass-dark-strong mx-4 mb-4 flex flex-col gap-1 rounded-2xl p-3">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-dark-700 hover:bg-dark-200 hover:text-dark-950"
            >
              {l}
            </a>
          ))}
          <a
            href="#gallery"
            onClick={() => setMobileOpen(false)}
            className="mt-2 rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 px-5 py-3 text-center text-sm font-semibold text-white"
          >
            Explore Gallery
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const { site: SITE, heroStats: HERO_STATS, heroBgImage: HERO_BG_IMAGE } =
    useContent();
  const statIcons = [Camera, Award, MapPin];

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="ambient-glow -top-40 left-0 h-[600px] w-[600px] bg-accent-500" />
      <div className="ambient-glow top-1/3 -right-20 h-[500px] w-[500px] bg-glow-2" />
      <div className="ambient-glow -bottom-32 left-1/3 h-[400px] w-[400px] bg-glow-3" />

      <div className="absolute inset-0 z-0">
        <ProtectedImage
          src={HERO_BG_IMAGE}
          alt=""
          className="h-full w-full object-cover opacity-25"
          wrapperClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-0/55 via-dark-0/45 to-dark-0/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-dark-300 bg-dark-100/60 px-4 py-1.5 text-sm font-medium text-dark-700 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent-400" />
            Macro Photography Portfolio
          </motion.div>

          <h1 className="text-5xl font-bold tracking-tight text-dark-950 sm:text-6xl lg:text-7xl">
            {SITE.tagline.split(" ").map((word, i) =>
              i >= 1 ? (
                <span key={i} className="gradient-text">
                  {i === 1 ? " " : ""}
                  {word}{" "}
                </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-dark-600 sm:text-xl">
            {SITE.heroDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#gallery"
            className="shimmer inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 px-7 py-4 text-base font-semibold text-white shadow-2xl shadow-accent-600/20 transition-all hover:shadow-accent-600/30 hover:brightness-110"
          >
            Explore the Tiny World{" "}
            <ChevronRight className="h-[18px] w-[18px]" />
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-xl border border-dark-300 bg-dark-100/40 px-7 py-4 text-base font-semibold text-dark-700 backdrop-blur-sm transition-all hover:bg-dark-200 hover:text-dark-900 hover:border-dark-400"
          >
            About the Photographer
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-dark-500"
        >
          {HERO_STATS.map((item, i) => {
            const Icon = statIcons[i % statIcons.length];
            return (
              <div key={item.label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-accent-400" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="h-10 w-6 rounded-full border-2 border-dark-400 flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-accent-400"
          />
        </div>
      </motion.div>
    </section>
  );
}

/* ─── Gallery ─── */
function Gallery() {
  const { categories: CATEGORIES, portfolioImages: PORTFOLIO_IMAGES } =
    useContent();
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = (PORTFOLIO_IMAGES as PortfolioImage[]).filter((img) => {
    const catMatch =
      activeCategory === "All" || img.category === activeCategory;
    if (!searchQuery) return catMatch;
    const q = searchQuery.toLowerCase();
    return (
      catMatch &&
      (img.title.toLowerCase().includes(q) ||
        img.tags.some((t) => t.toLowerCase().includes(q)) ||
        img.location.toLowerCase().includes(q))
    );
  });

  return (
    <section
      id="gallery"
      className="relative py-28 overflow-hidden gallery-protected"
    >
      <div className="ambient-glow -top-32 right-0 h-[500px] w-[500px] bg-accent-500" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-[0.25em]">
              Portfolio
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-dark-950 sm:text-5xl">
              The <span className="gradient-text">Collection</span>
            </h2>
            <p className="mx-auto max-w-xl text-dark-600">
              Every image captured handheld in the wild — no staging, no studio.
              Just patience, precision, and passion.
            </p>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-accent-600 text-white shadow-lg shadow-accent-600/25"
                      : "bg-dark-100 border border-dark-300 text-dark-600 hover:border-dark-400 hover:text-dark-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, tag, location..."
                className="w-full sm:w-60 rounded-xl border border-dark-300 bg-dark-100 pl-10 pr-4 py-2.5 text-sm text-dark-800 placeholder:text-dark-500 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Photo count */}
        <ScrollReveal delay={0.15}>
          <p className="text-xs text-dark-500 mb-6">
            Showing {filtered.length} of {PORTFOLIO_IMAGES.length} images
            {activeCategory !== "All" && (
              <span>
                {" "}in <span className="text-accent-400">{activeCategory}</span>
              </span>
            )}
          </p>
        </ScrollReveal>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Grid3X3 className="mx-auto h-10 w-10 text-dark-400 mb-4" />
            {PORTFOLIO_IMAGES.length === 0 ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-dark-700">
                  Your gallery is empty
                </p>
                <p className="text-sm text-dark-500 max-w-md mx-auto">
                  This is where your macro photos will appear. Click the{" "}
                  <Settings className="inline h-4 w-4 text-accent-400 align-text-bottom" />{" "}
                  gear button (bottom-right), then the <strong>Photos</strong>{" "}
                  tab → <strong>Add Photo</strong> to upload your first image.
                </p>
              </div>
            ) : (
              <p className="text-dark-500">
                No photos match this filter. Try a different category or search.
              </p>
            )}
          </div>
        ) : (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((img) => (
              <StaggerItem key={img.id}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedImage(img)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-dark-100 border border-dark-200 transition-all hover:border-dark-400 hover:shadow-2xl hover:shadow-black/40"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ProtectedImage
                      src={img.src}
                      alt={img.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      wrapperClassName="h-full w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-0/70 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

                    <span className="absolute top-3 left-3 rounded-lg bg-dark-0/70 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-dark-700">
                      {img.category}
                    </span>

                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                      <button className="flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-semibold text-dark-900 hover:bg-white transition-colors">
                        <Eye className="h-4 w-4" /> View Detail
                      </button>
                    </div>

                    {/* Watermark on gallery thumbnail */}
                    <span className="absolute bottom-3 right-3 z-10 rounded-md bg-dark-0/60 px-2 py-1 text-[10px] font-semibold tracking-wide text-dark-700 backdrop-blur-sm">
                      © Upacers Art
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-dark-900 truncate">
                      {img.title}
                    </h3>
                    <p className="text-xs text-dark-500 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {img.location}
                    </p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="lightbox-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl my-8 overflow-hidden rounded-3xl bg-dark-100 border border-dark-300 shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-dark-0/70 backdrop-blur-sm text-dark-700 hover:bg-dark-0 hover:text-dark-900 transition-colors border border-dark-400"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid lg:grid-cols-[1.5fr_1fr]">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full bg-dark-0">
                  <ProtectedImage
                    src={selectedImage.srcFull}
                    alt={selectedImage.title}
                    className="h-full w-full object-cover"
                    wrapperClassName="h-full w-full"
                    variant="lightbox"
                  />
                  {/* Watermark on full-size lightbox image */}
                  <span className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-dark-0/60 px-4 py-2 text-sm font-semibold tracking-wide text-dark-700 backdrop-blur-sm">
                    © Upacers Art
                  </span>
                </div>

                <div className="p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-accent-400 uppercase tracking-wider">
                        {selectedImage.category}
                      </span>
                      <h2 className="text-2xl font-bold text-dark-950 mt-1">
                        {selectedImage.title}
                      </h2>
                    </div>

                    <p className="text-sm text-dark-600 leading-relaxed">
                      {selectedImage.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {selectedImage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-dark-200 px-2.5 py-1 text-xs font-medium text-dark-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-xl bg-dark-200 p-3">
                        <span className="text-xs text-dark-500">Gear</span>
                        <p className="text-sm font-medium text-dark-800">
                          {selectedImage.gear}
                        </p>
                      </div>
                      <div className="rounded-xl bg-dark-200 p-3">
                        <span className="text-xs text-dark-500">Location</span>
                        <p className="text-sm font-medium text-dark-800 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-accent-400" />{" "}
                          {selectedImage.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <motion.a
                      href="#contact"
                      onClick={() => setSelectedImage(null)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="shimmer flex-1 rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-600/20"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Download className="h-4 w-4" /> Request Print
                      </span>
                    </motion.a>
                    <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-dark-300 text-dark-600 hover:bg-dark-200 hover:text-accent-400 transition-colors">
                      <Heart className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* Verify an image URL can actually be displayed by the browser */
function verifyImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Image could not be loaded"));
    img.src = src;
  });
}

/* ─── About Profile Photo (with reliable upload) ─── */
function AboutProfilePhoto() {
  const { about, update } = useContent();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputId = "about-photo-input";

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      let dataUrl: string;
      try {
        // Compress first (smaller file + keeps your original safe)
        dataUrl = await compressImage(file, 1600, 0.85);
      } catch {
        // Fallback: store the file directly if compression isn't possible
        dataUrl = await readFileAsDataURL(file);
      }
      // Make sure the browser can actually DISPLAY this image before saving.
      // (Catches iPhone HEIC + other formats the browser can't render.)
      await verifyImage(dataUrl);
      update({ about: { ...about, photo: dataUrl } });
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
      alert(
        "This image couldn't be displayed by your browser. Please use a JPG or PNG file.\n\niPhone users: set your Camera format to 'Most Compatible', or export the photo as JPG first."
      );
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-dark-300 shadow-2xl">
      <ProtectedImage
        key={about.photo}
        src={about.photo}
        alt="Macro photography by Upacers"
        className="w-full object-cover"
        wrapperClassName="w-full"
      />

      {/* Always-visible Change Photo button.
          It's a <label> tied to the input, so clicking it opens the
          native file picker reliably (no fragile programmatic clicks). */}
      <label
        htmlFor={inputId}
        className={`absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-dark-900 shadow-2xl ring-1 ring-black/5 transition-transform hover:scale-105 ${
          loading ? "pointer-events-none opacity-70" : "cursor-pointer"
        }`}
      >
        {loading ? (
          <>
            <RotateCcw className="h-4 w-4 animate-spin" /> Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Change Photo
          </>
        )}
      </label>

      {/* Success confirmation */}
      {done && (
        <div className="absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-lg bg-green-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
          <CheckIcon className="h-3.5 w-3.5" /> Updated
        </div>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="sr-only"
      />
    </div>
  );
}

/* ─── About ─── */
function About() {
  const { about: ABOUT, site: SITE } = useContent();
  const badgeIcons = [Camera, Zap, MapPin, Award];

  return (
    <section id="about" className="relative py-28 overflow-hidden">
      <div className="ambient-glow -bottom-32 right-0 h-[500px] w-[500px] bg-accent-500" />
      <div className="ambient-glow -top-20 left-0 h-[400px] w-[400px] bg-glow-2" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 items-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <AboutProfilePhoto />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="glass-dark-strong absolute -bottom-5 -right-5 rounded-2xl px-5 py-3.5 border border-dark-400"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600/20">
                    <Layers className="h-5 w-5 text-accent-400" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-dark-500">
                      Specialty
                    </div>
                    <div className="text-sm font-bold text-dark-800">
                      {ABOUT.specialty}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="space-y-6">
              <span className="text-xs font-semibold text-accent-400 uppercase tracking-[0.25em]">
                About the Photographer
              </span>
              <h2 className="text-4xl font-bold tracking-tight text-dark-950 sm:text-5xl">
                The eye behind{" "}
                <span className="gradient-text">the lens</span>
              </h2>
              <div className="space-y-4 text-dark-600 leading-relaxed">
                {ABOUT.paragraphs.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {ABOUT.badges.map((badge, i) => {
                  const Icon = badgeIcons[i % badgeIcons.length];
                  return (
                    <div
                      key={badge}
                      className="flex items-center gap-2 rounded-xl bg-dark-100 border border-dark-300 px-4 py-2.5 text-sm font-medium text-dark-600"
                    >
                      <Icon className="h-4 w-4 text-accent-400" />
                      {badge}
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Quote */}
        <ScrollReveal delay={0.3}>
          <div className="mt-20 mx-auto max-w-3xl text-center">
            <div className="relative">
              <Quote className="mx-auto h-10 w-10 text-accent-500/30 mb-6" />
              <blockquote className="text-2xl font-medium text-dark-700 italic leading-relaxed">
                {ABOUT.quote}
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-dark-500">
                — {SITE.name.split(" ")[0]}
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const { site: SITE } = useContent();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill the form when a customer clicks "Buy Now" in the Shop
  useEffect(() => {
    const raw = window.localStorage.getItem("upacers_order");
    if (!raw) return;
    try {
      const order = JSON.parse(raw);
      if (order.body) {
        setFormState((prev) => ({ ...prev, message: order.body }));
      }
      // Clear it so it doesn't pre-fill again on next visit
      window.localStorage.removeItem("upacers_order");
      // Scroll the message into view on mobile
      setTimeout(() => {
        document
          .querySelector<HTMLTextAreaElement>("#contact textarea")
          ?.focus();
      }, 600);
    } catch {
      // ignore malformed data
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <section
      id="contact"
      className="relative py-28 overflow-hidden"
    >
      <div className="ambient-glow top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] bg-accent-500" />
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-14">
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-[0.25em]">
              Get in Touch
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-dark-950 sm:text-5xl">
              Let's <span className="gradient-text">connect</span>
            </h2>
            <p className="mx-auto max-w-xl text-dark-600">
              Interested in prints, collaborations, workshops, or just want to
              chat about macro photography? Drop me a message.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="glass-dark-strong rounded-3xl p-8 sm:p-10 border border-dark-300"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-dark-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  placeholder="Your name"
                  className="w-full rounded-xl border border-dark-300 bg-dark-100 px-4 py-3 text-sm text-dark-800 placeholder:text-dark-500 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-dark-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-dark-300 bg-dark-100 px-4 py-3 text-sm text-dark-800 placeholder:text-dark-500 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-semibold text-dark-700">
                  Message
                </label>
                <textarea
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  placeholder="Tell me about your project, inquiry, or just say hello..."
                  rows={4}
                  className="w-full rounded-xl border border-dark-300 bg-dark-100 px-4 py-3 text-sm text-dark-800 placeholder:text-dark-500 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/10 transition-all resize-none"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-dark-500">
                <Mail className="h-3.5 w-3.5 text-accent-400" />
                Or email directly:{" "}
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-accent-400 hover:underline"
                >
                  {SITE.email}
                </a>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="shimmer rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-600/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </span>
              </motion.button>
            </div>
          </form>
        </ScrollReveal>

        {/* Success toast */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="flex items-center gap-3 rounded-2xl bg-dark-100 border border-accent-600/30 px-6 py-4 text-dark-800 shadow-2xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-600/20">
                  <CheckIcon className="h-4 w-4 text-accent-400" />
                </div>
                <span className="text-sm font-semibold">
                  Message sent! I'll get back to you soon.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Shop / Prints for Sale ─── */
function Shop() {
  // ⚡ Each button opens a pre-filled email so customers can pay you directly.
  // When you're ready for instant card payments, replace `orderEmail` with a
  // Stripe Payment Link (https://dashboard.stripe.com/payment-links) or PayPal link.
  const plans = [
    {
      name: "Digital Download",
      price: "€2",
      period: "per image",
      desc: "High-resolution file for personal or commercial use. Instant access.",
      features: [
        "Full-resolution JPEG (6000×4000+)",
        "Commercial license included",
        "Instant download",
        "Color profile embedded",
      ],
      highlight: false,
      orderSubject: "Order: Digital Download (€2)",
      orderBody: "Hi! I'd like to order the Digital Download for €2. Please send me the payment details.",
    },
    {
      name: "Fine Art Print",
      price: "€15",
      period: "per print",
      desc: "Museum-grade print on archival paper. Ships free worldwide.",
      features: [
        "Hahnemühle Photo Rag® 308gsm",
        "12×18\" to 24×36\" sizes",
        "Free global shipping",
        "Gift packaging included",
        "30-day return guarantee",
        "Certificate of authenticity",
      ],
      highlight: true,
      orderSubject: "Order: Fine Art Print (€15)",
      orderBody: "Hi! I'd like to order the Fine Art Print for €15. Please send me the payment details and shipping info.",
    },
    {
      name: "Bundle",
      price: "€16",
      period: "per image",
      desc: "Digital + Print together. The complete package at a discount.",
      features: [
        "Everything in Digital",
        "Everything in Print",
        "Priority processing",
        "Free size upgrade to 24×36\"",
      ],
      highlight: false,
      orderSubject: "Order: Bundle - Digital + Print (€16)",
      orderBody: "Hi! I'd like to order the Bundle (Digital + Print) for €16. Please send me the payment details.",
    },
  ];

  return (
    <section id="shop" className="relative py-28 overflow-hidden">
      {/* Ambient glows */}
      <div className="ambient-glow -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] bg-accent-500" />
      <div className="ambient-glow -bottom-32 right-0 h-[400px] w-[400px] bg-accent-400" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-semibold text-accent-400 uppercase tracking-[0.25em]">
              Shop
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-dark-950 sm:text-5xl">
              Bring the <span className="gradient-text">tiny worlds</span> home
            </h2>
            <p className="mx-auto max-w-2xl text-dark-600">
              Own a piece of the hidden natural world. Choose a digital download
              for immediate use, or a museum-quality fine art print ready to
              frame.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <StaggerItem key={plan.name}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-3xl p-8 transition-shadow hover:shadow-2xl ${
                  plan.highlight
                    ? "border-2 border-accent-500 bg-dark-50/90 shadow-xl shadow-accent-500/10"
                    : "border border-dark-200 bg-dark-50/70 shadow-md"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent-500 to-accent-700 px-5 py-1.5 text-xs font-bold text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-dark-950 mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-dark-500">{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-dark-950">
                    {plan.price}
                  </span>
                  <span className="text-dark-500 ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-dark-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <motion.button
                  onClick={() => {
                    // Set the order details and scroll to contact
                    window.localStorage.setItem(
                      "upacers_order",
                      JSON.stringify({
                        subject: plan.orderSubject,
                        body: plan.orderBody,
                      })
                    );
                    document.getElementById("contact")?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full text-center rounded-xl px-6 py-4 text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "shimmer bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-lg shadow-accent-500/20"
                      : "border-2 border-dark-200 text-dark-700 hover:border-dark-300 hover:bg-dark-100"
                  }`}
                >
                  {plan.highlight ? "Order Now ⚡" : "Buy Now"}
                </motion.button>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Trust badges */}
        <ScrollReveal delay={0.3}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-dark-500">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-accent-400" />
              Free shipping worldwide
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-accent-400" />
              Secure payment
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-accent-400" />
              30-day returns
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function Footer() {
  const { site: SITE, social: SOCIAL, categories: CATEGORIES } = useContent();
  // Build social links dynamically — only show ones that have a URL
  const socialEntries = [
    { url: SOCIAL.facebook, label: "Facebook", Icon: FacebookIcon },
    { url: SOCIAL.email, label: "Email", Icon: Mail },
    { url: SOCIAL.website, label: "Website", Icon: ExternalLink },
  ].filter((s) => s.url && s.url.length > 0);

  return (
    <footer className="bg-dark-0/70 backdrop-blur-sm border-t border-dark-200 pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 shadow-lg shadow-accent-500/20 transition-transform group-hover:scale-110">
                <Camera
                  className="h-[18px] w-[18px] text-white"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-dark-950">
                {SITE.name.split(" ")[0]}
              </span>
            </a>
            <p className="max-w-xs text-sm leading-relaxed text-dark-500">
              Unveiling the extraordinary beauty of the microscopic world
              through handheld macro photography.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialEntries.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-200 text-dark-500 hover:bg-dark-300 hover:text-dark-800 transition-colors"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Gallery categories */}
          <div>
            <h4 className="text-sm font-semibold text-dark-800 mb-4">
              Gallery
            </h4>
            <ul className="space-y-3">
              {CATEGORIES.filter((c) => c !== "All").map((item) => (
                <li key={item}>
                  <a
                    href="#gallery"
                    className="text-sm text-dark-500 hover:text-dark-800 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-dark-800 mb-4">
              Navigate
            </h4>
            <ul className="space-y-3">
              {["Gallery", "About", "Contact", "Prints", "Workshops"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-dark-500 hover:text-dark-800 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-dark-800 mb-4">
              Newsletter
            </h4>
            <p className="text-sm text-dark-500 mb-3">
              Get notified about new work, print releases, and workshop dates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-xl border border-dark-300 bg-dark-100 px-3.5 py-2.5 text-sm text-dark-800 placeholder:text-dark-500 focus:border-accent-500 focus:outline-none transition-all"
              />
              <button className="shimmer rounded-xl bg-gradient-to-br from-accent-600 to-accent-800 px-4 py-2.5 text-sm font-semibold text-white">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-dark-200 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-dark-500">
            <a
              href="#"
              className="hover:text-dark-700 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-dark-700 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="hover:text-dark-700 transition-colors"
            >
              Licensing
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App (wraps everything in the content provider) ─── */
export default function App() {
  return (
    <ContentProvider>
      <SiteContent />
    </ContentProvider>
  );
}

function SiteContent() {
  // Global image protection: block right-click on any <img> and disable
  // drag globally as a safety net for any images not wrapped in ProtectedImage.
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        e.preventDefault();
        return false;
      }
    };

    // Block Ctrl+S / Cmd+S save-page shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="relative">
      {/* Fixed forest background — blends across ALL sections */}
      <div
        className="fixed inset-0 -z-10 overflow-hidden bg-dark-0"
        aria-hidden="true"
      >
        <img
          src="/forest-bg.jpg"
          alt=""
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-0/40 via-dark-0/25 to-dark-0/45" />
      </div>
      <Navbar />
      <Hero />
      <Gallery />
      <Shop />
      <About />
      <Contact />
      <Footer />
      <AdminPanel />
    </main>
  );
}
