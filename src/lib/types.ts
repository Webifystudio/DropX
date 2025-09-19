export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  rating: number;
  reviewCount: number;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

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
