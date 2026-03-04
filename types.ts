export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
};

export interface Category {
    id: string;
    name: string;
    slug?: string;
    billboard: Billboard;
}

export interface Subcategory {
    id: string;
    name: string;
    categoryId: string;
}

export interface Product {
    [x: string]: any;
    storeId: string;
    id: string;
    slug?: string;
    category: Category;
    subcategory?: Subcategory;
    name: string;
    price: string;
    isFeatured: boolean;
    images: Image[];


    description?: string;
    keywords: string[];
    originalPrice?: string;
}


export interface Image {
    id: string;
    url: string;
}
