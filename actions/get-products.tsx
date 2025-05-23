import qs from "query-string";

import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
    categoryId?: string;
    isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
    try {
        // Construct the URL with query parameters
        const url = qs.stringifyUrl({
            url: URL,
            query: {
                categoryId: query.categoryId || undefined,
                isFeatured: query.isFeatured,
            },
        });

        const res = await fetch(url);

        if (!res.ok) {
            console.error("Failed to fetch products:", res.status, res.statusText);
            throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("Invalid response format:", data);
            throw new Error("Invalid response format");
        }

        const processedData = data.map((product: any) => ({
            ...product,
            images: product.image?.map((img: any) => ({ url: img.url })) || [],
        }));

        if (query.categoryId) {
            return processedData.filter((product) => product.category?.id === query.categoryId);
        }

        return processedData;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export default getProducts;