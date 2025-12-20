
/**
 * Helper to get the display URL for an image.
 * If the product is paid, it returns a proxy URL that serves a watermarked image.
 * If free, it returns the original URL.
 */
export const getDisplayImageUrl = (originalUrl: string | undefined, isFree: boolean): string => {
    if (!originalUrl) return "/placeholder.jpg";
    if (isFree) return originalUrl;

    // Return the proxy URL
    // We use encodeURIComponent to ensure the URL is safely passed
    // We add a cache-busting param (v=2) to force browsers to re-request the image
    // instead of using the cached non-watermarked version.
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}&v=2`;
};
