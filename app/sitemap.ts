import { MetadataRoute } from "next";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import { getSiteUrl } from "@/lib/seo";

/**
 * Dynamic sitemap that auto-updates when products change
 * Uses revalidation tags to update when products/categories are modified
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const currentDate = new Date().toISOString();

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/home`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Fetch all categories
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategories();
    categoryPages = categories.map((category) => ({
      url: `${siteUrl}/category/${category.id}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error fetching categories for sitemap:", error);
  }

  // Fetch products with limits to prevent build timeouts
  // Only include most recent products in sitemap for SEO
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const MAX_PAGES = 10; // Limit to 10 pages max (1000 products with limit 100)
    const MAX_PRODUCTS = 1000; // Hard limit on total products to prevent timeout
    const limit = 100; // Fetch in batches of 100
    
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages && page <= MAX_PAGES && productPages.length < MAX_PRODUCTS) {
      const response = await getProducts({
        page,
        limit,
      });

      if (!response.products || response.products.length === 0) {
        break;
      }

      const products = response.products.map((product) => ({
        url: `${siteUrl}/products/${product.id}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

      productPages = [...productPages, ...products];

      // Check if there are more pages and we haven't hit our limits
      hasMorePages = page < response.pageCount && productPages.length < MAX_PRODUCTS;
      page++;
    }
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // Continue with whatever products we've fetched so far
  }

  // Combine all pages
  return [...staticPages, ...categoryPages, ...productPages];
}

// Revalidate sitemap when products or categories change
// The sitemap will automatically update when products/categories are revalidated
// via their cache tags ('products', 'categories')
export const revalidate = 3600; // Revalidate every hour as fallback

