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
  /** Pool of tall images (for row-span-2 slots); 2 picked randomly per load */
  tallImages?: string[]
  /** Pool of square images (for single-row slots); 2 picked randomly per load */
  squareImages?: string[]
  /** Optional icon + label pairs shown below the CTAs */
  iconRow?: HeroIconItem[]
  /** Optional dot-separated trust line shown below the icon row */
  trustLine?: string
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
    headline: "Real assets. Real deadlines. Real results.",
    subhead:
      "Premium mockups, packaging, vectors, photos, and motion—crafted and ready to use today. Stop searching. Start creating.",
    primaryCTA: { label: "Browse Assets", href: "/products" },
    secondaryCTA: { label: "See Pricing", href: "/credits" },
    images: [],
    tallImages: [
      // Mockups
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Cans%203D%20Mockup%207.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Paper%20Bag%20Mockup2.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Shika%20breath%20freshener%20Packaging.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Jam%20Jar%20Mockup%201140194562.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Water%20Sport%20Cup%20Mockup%201140194593.jpeg",
      // Packaging
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Pizza%20Packaging%201140194612.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Shaving%20Machine%20Packaging%201140194603.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Proten%20Carbonated%20Drink%20Packaging%20Large.jpeg",
      // Photos
      "https://Brandex-cdn.b-cdn.net/Heros/pho/9537fb8e723747539ee577ccbfbbaaf8.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/9c1af39880254a84a4c37920604fa853.jpg",
    ],
    squareImages: [
      // Mockups
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Billboard%20Mockup1140194687.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Cosmetic%20Container%20Mockup365792114524.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20I%20Phone%2017%20Pro%20Mockup%2014019471.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/mockup4.jpeg",
      // Packaging
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Dark%20Chocolate%20With%20Hazelnut%20Bar%20Packaging%201140194668.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Sereal%20Packaging%201140194532.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Natural%20Drink%20Packaging%20Large.jpeg",
      // Photos
      "https://Brandex-cdn.b-cdn.net/Heros/pho/a-delightful-depiction-of-a-plate-of-golden-brown-.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/chicken-with-creamy-dijon-sauce-and-mashed-potatoe.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/chinese-chicken-on-a-stick-.jpg",
    ],
    iconRow: [
      { icon: "download", label: "Instant download" },
      { icon: "layers", label: "Layered PSD" },
      { icon: "sparkles", label: "Commercial license" },
    ],
    trustLine: "Ready to use • Easy to customize • Commercial-ready",
  },

  packaging: {
    headline: "Production-ready packaging systems for modern brands.",
    subhead:
      "Print-ready packaging assets with dielines, structured layouts, and fully editable files—built for real-world production and fast approvals.",
    primaryCTA: { label: "Browse Packaging", href: "/category/packaging" },
    secondaryCTA: { label: "View Newest", href: "/category/packaging?sortBy=newest" },
    images: [],
    tallImages: [
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Pizza%20Packaging%201140194612.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Shaving%20Machine%20Packaging%201140194603.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Proten%20Carbonated%20Drink%20Packaging%20Large.jpeg",
    ],
    squareImages: [
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Butter%20Cookies%20Bag%20Packaging%201140194590.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Dark%20Chocolate%20With%20Hazelnut%20Bar%20Packaging%201140194668.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Dark%20Chocolate%20With%20Pistachios%20Bar%20Packaging%201140194667.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Brandex%20Sereal%20Packaging%201140194532.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Metallic_Juice_Box_Mockup-2.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Natural%20Drink%20Packaging%20Large.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Nutcracker%20Brew%20Packaging%20Large.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/pack/Paper%20Packaging%20Mockup%202%20Large.jpeg",
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
    images: [],
    tallImages: [
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Cans%203D%20Mockup%207.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Paper%20Bag%20Mockup2.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Shika%20breath%20freshener%20Packaging.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Latterhead%20Mockup1140194690.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Carbonated%20Can%20330ml%20Sleek%20Design%20Mockup%201140194677.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Jam%20Jar%20Mockup%201140194562.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Fluz%20orange%20Juice%201%20Liter%20Box%20Mockup.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Water%20Sport%20Cup%20Mockup%201140194593.jpeg",
    ],
    squareImages: [
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Billboard%20Mockup1140194687.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Carbonated%20Can%20250ml%20Sleek%20Design%20Mockup%201140194674.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Cosmetic%20Container%20Mockup365792114524.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Door%20Hanging%20Mockup682480034.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20Drink%20Bottle%20Mockup05795621279.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20I%20Phone%2017%20Pro%20Mockup%2014019471.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Brandex%20I%20Phone%20Mockup%201140194682.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/hhhhhs45d4d5296.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Laptop%20Computer%20Mockup1140194571.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/mockup4.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Moto%20Gum%20Packaging%20poster.jpeg",
      "https://Brandex-cdn.b-cdn.net/Heros/mok/Poster%20Reakoffs%20Gum%20Packaging.jpeg",
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
    images: [],
    tallImages: [
      "https://Brandex-cdn.b-cdn.net/Heros/pho/9537fb8e723747539ee577ccbfbbaaf8.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/9c1af39880254a84a4c37920604fa853.jpg",
    ],
    squareImages: [
      "https://Brandex-cdn.b-cdn.net/Heros/pho/a-delightful-depiction-of-a-plate-of-golden-brown-.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/a-delightful-depiction-of-a-plate-of-spaghetti-wit.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/an-inviting-depiction-of-a-bowl-of-hearty-vegetabl.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/an-inviting-illustration-of-a-platter-of-tacos--fi.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/chicken-with-creamy-dijon-sauce-and-mashed-potatoe.jpg",
      "https://Brandex-cdn.b-cdn.net/Heros/pho/chinese-chicken-on-a-stick-.jpg",
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
