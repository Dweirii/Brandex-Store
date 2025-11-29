import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/components/ui/container";
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

async function RelatedProducts({ categoryId, currentPage }: { categoryId?: string; currentPage: number }) {
  if (!categoryId) return null;

  const {
    products: suggestedProducts,
    total,
    page,
    pageCount,
  } = await getProducts({
    categoryId,
    page: currentPage,
    limit: 6,
  });

  if (suggestedProducts.length === 0) {
    return (
      <p className="text-center py-10 text-muted-foreground">
        No related products found
      </p>
    );
  }

  return (
    <ProductList
      title="Related Items"
      items={suggestedProducts}
      total={total}
      page={page}
      pageCount={pageCount}
    />
  );
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  try {
    const { productId } = await params;
    const currentPage = parseInt((await searchParams)?.page || "1", 10);

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
      <div className="bg-card text-foreground">
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
          <div className="px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10 items-start">
              {/* Media */}
              <div className="w-full overflow-hidden">
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

              <div className="w-full">
                <Info data={product} />
              </div>
            </div>
          </div>
        </Container>

        <div className="border-t border-border">
          <Container>
            <div className="px-4 sm:px-6 lg:px-8 py-12">
              <section aria-labelledby="related-products-heading">
                <h2 id="related-products-heading" className="sr-only">Related products</h2>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-96 rounded-lg" />
                      ))}
                    </div>
                  }
                >
                  <RelatedProducts categoryId={product.category?.id} currentPage={currentPage} />
                </Suspense>
              </section>
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
