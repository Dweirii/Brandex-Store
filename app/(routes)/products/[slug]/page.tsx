import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import getProduct from "@/actions/get-product";
import getProductBySlug from "@/actions/get-product-by-slug";
import getProducts from "@/actions/get-products";
import { getRelatedProductsWithAI, getRelatedProductsFallback, scoreCandidate } from "@/lib/ai-recommender";
import type { Product } from "@/types";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Gift, ClipboardList, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/ui/container";
import { ProductBackButton } from "@/components/product-back-button";
import { ProductViewTracker } from "@/components/product-view-tracker";
import { ProductReviews } from "@/components/product-reviews";
import {
  generateProductMetadata,
  generateProductStructuredData,
  generateBreadcrumbStructuredData,
  getSiteUrl,
} from "@/lib/seo";
import { ProductBreadcrumb } from "@/components/product-breadcrumb";
import { CATEGORY_SLUG_MAP } from "@/lib/category-slugs";

const Gallery = dynamic(() => import("@/components/gallery"), {
  loading: () => (
    <div className="w-full overflow-hidden bg-background shadow-md border border-border rounded-xl">
      <div className="relative aspect-4/3 w-full">
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      </div>
    </div>
  ),
  ssr: true,
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Resolve a route param that may be a UUID (old links) or a slug (new links). */
async function resolveProduct(param: string): Promise<{ product: Product; canonical: string } | null> {
  if (UUID_RE.test(param)) {
    // Old UUID-based URL — fetch by ID and redirect to the slug URL
    const product = await getProduct(param);
    if (!product) return null;
    const canonical = product.slug ?? param;
    return { product, canonical };
  }
  // New slug-based URL
  const product = await getProductBySlug(param);
  if (!product) return null;
  return { product, canonical: param };
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const resolved = await resolveProduct(slug);
    if (!resolved) {
      return {
        title: "Product Not Found | Brandex",
        description: "The requested product could not be found.",
      };
    }
    return generateProductMetadata(resolved.product, resolved.canonical);
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Product Details | Brandex",
      description: "Explore details about this product.",
    };
  }
}

function ProductDetails() {
  const whatsIncluded = [
    "1 High-resolution PSD mockup",
    "Smart Object layers for easy editing",
    "Organized Photoshop layers",
    "Front + back label layouts",
    "Help guide included",
  ];

  const specifications = [
    { label: "Application", value: "Adobe Photoshop" },
    { label: "File Type", value: "PSD" },
    { label: "Resolution", value: "4500 × 3000 px" },
    { label: "DPI", value: "300" },
    { label: "Color Space", value: "RGB" },
    { label: "Layered", value: "Yes" },
  ];

  const howItWorks = [
    "Open the PSD in Photoshop",
    "Double-click the Smart Object layer",
    "Paste your design",
    "Save and export your mockup",
  ];

  return (
    <div className="mt-5 border border-[#E5E7EB] dark:border-border rounded-xl overflow-hidden bg-card">
      <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] dark:divide-border">
        {/* What's Included */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              What&apos;s Included
            </h3>
          </div>
          <ul className="space-y-1.5">
            {whatsIncluded.map((item) => (
              <li key={item} className="text-xs text-muted-foreground leading-snug">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              Specifications
            </h3>
          </div>
          <ul className="space-y-1.5">
            {specifications.map(({ label, value }) => (
              <li key={label} className="text-xs text-muted-foreground leading-snug">
                <span className="font-medium text-foreground/70">{label}:</span>{" "}
                {value}
              </li>
            ))}
          </ul>
        </div>

        {/* How It Works */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wide">
              How It Works
            </h3>
          </div>
          <ol className="space-y-1.5 list-decimal list-inside">
            {howItWorks.map((step) => (
              <li key={step} className="text-xs text-muted-foreground leading-snug">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

async function RelatedProducts({ currentProduct }: { currentProduct: Product }) {
  const categoryId = currentProduct.category?.id;

  // Build a rich candidate pool: same-category neighbors + store-wide keyword matches
  const [{ products: categoryProducts }, { products: storeProducts }] = await Promise.all([
    categoryId ? getProducts({ categoryId, limit: 60 }) : Promise.resolve({ products: [] }),
    getProducts({ limit: 120 }),
  ]);

  // Merge and deduplicate — category products first (stronger contextual signal)
  const seen = new Set<string>([currentProduct.id]);
  const candidates: Product[] = [];
  for (const p of [...categoryProducts, ...storeProducts]) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      candidates.push(p);
    }
  }

  if (candidates.length === 0) return null;

  // Pre-score every candidate using multi-signal scoring
  const scoreMap = new Map<string, number>(
    candidates.map((c) => [c.id, scoreCandidate(currentProduct, c)])
  );

  // Sort by score descending — top 30 go to AI for semantic re-ranking
  const sortedCandidates = [...candidates].sort(
    (a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0)
  );
  const aiPool = sortedCandidates.slice(0, 30);

  let relatedItems: Product[] = [];

  // Try AI semantic re-ranking
  const aiRecommendedIds = await getRelatedProductsWithAI(currentProduct, aiPool, scoreMap);

  if (aiRecommendedIds.length > 0) {
    relatedItems = aiRecommendedIds
      .map((id) => candidates.find((c) => c.id === id))
      .filter((p): p is Product => !!p)
      .slice(0, 4);
  }

  // Fallback: pure scoring
  if (relatedItems.length === 0) {
    relatedItems = getRelatedProductsFallback(currentProduct, sortedCandidates);
  }

  if (relatedItems.length === 0) return null;

  return (
    <div>
      <Container>
        <div className="px-4 py-12 sm:px-6 lg:px-8 border-t border-[#E5E7EB] dark:border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Related Mockups</h2>
          <ProductList
            title=""
            items={relatedItems}
            total={relatedItems.length}
            page={1}
            pageCount={1}
            variant="related"
          />
        </div>
      </Container>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    const resolved = await resolveProduct(slug);

    if (!resolved) throw new Error("Product not found");

    const { product, canonical } = resolved;

    // Redirect old UUID-based URLs to their slug URL
    if (UUID_RE.test(slug) && canonical !== slug) {
      redirect(`/products/${canonical}`);
    }

    const siteUrl = getSiteUrl();
    const productUrl = `${siteUrl}/products/${canonical}`;
    const productStructuredData = generateProductStructuredData(product, canonical);
    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: "Home", url: siteUrl },
      {
        name: product.category?.name || "Products",
        url: product.category?.id
          ? `${siteUrl}/category/${CATEGORY_SLUG_MAP[product.category.id] ?? product.category.id}`
          : `${siteUrl}/`,
      },
      { name: product.name, url: productUrl },
    ]);

    return (
      <div className="bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
        />

        <Container>
          <ProductViewTracker product={product} />
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <ProductBackButton />
            <ProductBreadcrumb
              category={product.category}
              subcategory={product.subcategory}
              productName={product.name}
            />
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
              {/* Left column: Gallery + details sections */}
              <div className="w-full">
                {product.videoUrl || product.images?.length > 0 ? (
                  <Suspense
                    fallback={
                      <div className="w-full overflow-hidden bg-background shadow-md border border-border rounded-xl">
                        <div className="relative aspect-4/3 w-full">
                          <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
                        </div>
                      </div>
                    }
                  >
                    <Gallery data={product} />
                  </Suspense>
                ) : (
                  <div className="h-96 bg-muted/10 flex items-center justify-center rounded-xl">
                    <p className="text-muted-foreground">No media available</p>
                  </div>
                )}
                {/* What's Included / Specifications / How It Works */}
                <ProductDetails />
              </div>

              {/* Right column: Product Info */}
              <div className="mt-10 lg:mt-0">
                <Info data={product} />
              </div>
            </div>
          </div>
        </Container>

        {/* Reviews Section — hidden for now */}
        {false && (
          <div className="mt-8 border-t">
            <Container>
              <div className="px-4 py-12 sm:px-6 lg:px-8">
                <ProductReviews productId={product.id} />
              </div>
            </Container>
          </div>
        )}

        {/* Related Products — wrapper lives inside RelatedProducts so nothing renders when empty */}
        <Suspense
          fallback={
            <div>
              <Container>
                <div className="px-4 py-12 sm:px-6 lg:px-8 border-t border-[#E5E7EB] dark:border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-96 rounded-lg" />
                    ))}
                  </div>
                </div>
              </Container>
            </div>
          }
        >
          <RelatedProducts currentProduct={product} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    return (
      <div className="px-4 py-10">
        <Alert variant="destructive" className="bg-destructive text-destructive-foreground border-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading this product. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
}
