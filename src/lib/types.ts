

export type Product = {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  normalPrice: number;
  images: string[];
  category: string; // From subcategories
  sizes?: string[];
  rating?: number;
  reviewCount?: number;
  createdAt: string;
};

export type SubCategory = {
  id: string;
  name: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  icon: string;
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

export type ShippingAddress = {
    name: string;
    address: string;
    city: string;
    pincode: string;
    whatsappNumber: string;
}

export type Order = {
  id: string;
  date: any; // Using 'any' for Firebase Timestamp
  total: number;
  status: 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  shippingAddress: ShippingAddress;
  profit?: number;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: any; // Firebase Timestamp
  read: boolean;
  link?: string; // Optional link to the order
};

export type Store = {
  id: string; // This will be the subdomain/path
  creatorId: string;
  creatorEmail: string;
  logoUrl?: string;
};

export type Creator = {
    id: string;
    name: string;
    contact: string;
    title: string;
    description: string;
    followers: number;
    posts: number;
    avatarUrl: string;
    isVerified: boolean;
}
