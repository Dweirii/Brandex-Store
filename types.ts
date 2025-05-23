export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
};

export interface Category{
    id: string;
    name: string;
    billboard: Billboard;
}

export interface Product {
  [x: string]: any;
  storeId: string;
  id: string;
  category: Category;
  name: string;
  price: string;
  isFeatured: boolean;
  images: Image[];

  // ✅ أضف هذين السطرين:
  description?: string;
  keywords?: string;
  originalPrice?: string; // إن كنت تستخدمه أيضاً
}


export interface Image {
    id: string;
    url: string;
}
