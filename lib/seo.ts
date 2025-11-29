import { Metadata } from "next";

export function getSiteUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  return process.env.NODE_ENV === "production"
    ? "https://brandexme.com"
    : "http://localhost:3000";
}

function generateProductDescription(
  product: {
    name: string;
    description?: string;
    category?: { name: string };
    price?: string;
    keywords?: string[];
  }
): string {
  if (product.description && product.description.length > 0) {
    const baseDesc = product.description.trim();
    if (baseDesc.length >= 100 && baseDesc.length <= 140) {
      return `${baseDesc} Download now at Brandex!`;
    }
    if (baseDesc.length > 140) {
      return `${baseDesc.slice(0, 135)}... Shop now!`;
    }

    const categoryText = product.category ? ` ${product.category.name}` : "";
    const enhanced = `${baseDesc}${categoryText ? ` - Premium ${categoryText.toLowerCase()} mockup` : " - Premium design resource"}. Download instantly!`;
    return enhanced.length > 160 ? enhanced.slice(0, 157) + "..." : enhanced;
  }

  const categoryText = product.category ? ` ${product.category.name}` : "";
  const priceText = product.price ? ` Starting at $${product.price}` : "";
  const keywords = product.keywords?.slice(0, 2).join(", ") || "premium design";
  
  const parts = [
    `${product.name}${categoryText ? ` - Premium ${categoryText.toLowerCase()}` : ""} mockup`,
    keywords,
    "PSD files",
    priceText,
    "Download now!"
  ].filter(Boolean);

  let description = parts.join(". ");
  
  if (description.length < 150) {
    description = `${description} Instant download at Brandex - professional design resources for designers and marketers.`;
  }
  
  if (description.length > 160) {
    description = description.slice(0, 157) + "...";
  }

  return description;
}

export function generateProductMetadata(
  product: {
    name: string;
    description?: string;
    price?: string;
    images?: Array<{ url: string }>;
    category?: { name: string };
    keywords?: string[];
  },
  productId: string
): Metadata {
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${productId}`;
  const productImage = product.images?.[0]?.url || `${siteUrl}/Logo.png`;
  const description = generateProductDescription(product);

  return {
    title: `${product.name} | Brandex`,
    description,
    keywords: product.keywords?.join(", ") || `${product.name}, ${product.category?.name || ""}, mockup, design, PSD, packaging design, brand assets`,
    openGraph: {
      title: product.name,
      description,
      url: productUrl,
      siteName: "Brandex",
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

function generateCategoryDescription(categoryName: string): string {
  const descriptions = [
    `Browse premium ${categoryName.toLowerCase()} mockups, packaging designs & PSD files at Brandex. Professional design resources for designers & marketers. Shop now!`,
    `Discover high-quality ${categoryName.toLowerCase()} mockups & design templates. Ready-made PSD files, packaging designs & brand assets. Download instantly!`,
    `Premium ${categoryName.toLowerCase()} design resources: mockups, PSD files & packaging templates. Professional quality for designers. Browse & download now!`,
  ];
  
  let description = descriptions[0];
  for (const desc of descriptions) {
    if (desc.length >= 150 && desc.length <= 160) {
      description = desc;
      break;
    }
  }
  
  if (description.length < 150) {
    description = `${description} Instant access to premium design assets.`;
  }
  if (description.length > 160) {
    description = description.slice(0, 157) + "...";
  }
  
  return description;
}

export function generateCategoryMetadata(
  category: {
    name: string;
    billboard?: { imageUrl?: string };
  },
  categoryId: string
): Metadata {
  const siteUrl = getSiteUrl();
  const categoryUrl = `${siteUrl}/category/${categoryId}`;
  const categoryImage = category.billboard?.imageUrl || `${siteUrl}/Logo.png`;
  const description = generateCategoryDescription(category.name);

  return {
    title: `${category.name} | Brandex`,
    description,
    keywords: `${category.name}, mockups, packaging design, PSD files, design templates, brand assets, premium designs`,
    openGraph: {
      title: `${category.name} | Brandex`,
      description,
      url: categoryUrl,
      siteName: "Brandex",
      images: [
        {
          url: categoryImage,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Brandex`,
      description,
      images: [categoryImage],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

export function generateHomeMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const defaultImage = `${siteUrl}/Logo.png`;
  const description = "Premium mockups, packaging designs & layered PSD files for designers & marketers. Professional quality, instant download. Shop now at Brandex!";

  return {
    title: "Brandex — Premium Mockups & Design Resources",
    description,
    keywords: "mockups, packaging design, PSD files, design resources, brand assets, premium designs, design templates, professional mockups",
    openGraph: {
      title: "Brandex — Premium Mockups & Design Resources",
      description,
      url: siteUrl,
      siteName: "Brandex",
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "Brandex",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Brandex — Premium Mockups & Design Resources",
      description,
      images: [defaultImage],
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

export function generateProductStructuredData(
  product: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    originalPrice?: string;
    images?: Array<{ url: string }>;
    category?: { name: string };
  },
  productId: string
) {
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${productId}`;
  const imageUrl = product.images?.[0]?.url || `${siteUrl}/Logo.png`;
  const price = product.price ? parseFloat(product.price) : undefined;
  const currency = "USD";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} from Brandex`,
    image: product.images?.map((img) => img.url) || [imageUrl],
    brand: {
      "@type": "Brand",
      name: "Brandex",
    },
    category: product.category?.name,
    offers: price
      ? {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: currency,
          price: price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Brandex",
          },
        }
      : undefined,
    url: productUrl,
  };
}

export function generateOrganizationStructuredData() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Brandex",
    url: siteUrl,
    logo: `${siteUrl}/Logo.png`,
    description:
      "Premium mockups, ready-made packaging designs, and layered PSD files crafted for designers, marketers, and brands.",
    sameAs: [
      // Add social media links if available
    ],
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Website JSON-LD structured data
 */
export function generateWebsiteStructuredData() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Brandex",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

