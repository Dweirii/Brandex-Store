import getProduct from "@/actions/get-products";

import { HeroSection } from "@/components/hero-section";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
    try {
        const products = await getProduct({isFeatured: true});

        return (
            <Container>
                <div className="space-y-10 pb-10">
                    <HeroSection/>
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
