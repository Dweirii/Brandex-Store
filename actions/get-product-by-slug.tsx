import { Product } from "@/types";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const res = await fetch(`${BASE_URL}/slug/${slug}`, {
      next: {
        revalidate: 60,
        tags: ["products", `product-slug-${slug}`],
      },
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.id) return null;

    const subcategoryEntry = data.ProductSubcategories?.[0];
    return {
      ...data,
      category: data.Category || data.category,
      subcategory: subcategoryEntry?.Subcategory ?? undefined,
      images: data.Image?.map((img: { url: string }) => ({ url: img.url })) || [],
    };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export default getProductBySlug;
