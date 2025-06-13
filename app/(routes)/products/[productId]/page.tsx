import type { Metadata } from "next"
import getProducts from "@/actions/get-products"
import getProduct from "@/actions/get-product"
import ProductList from "@/components/product-list"
import Gallery from "@/components/gallery"
import Info from "@/components/info"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProductPageProps {
  params: Promise<{
    productId: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { productId } = await params
    const product = await getProduct((await params).productId)

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found",
      }
    }

    return {
      title: `${product.name} | Store`,
      openGraph: {
        images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
      },
    }
  } catch {
    return {
      title: "Product Details",
      description: "View product details",
    }
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  try {
    const product = await getProduct((await params).productId)
    const suggestedProducts = await getProducts({
      categoryId: product?.category?.id,
    })

    return (
      <div className="bg-card text-foreground">
        {/* ============ Full Width Two-Column ============ */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Gallery on Left */}
            <div className="w-full overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Gallery images={product.images} />
              ) : (
                <div className="h-96 bg-muted/10 flex items-center justify-center rounded-xl">
                  <p className="text-muted-foreground">No images available</p>
                </div>
              )}
            </div>

            {/* Info on Right */}
            <div className="w-full">
              <Info data={product} />
            </div>
          </div>
        </div>

        {/* ============ Related Products ============ */}
        <div className="px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
          <section aria-labelledby="related-products-heading" className="max-w-screen-2xl mx-auto">
            <h2 id="related-products-heading" className="sr-only">
              Related products
            </h2>
            {suggestedProducts.length > 0 ? (
              <ProductList title="Related Items" items={suggestedProducts} />
            ) : (
              <p className="text-center py-10 text-muted-foreground">No related products found</p>
            )}
          </section>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading product page:", error)
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
    )
  }
}


export default ProductPage
