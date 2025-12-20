
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
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
};
