import { Product } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

/** Fetches the deterministic related products for a product. Cached 24h per product. */
export const getRelatedProducts = async (productId: string): Promise<Product[]> => {
  try {
    const res = await fetch(`${BASE_URL}/${productId}/related`, {
      next: { revalidate: 86400, tags: ["products", `related-${productId}`] },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((d: any) => ({
      ...d,
      category: d.Category || d.category,
      images: d.Image?.map((img: { url: string }) => ({ url: img.url })) || [],
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
};

export default getRelatedProducts;
