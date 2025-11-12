import { Category } from "@/types";

const URL =`${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id: string): Promise<Category> => {
    const res = await fetch(`${URL}/${id}`, {
        next: { 
            revalidate: 300, // Cache for 5 minutes
            tags: ['categories', `category-${id}`] // For on-demand revalidation
        },
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json();
};

export default getCategory;