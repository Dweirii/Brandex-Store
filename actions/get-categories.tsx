import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async(): Promise<Category[]> => {
    const res = await fetch(URL, {
        next: { 
            revalidate: 300, // Cache categories for 5 minutes (they change less frequently)
            tags: ['categories'] // For on-demand revalidation
        },
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json();
};

export default getCategories;