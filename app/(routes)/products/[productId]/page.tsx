import { Metadata } from "next";
import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import ProductList from "@/components/product-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// force dynamic rendering to allow params + searchParams
export const dynamic = "force-dynamic";

// optional static metadata fallback
export const metadata: Metadata = {
  title: "Product Details",
  description: "Explore details about this product.",
};

interface ProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  try {
    const { productId } = await params;
    const product = await getProduct(productId);
    if (!product) throw new Error("Product not found");

    const currentPage = parseInt((await searchParams)?.page || "1", 10);

    const {
      products: suggestedProducts,
      total,
      page,
      pageCount,
    } = await getProducts({
      categoryId: product.category?.id,
      page: currentPage,
      limit: 6,
    });

    return (
      <div className="bg-card text-foreground">
        {/* === Main Product Section === */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Media */}
            <div className="w-full overflow-hidden">
              {(product.videoUrl || product.images?.length > 0) ? (
                <Gallery data={product} />
              ) : (
                <div className="h-96 bg-muted/10 flex items-center justify-center rounded-xl">
                  <p className="text-muted-foreground">No media available</p>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="w-full">
              <Info data={product} />
            </div>
          </div>
        </div>

        {/* === Related Products Section === */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <section aria-labelledby="related-products-heading" className="max-w-screen-2xl mx-auto">
            <h2 id="related-products-heading" className="sr-only">Related products</h2>

            {suggestedProducts.length > 0 ? (
              <ProductList
                title="Related Items"
                items={suggestedProducts}
                total={total}
                page={page}
                pageCount={pageCount}
              />
            ) : (
              <p className="text-center py-10 text-muted-foreground">
                No related products found
              </p>
            )}
          </section>
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
