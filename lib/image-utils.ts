
interface DisplayImageOptions {
  width?: number
  quality?: number
  /**
   * When true, free images also use the image proxy for resize/compression.
   * Watermark remains disabled for free products.
   */
  useProxyForFree?: boolean
}

/**
 * Helper to get the display URL for an image.
 * If the product is paid, it returns a proxy URL that serves a watermarked image.
 * Free products use the original URL by default, or the proxy (wm=0) when
 * `useProxyForFree` is enabled.
 */
export const getDisplayImageUrl = (
  originalUrl: string | undefined,
  isFree: boolean,
  options?: DisplayImageOptions
): string => {
  if (!originalUrl) return "/placeholder.jpg"

  const shouldUseProxy = !isFree || Boolean(options?.useProxyForFree)
  if (!shouldUseProxy) return originalUrl

  const params = new URLSearchParams({
    url: originalUrl,
    // Keep v=2 for cache-busting compatibility with previous behaviour.
    v: "2",
  })
  if (isFree) {
    // Free products should never be watermarked.
    params.set("wm", "0")
  }

  if (options?.width && Number.isFinite(options.width)) {
    params.set("w", String(Math.round(options.width)))
  }
  if (options?.quality && Number.isFinite(options.quality)) {
    params.set("q", String(Math.round(options.quality)))
  }

  return `/api/image-proxy?${params.toString()}`
}
