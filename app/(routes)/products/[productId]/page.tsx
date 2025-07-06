import getProduct from "@/actions/get-product"
import { HeroSection } from "@/components/hero-section"
import Container from "@/components/ui/container"
import ProductCard from "@/components/ui/product-card"

export const revalidate = 0

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  try {
    const product = await getProduct(productId)

    return (
      <div className="bg-white dark:bg-card transition-colors">
        <Container>
          <HeroSection />
          <div className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="max-w-4xl mx-auto">
              <ProductCard data={product} />
            </div>
          </div>
        </Container>
      </div>
    )
  } catch {
    return (
      <div className="bg-white dark:bg-card transition-colors">
        <Container>
          <HeroSection />
          <div className="px-4 sm:px-6 lg:px-8 pb-24">
            <div className="text-center py-12">
              <p className="text-lg font-semibold">Product not found</p>
              <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-black text-white rounded">
                Go Back
              </button>
            </div>
          </div>
        </Container>
      </div>
    )
  }
}
