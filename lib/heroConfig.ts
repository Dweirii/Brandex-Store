// Hero configuration for all category pages.
// Replace placeholder image URLs with real CDN paths before deploying.

export type HeroIconKey = "download" | "zap" | "shield" | "star" | "package" | "layers" | "check" | "sparkles"

export interface HeroIconItem {
  icon: HeroIconKey
  label: string
}

export interface HeroConfig {
  headline: string
  /** Optional accent lines rendered beneath the headline */
  supportingLines?: string[]
  subhead: string
  primaryCTA: { label: string; href: string }
  secondaryCTA: { label: string; href: string }
  /** Pass 2–4 image URLs; the collage auto-adapts to the count */
  images: string[]
  /** Optional icon + label pairs shown below the CTAs (e.g. HOME page) */
  iconRow?: HeroIconItem[]
  /**
   * Controls how thumbnails are rendered in hero tiles.
   * "cover"   – object-cover, fills the frame (default; best for photos/mockups)
   * "contain" – object-contain with padding + border + shadow (best for vector/line art on transparent backgrounds)
   */
  tileStyle?: "cover" | "contain"
}

export type HeroPageKey =
  | "home"
  | "packaging"
  | "mockup-studio"
  | "images"
  | "vectors"
  | "psd-lab"
  | "motion-library"

export const heroConfigs: Record<HeroPageKey, HeroConfig> = {
  home: {
    headline: "Premium creative assets. Built to impress.",
    subhead:
      "Mockups, vectors, photos, packaging, and motion—ready for real projects and real deadlines.",
    primaryCTA: { label: "Browse Assets", href: "/" },
    secondaryCTA: { label: "View Pricing", href: "/credits" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/home-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/home-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/home-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/home-4.jpg",
    ],
    iconRow: [
      { icon: "download", label: "Instant download" },
      { icon: "layers", label: "Layered PSD" },
      { icon: "sparkles", label: "Commercial license" },
    ],
  },

  packaging: {
    headline: "Production-ready packaging systems for modern brands.",
    subhead:
      "Print-ready packaging assets with dielines, structured layouts, and fully editable files—built for real-world production and fast approvals.",
    primaryCTA: { label: "Browse Packaging", href: "/category/packaging" },
    secondaryCTA: { label: "View Newest", href: "/category/packaging?sortBy=newest" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/packaging-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/packaging-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/packaging-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/packaging-4.jpg",
    ],
    iconRow: [
      { icon: "package", label: "Print-ready templates" },
      { icon: "check", label: "Production-ready" },
      { icon: "sparkles", label: "Commercial license" },
    ],
  },

  "mockup-studio": {
    headline: "Premium mockups that present like a pro.",
    subhead:
      "Realistic scenes with smart-object workflows—drop in artwork, fine-tune lighting, and export client-ready visuals in minutes.",
    primaryCTA: { label: "Browse Mockups", href: "/category/mockups" },
    secondaryCTA: { label: "View Newest", href: "/category/mockups?sortBy=newest" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/mockup-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/mockup-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/mockup-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/mockup-4.jpg",
    ],
    iconRow: [
      { icon: "layers", label: "Layered PSD" },
      { icon: "zap", label: "Smart objects" },
      { icon: "sparkles", label: "Client-ready" },
    ],
  },

  // "images" is also the default landing for /category/graphics (no type selected),
  // so the headline and iconRow reflect the full Graphics group offering.
  images: {
    headline: "Premium graphics for brand-first campaigns.",
    subhead:
      "Curated images, vectors, and PSDs built for landing pages, ads, and product storytelling—clean, modern, and ready to use.",
    primaryCTA: { label: "Browse Graphics", href: "/category/graphics" },
    secondaryCTA: { label: "View Newest", href: "/category/graphics?sortBy=newest" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/images-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/images-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/images-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/images-4.jpg",
    ],
    iconRow: [
      { icon: "layers", label: "Images + vectors + PSD" },
      { icon: "download", label: "Instant download" },
      { icon: "sparkles", label: "Commercial license" },
    ],
  },

  vectors: {
    headline: "Vectors built for clean, scalable branding.",
    subhead:
      "Editable vector assets for packaging, labels, icons, and layouts—structured for consistency and fast production work.",
    primaryCTA: { label: "Browse Vectors", href: "/category/vectors" },
    secondaryCTA: { label: "View Newest", href: "/category/vectors?sortBy=newest" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/vectors-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/vectors-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/vectors-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/vectors-4.jpg",
    ],
    tileStyle: "contain",
    iconRow: [
      { icon: "layers", label: "Scalable vectors" },
      { icon: "zap", label: "Editable colors" },
      { icon: "sparkles", label: "Commercial license" },
    ],
  },

  "psd-lab": {
    headline: "Advanced PSDs built for control.",
    subhead:
      "Fully layered files with precision smart objects and production-structured organization—made for real-world production.",
    primaryCTA: { label: "Browse PSD Lab", href: "/category/psd-lab" },
    secondaryCTA: { label: "View Newest", href: "/category/psd-lab?sortBy=newest" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/psd-lab-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/psd-lab-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/psd-lab-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/psd-lab-4.jpg",
    ],
    iconRow: [
      { icon: "layers", label: "Layered PSD" },
      { icon: "zap", label: "Smart objects" },
      { icon: "sparkles", label: "Client-ready" },
    ],
  },

  "motion-library": {
    headline: "Motion assets that elevate your brand.",
    subhead:
      "High-resolution motion elements designed for modern creative—clean, flexible, and ready to drop into edits.",
    primaryCTA: { label: "Browse Motion", href: "/category/motion" },
    secondaryCTA: { label: "View Newest", href: "/category/motion?sortBy=newest" },
    images: [
      "https://Brandex-cdn.b-cdn.net/hero/motion-1.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/motion-2.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/motion-3.jpg",
      "https://Brandex-cdn.b-cdn.net/hero/motion-4.jpg",
    ],
    iconRow: [
      { icon: "download", label: "Motion assets" },
      { icon: "zap", label: "Instant download" },
      { icon: "sparkles", label: "Commercial license" },
    ],
  },
}

// Keyed by the real category UUIDs from the database (see category-nav.tsx).
// This is the preferred lookup — name-based matching is unreliable if names change.
const CATEGORY_ID_MAP: Partial<Record<string, HeroPageKey>> = {
  "fd995552-baa8-4b86-bf7e-0acbefd43fd6": "packaging",
  "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a": "mockup-studio",
  "6214c586-a7c7-4f71-98ab-e1bc147a07f4": "images",
  "b0469986-6cb9-4a35-8cd6-6cc9ec51a561": "vectors",
  "1364f5f9-6f45-48fd-8cd1-09815e1606c0": "psd-lab",
  "c302954a-6cd2-43a7-9916-16d9252f754c": "motion-library",
}

/**
 * Resolve a hero config from a category UUID.
 * Returns null for categories with no hero (e.g. "Signature Services", "Free").
 */
export function getHeroConfigById(categoryId: string): HeroConfig | null {
  const key = CATEGORY_ID_MAP[categoryId]
  return key ? heroConfigs[key] : null
}

/**
 * Fallback: resolve by category name/slug when the ID is unavailable.
 */
export function getHeroConfigBySlug(slug: string): HeroConfig | null {
  const normalized = slug.toLowerCase().trim().replace(/\s+/g, "-")

  const slugMap: Partial<Record<string, HeroPageKey>> = {
    packaging: "packaging",
    mockups: "mockup-studio",
    "mockup-studio": "mockup-studio",
    images: "images",
    vectors: "vectors",
    "psd-lab": "psd-lab",
    motion: "motion-library",
    "motion-library": "motion-library",
    home: "home",
  }

  const key = slugMap[normalized]
  return key ? heroConfigs[key] : null
}
