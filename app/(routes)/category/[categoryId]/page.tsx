import getCategory from "@/actions/get-category";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

export const revalidate = 0;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  const [category, products] = await Promise.all([
    getCategory(categoryId),
    getProducts({ categoryId }),
  ]);

  return (
    <div className="bg-white dark:bg-card transition-colors">
      <Container>
        <Billboard data={category.billboard} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-[60vh]">
                <NoResults />
              </div>
            ) : (
              products.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
