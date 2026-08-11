import { useState, useRef, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Settings,
  Upload,
  Trash2,
  Plus,
  Image as ImageIcon,
  RotateCcw,
  Camera,
  User,
  Sparkles,
  FolderOpen,
  Check,
  ChevronDown,
} from "lucide-react";
import { useContent, compressImage, type PortfolioImage } from "./content";

/* ─── Small reusable field components ─── */
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-dark-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-dark-300 bg-dark-50 px-3.5 py-2.5 text-sm text-dark-900 placeholder:text-dark-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-dark-600">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg border border-dark-300 bg-dark-50 px-3.5 py-2.5 text-sm text-dark-900 placeholder:text-dark-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all resize-none"
      />
    </label>
  );
}

/* ─── Image upload button ─── */
function ImageUpload({
  currentImage,
  onUpload,
  label,
  maxWidth = 1600,
}: {
  currentImage?: string;
  onUpload: (dataUrl: string) => void;
  label: string;
  maxWidth?: number;
}) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file, maxWidth, 0.82);
      onUpload(compressed);
    } catch {
      alert("Could not process that image. Try a different one.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {currentImage && (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-dark-300 bg-dark-100">
          <img
            src={currentImage}
            alt="preview"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-accent-500/40 bg-accent-500/10 px-4 py-2.5 text-sm font-semibold text-accent-300 hover:bg-accent-500/20 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <RotateCcw className="h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> {label}
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: React.ElementType;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dark-200 bg-dark-100/60 p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15 text-accent-400">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-dark-900">{title}</h3>
          {desc && <p className="text-xs text-dark-500">{desc}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ─── Main Admin Panel ─── */
export default function AdminPanel() {
  const {
    site,
    heroBgImage,
    about,
    social,
    categories,
    portfolioImages,
    update,
    addImage,
    updateImage,
    deleteImage,
    resetAll,
  } = useContent();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"content" | "photos">("photos");
  const [savedFlash, setSavedFlash] = useState(false);

  // Tabs are: Photos (gallery management) and Content (text/brand)

  const handleAddPhoto = () => {
    const newImg: PortfolioImage = {
      id: `photo-${Date.now()}`,
      src: "",
      srcFull: "",
      title: "Untitled Photo",
      category: categories[1] || "Insects",
      tags: [],
      description: "",
      gear: "",
      location: "",
    };
    addImage(newImg);
  };

  // Flash "Saved" indicator on any change
  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Edit your website"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 text-white shadow-2xl shadow-accent-600/40 transition-all hover:scale-110 hover:shadow-accent-600/50 group"
      >
        <Settings className="h-6 w-6 transition-transform duration-500 group-hover:rotate-90" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex"
          >
            {/* Backdrop */}
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-dark-0 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-dark-200 px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-700">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-dark-900">
                      Website Editor
                    </h2>
                    <p className="text-xs text-dark-500">
                      Changes save automatically
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {savedFlash && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1 text-xs font-semibold text-green-400"
                      >
                        <Check className="h-3.5 w-3.5" /> Saved
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 hover:bg-dark-100 hover:text-dark-900 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-dark-200 px-6 pt-3">
                {[
                  { id: "photos" as const, label: "Photos", icon: ImageIcon },
                  { id: "content" as const, label: "Text & Profile", icon: User },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                      tab === t.id
                        ? "border-accent-500 text-accent-400"
                        : "border-transparent text-dark-500 hover:text-dark-800"
                    }`}
                  >
                    <t.icon className="h-4 w-4" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Scrollable body */}
              <div className="flex-1 space-y-5 overflow-y-auto p-6">
                {tab === "photos" && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-dark-500">
                        {portfolioImages.length} photos in your gallery
                      </p>
                      <button
                        onClick={handleAddPhoto}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-accent-600 to-accent-800 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent-600/20"
                      >
                        <Plus className="h-4 w-4" /> Add Photo
                      </button>
                    </div>

                    {portfolioImages.map((img) => (
                      <PhotoEditor
                        key={img.id}
                        image={img}
                        categories={categories}
                        onChange={(partial) => {
                          updateImage(img.id, partial);
                          flashSaved();
                        }}
                        onDelete={() => deleteImage(img.id)}
                      />
                    ))}

                    {portfolioImages.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-dark-300 py-12 text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-dark-400 mb-2" />
                        <p className="text-sm text-dark-500">
                          No photos yet. Click "Add Photo" to upload your first.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {tab === "content" && (
                  <>
                    {/* Brand & headline */}
                    <Section
                      icon={Sparkles}
                      title="Brand & Headline"
                      desc="Your name and the big title on the homepage"
                    >
                      <Field
                        label="Brand Name"
                        value={site.name}
                        onChange={(v) => {
                          update({ site: { ...site, name: v } });
                          flashSaved();
                        }}
                        placeholder="Upacers Photography"
                      />
                      <Field
                        label="Hero Tagline"
                        value={site.tagline}
                        onChange={(v) => {
                          update({ site: { ...site, tagline: v } });
                          flashSaved();
                        }}
                        placeholder="Unseen Tiny Worlds"
                      />
                      <TextArea
                        label="Homepage Description"
                        value={site.heroDescription}
                        onChange={(v) => {
                          update({ site: { ...site, heroDescription: v } });
                          flashSaved();
                        }}
                        rows={3}
                      />
                    </Section>

                    {/* Hero background */}
                    <Section
                      icon={Camera}
                      title="Homepage Background Photo"
                      desc="The big photo behind your headline"
                    >
                      <ImageUpload
                        currentImage={heroBgImage}
                        label="Upload Background"
                        onUpload={(url) => {
                          update({ heroBgImage: url });
                          flashSaved();
                        }}
                      />
                    </Section>

                    {/* Profile / About */}
                    <Section
                      icon={User}
                      title="Your Profile Photo"
                      desc="Shown in the About section"
                    >
                      <ImageUpload
                        currentImage={about.photo}
                        label="Upload Profile Photo"
                        onUpload={(url) => {
                          update({ about: { ...about, photo: url } });
                          flashSaved();
                        }}
                      />
                      <Field
                        label="Specialty"
                        value={about.specialty}
                        onChange={(v) => {
                          update({ about: { ...about, specialty: v } });
                          flashSaved();
                        }}
                      />
                    </Section>

                    {/* Bio paragraphs */}
                    <Section
                      icon={FolderOpen}
                      title="Your Bio / Story"
                      desc="Each box is a paragraph in your About section"
                    >
                      {about.paragraphs.map((p, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-dark-600">
                              Paragraph {i + 1}
                            </span>
                            {about.paragraphs.length > 1 && (
                              <button
                                onClick={() => {
                                  const next = about.paragraphs.filter(
                                    (_, idx) => idx !== i
                                  );
                                  update({ about: { ...about, paragraphs: next } });
                                  flashSaved();
                                }}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <textarea
                            value={p.replace(/<[^>]+>/g, "")}
                            onChange={(e) => {
                              const next = [...about.paragraphs];
                              next[i] = e.target.value;
                              update({ about: { ...about, paragraphs: next } });
                              flashSaved();
                            }}
                            rows={3}
                            className="w-full rounded-lg border border-dark-300 bg-dark-50 px-3.5 py-2.5 text-sm text-dark-900 placeholder:text-dark-400 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all resize-none"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          update({
                            about: {
                              ...about,
                              paragraphs: [...about.paragraphs, ""],
                            },
                          });
                          flashSaved();
                        }}
                        className="flex items-center gap-1.5 text-sm font-semibold text-accent-400 hover:text-accent-300"
                      >
                        <Plus className="h-4 w-4" /> Add paragraph
                      </button>
                    </Section>

                    {/* Quote */}
                    <Section icon={Sparkles} title="Your Quote">
                      <TextArea
                        label="Quote text"
                        value={about.quote}
                        onChange={(v) => {
                          update({ about: { ...about, quote: v } });
                          flashSaved();
                        }}
                        rows={2}
                      />
                    </Section>

                    {/* Contact */}
                    <Section
                      icon={Camera}
                      title="Contact & Social Links"
                      desc="Where people can reach you"
                    >
                      <Field
                        label="Contact Email"
                        value={site.email}
                        onChange={(v) => {
                          update({ site: { ...site, email: v } });
                          flashSaved();
                        }}
                        placeholder="you@email.com"
                      />
                      <Field
                        label="Facebook URL"
                        value={social.facebook}
                        onChange={(v) => {
                          update({ social: { ...social, facebook: v } });
                          flashSaved();
                        }}
                        placeholder="https://facebook.com/..."
                      />
                      <Field
                        label="Website URL"
                        value={social.website}
                        onChange={(v) => {
                          update({ social: { ...social, website: v } });
                          flashSaved();
                        }}
                        placeholder="https://..."
                      />
                    </Section>

                    {/* Reset */}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Reset everything back to the original demo content? This cannot be undone."
                            )
                          ) {
                            resetAll();
                            flashSaved();
                          }
                        }}
                        className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <RotateCcw className="h-4 w-4" /> Reset to original
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Footer note */}
              <div className="border-t border-dark-200 px-6 py-3">
                <p className="text-center text-xs text-dark-500">
                  ✨ Done editing? Click the ✕ to view your live site. Your
                  changes are saved on this device.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Single photo editor card ─── */
function PhotoEditor({
  image,
  categories,
  onChange,
  onDelete,
}: {
  image: PortfolioImage;
  categories: string[];
  onChange: (partial: Partial<PortfolioImage>) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(!image.src);

  return (
    <div className="rounded-2xl border border-dark-200 bg-dark-100/60 overflow-hidden">
      <div className="flex items-center gap-3 p-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-dark-300 bg-dark-200">
          {image.src ? (
            <img
              src={image.src}
              alt={image.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-5 w-5 text-dark-500" />
            </div>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex flex-1 items-center justify-between text-left"
        >
          <span className="text-sm font-semibold text-dark-900">
            {image.title || "Untitled Photo"}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-dark-500 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this photo?")) onDelete();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          aria-label="Delete photo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-dark-200 p-4">
              <ImageUpload
                currentImage={image.src}
                label="Upload Photo"
                maxWidth={1400}
                onUpload={(url) => {
                  onChange({ src: url, srcFull: url });
                }}
              />

              <Field
                label="Title"
                value={image.title}
                onChange={(v) => onChange({ title: v })}
                placeholder="Emerald Damselfly"
              />

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-dark-600">
                  Category
                </span>
                <select
                  value={image.category}
                  onChange={(e) => onChange({ category: e.target.value })}
                  className="w-full rounded-lg border border-dark-300 bg-dark-50 px-3.5 py-2.5 text-sm text-dark-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 transition-all"
                >
                  {categories
                    .filter((c) => c !== "All")
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </label>

              <TextArea
                label="Description"
                value={image.description}
                onChange={(v) => onChange({ description: v })}
                rows={2}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Gear"
                  value={image.gear}
                  onChange={(v) => onChange({ gear: v })}
                  placeholder="Camera + Lens"
                />
                <Field
                  label="Location"
                  value={image.location}
                  onChange={(v) => onChange({ location: v })}
                  placeholder="City, Country"
                />
              </div>

              <Field
                label="Tags (comma separated)"
                value={image.tags.join(", ")}
                onChange={(v) =>
                  onChange({
                    tags: v
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="macro, insect, dew"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
