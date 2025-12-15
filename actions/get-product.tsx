import { Product } from "@/types";
import { hasValidMedia } from "@/lib/check-image-url";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
    try {
        const res = await fetch(`${URL}/${id}`, {
            next: {
                revalidate: 60, // Cache for 60 seconds
                tags: ['products', `product-${id}`] // For on-demand revalidation
            },
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            console.error(`Failed to fetch product: ${res.status} ${res.statusText}`);
            throw new Error("Failed to fetch product data");
        }

        const data = await res.json();

        if (!data || !data.id) {
            console.error("Invalid product data received:", data);
            throw new Error("Invalid product data");
        }

        const product = {
            ...data,
            category: data.Category || data.category,
            images: data.Image?.map((img: any) => ({ url: img.url })) || [],
        };

        // Client-side fallback: Check if product has valid media
        // If all images are 404, throw error (will be caught and handled as 404)
        const hasValid = await hasValidMedia(product.images, product.videoUrl || null);
        if (!hasValid) {
            throw new Error("Product not found - all images are invalid");
        }

        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        throw error;
    }
};

export default getProduct;