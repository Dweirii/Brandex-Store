import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async(): Promise<Category[]> => {
    const res = await fetch(URL, {
        next: { 
            revalidate: 300, 
            tags: ['categories'] 
        },
        headers: {
            'Content-Type': 'application/json',
        }
    });

    return res.json();
};

export default getCategories;