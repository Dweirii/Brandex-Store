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
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/ui/container";
import { ProductBackButton } from "@/components/product-back-button";
import { ProductViewCounter } from "@/components/product-view-counter";
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
      <div className="relative aspect-[4/3] w-full">
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
    <div className="border-t">
      <Container>
        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <ProductList
            title="You May Also Like"
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
              {/* Gallery */}
              <div className="w-full">
                {product.videoUrl || product.images?.length > 0 ? (
                  <Suspense
                    fallback={
                      <div className="w-full overflow-hidden bg-background shadow-md border border-border rounded-xl">
                        <div className="relative aspect-[4/3] w-full">
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
              </div>

              {/* Product Info */}
              <div className="mt-10 lg:mt-0">
                <Info data={product} />
                <ProductViewCounter productId={product.id} />
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
            <div className="border-t">
              <Container>
                <div className="px-4 py-12 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
