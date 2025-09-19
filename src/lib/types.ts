
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // This can be deprecated or used as a fallback. For now, it is here.
  currentPrice: number;
  normalPrice: number;
  images: string[];
  categoryId: string; // From main categories
  category: string; // From subcategories
  rating: number;
  reviewCount: number;
  createdAt: string;
};

export type OldCategory = {
  id: string;
  name: string;
  icon: string;
};

export type SubCategory = {
  id: string;
  name: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  icon: string; // Added icon here for categories page
  subCategories: SubCategory[];
}

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id:string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
};
