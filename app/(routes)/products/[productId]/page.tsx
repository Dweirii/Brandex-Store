// /app/product/[productId]/page.tsx

import { Metadata } from "next";
import getProducts from "@/actions/get-products";
import getProduct from "@/actions/get-product";
import Container from "@/components/ui/container";
import ProductList from "@/components/product-list";
import Gallery from "@/components/gallery";
import Info from "@/components/info";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// ✅ Generate metadata for the product page
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { productId } = await params;
    const product = await getProduct((await params).productId);

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found",
      };
    }

    return {
      title: `${product.name} | Store`,
      openGraph: {
        images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
      },
    };
  } catch {
    return {
      title: "Product Details",
      description: "View product details",
    };
  }
}

// ✅ Page component
const ProductPage = async ({ params }: ProductPageProps) => {
  try {

    const product = await getProduct((await params).productId);
    const suggestedProducts = await getProducts({
      categoryId: product?.category?.id,
    });

    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
              <div className="overflow-hidden rounded-xl">
                {product.images && product.images.length > 0 ? (
                  <Gallery images={product.images} />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-secondary/10 rounded-xl">
                    <p className="text-muted-foreground">No images available</p>
                  </div>
                )}
              </div>
              <div className="mt-10 sm:mt-16 sm:px-0 lg:mt-4">
                <Info data={product} />
              </div>
            </div>

            <hr className="my-10" />

            <section aria-labelledby="related-products-heading">
              <h2 id="related-products-heading" className="sr-only">Related products</h2>
              {suggestedProducts.length > 0 ? (
                <ProductList title="Related Items" items={suggestedProducts} />
              ) : (
                <p className="text-center py-10 text-muted-foreground">No related products found</p>
              )}
            </section>
          </div>
        </Container>
      </div>
    );
  } catch (error) {
    console.error("Error loading product page:", error);
    return (
      <Container>
        <div className="py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              There was a problem loading this product. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </Container>
    );
  }
};

export default ProductPage;
