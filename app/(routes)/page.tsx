import getBillboards from "@/actions/get-billboards";
import getProduct from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
    try {
        const products = await getProduct({isFeatured: true});
        const billboard = await getBillboards("ac8e2b5e-d18a-451e-be39-38b0de46dd63");

        return (
            <Container>
                <div className="space-y-10 pb-10">
                    <Billboard data={billboard} />
                <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                    <ProductList 
                        title="Featured Products"
                        items={products}
                    />
                </div>
                </div>
            </Container>
        );
    } catch (error) {
        console.error("Error fetching billboard:", error);
        return <p>Failed to load billboard.</p>;
    }
};

export default HomePage;
