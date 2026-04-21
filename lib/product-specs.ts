export const CAT_MOCKUP    = "960cb6f5-8dc1-48cf-900f-aa60dd8ac66a"
export const CAT_IMAGES    = "6214c586-a7c7-4f71-98ab-e1bc147a07f4"
export const CAT_VECTORS   = "b0469986-6cb9-4a35-8cd6-6cc9ec51a561"
export const CAT_PACKAGING = "fd995552-baa8-4b86-bf7e-0acbefd43fd6"
export const CAT_PSD       = "1364f5f9-6f45-48fd-8cd1-09815e1606c0"
export const CAT_VIDEO     = "c302954a-6cd2-43a7-9916-16d9252f754c"

const DIMENSIONS: Record<string, string> = {
  [CAT_MOCKUP]:    "4500 × 3000 px",
  [CAT_PACKAGING]: "4500 × 3000 px",
  [CAT_PSD]:       "4500 × 3000 px",
  [CAT_IMAGES]:    "High-resolution",
  [CAT_VECTORS]:   "Scalable vector",
  [CAT_VIDEO]:     "1080p / 4K",
}

export function getProductDimensions(categoryId: string | undefined): string | null {
  if (!categoryId) return null
  return DIMENSIONS[categoryId] ?? null
}
