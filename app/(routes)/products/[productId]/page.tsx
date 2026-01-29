import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import { getRelatedProductsWithAI } from "@/lib/ai-recommender";
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

interface ProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const { productId } = await params;
    const product = await getProduct(productId);

    if (!product) {
      return {
        title: "Product Not Found | Brandex",
        description: "The requested product could not be found.",
      };
    }

    return generateProductMetadata(product, productId);
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
  if (!categoryId) return null;

  // 1. Fetch more products from the same category to find better matches
  const { products: allInCategory } = await getProducts({
    categoryId,
    limit: 50, // Get a larger pool for better matching
  });

  // Filter out current product
  const candidates = allInCategory.filter((item) => item.id !== currentProduct.id);

  // 2. Try AI Recommender first
  let relatedItems: Product[] = [];

  // Only attempt AI if key is present
  if (process.env.AI_GATEWAY_API_KEY) {
    const aiRecommendedIds = await getRelatedProductsWithAI(currentProduct, candidates);

    if (aiRecommendedIds.length > 0) {
      // Map IDs back to product objects and maintain AI's order
      relatedItems = aiRecommendedIds
        .map(id => candidates.find(c => c.id === id))
        .filter((p): p is Product => !!p)
        .slice(0, 8);
    }
  }

  // 3. Fallback to keyword matching if AI fails or keys are missing
  if (relatedItems.length === 0) {
    const currentKeywords = currentProduct.keywords || [];

    relatedItems = candidates
      .map((item) => {
        const itemKeywords = item.keywords || [];
        const intersection = itemKeywords.filter((k) => currentKeywords.includes(k));
        return {
          ...item,
          score: intersection.length,
        };
      })
      .sort((a, b) => b.score - a.score) // Sort by highest keyword match
      .slice(0, 8);
  }

  if (relatedItems.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        No related products found
      </p>
    );
  }

  return (
    <ProductList
      title="Related Items"
      items={relatedItems}
      total={relatedItems.length}
      page={1}
      pageCount={1}
      variant="related"
    />
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { productId } = await params;

    const product = await getProduct(productId);
    if (!product) throw new Error("Product not found");

    const siteUrl = getSiteUrl();
    const productStructuredData = generateProductStructuredData(product, productId);
    const breadcrumbStructuredData = generateBreadcrumbStructuredData([
      { name: "Home", url: siteUrl },
      { name: product.category?.name || "Products", url: product.category?.id ? `${siteUrl}/category/${product.category.id}` : `${siteUrl}/home` },
      { name: product.name, url: `${siteUrl}/products/${productId}` },
    ]);

    return (
      <div className="bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />

        <Container>
          <ProductViewTracker product={product} />
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <ProductBackButton />
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
              {/* Gallery */}
              <div className="w-full">
                {(product.videoUrl || product.images?.length > 0) ? (
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
                <ProductViewCounter productId={productId} />
              </div>
            </div>
          </div>
        </Container>

        {/* Reviews Section */}
        <div className="mt-8 border-t">
          <Container>
            <div className="px-4 py-12 sm:px-6 lg:px-8">
              <ProductReviews productId={productId} />
            </div>
          </Container>
        </div>

        {/* Related Products */}
        <div className="border-t">
          <Container>
            <div className="px-4 py-12 sm:px-6 lg:px-8">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-96 rounded-lg" />
                    ))}
                  </div>
                }
              >
                <RelatedProducts currentProduct={product} />
              </Suspense>
            </div>
          </Container>
        </div>
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
