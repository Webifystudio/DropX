

export type Product = {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  normalPrice: number;
  images: string[];
  category: string; // From subcategories
  sizes?: string[];
  colors?: { name: string; code: string }[];
  supplierId?: string;
  qrCodeUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: any; // Can be Timestamp or string
  updatedAt?: any;
};

export type Supplier = {
    id: string;
    name: string;
    contact: string;
    email?: string;
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
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: any; // Firebase Timestamp
};

export type CartItem = {
  product: Product;
  quantity: number;
  color?: { name: string; code: string };
  size?: string;
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
  customerEmail?: string;
  profit?: number;
  resellerName?: string;
  resellerContact?: string;
  resellerId?: string;
  resellerEmail?: string;
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
  logo?: string;
};

export type Creator = {
    id: string;
    name: string;
    email?: string;
    contact: string;
    title: string;
    description: string;
    followers: number;
    posts: number;
    avatarUrl: string;
    isVerified: boolean;
    totalEarnings?: number;
};

export type HeroSectionConfig = {
  heading: string;
  subheading: string;
  buttonText: string;
  linkType: 'category' | 'custom';
  link: string;
  imageUrl: string;
};
