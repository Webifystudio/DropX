
import type { Product, Category, Review, Order, ProductCategory } from './types';

export const categories: ProductCategory[] = [
  {
    id: "electronics",
    name: "Electronics",
    subCategories: [
      { id: "computers-laptops", name: "Computers & Laptops" },
      { id: "smartphones-tablets", name: "Smartphones & Tablets" },
      { id: "cameras-drones", name: "Cameras & Drones" },
      { id: "audio-headphones", name: "Audio & Headphones" },
      { id: "tvs-home-theater", name: "TVs & Home Theater" },
    ],
  },
  {
    id: "apparel-clothing",
    name: "Apparel & Clothing",
    subCategories: [
      { id: "mens-clothing", name: "Men's Clothing" },
      { id: "womens-clothing", name: "Women's Clothing" },
      { id: "kids-clothing", name: "Kids' Clothing" },
      { id: "shoes", name: "Shoes" },
      { id: "accessories", name: "Accessories (Hats, Bags, Jewelry)" },
    ],
  },
  {
    id: "home-goods",
    name: "Home Goods",
    subCategories: [
      { id: "furniture", name: "Furniture" },
      { id: "kitchen-dining", name: "Kitchen & Dining" },
      { id: "bed-bath", name: "Bed & Bath" },
      { id: "decor", name: "Decor" },
      { id: "appliances", name: "Appliances" },
    ],
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    subCategories: [
      { id: "skincare", name: "Skincare" },
      { id: "makeup", name: "Makeup" },
      { id: "haircare", name: "Haircare" },
      { id: "fragrance", name: "Fragrance" },
      { id: "vitamins-supplements", name: "Vitamins & Supplements" },
    ],
  },
  {
    id: "sports-outdoors",
    name: "Sports & Outdoors",
    subCategories: [
      { id: "fitness-equipment", name: "Fitness Equipment" },
      { id: "camping-hiking", name, "Camping & Hiking" },
      { id: "cycling", name: "Cycling" },
      { id: "team-sports", name: "Team Sports" },
      { id: "outdoor-apparel", name: "Outdoor Apparel" },
    ],
  },
  {
    id: "books-media",
    name: "Books & Media",
    subCategories: [
      { id: "books", name: "Books" },
      { id: "movies-tv-shows", name: "Movies & TV Shows" },
      { id: "music", name: "Music" },
      { id: "video-games", name: "Video Games" },
    ],
  },
];


export const products: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Experience immersive sound with these noise-cancelling wireless headphones. Long-lasting battery and comfortable design for all-day wear.',
    price: 2499,
    images: ['1', '2'],
    categoryId: 'audio-headphones',
    rating: 4.5,
    reviewCount: 120,
  },
  {
    id: 'prod-2',
    name: 'Modern Smartwatch',
    description: 'Stay connected and track your fitness goals with this sleek smartwatch. Features a vibrant display, heart rate monitor, and GPS.',
    price: 4999,
    images: ['3', '4'],
    categoryId: 'smartphones-tablets',
    rating: 4.7,
    reviewCount: 95,
  },
  {
    id: 'prod-3',
    name: 'Men\'s Casual Bomber Jacket',
    description: 'A stylish and versatile bomber jacket, perfect for any casual occasion. Made from premium materials for comfort and durability.',
    price: 1899,
    images: ['5', '6'],
    categoryId: 'mens-clothing',
    rating: 4.6,
    reviewCount: 210,
  },
  {
    id: 'prod-4',
    name: 'Women\'s High-Waisted Jeans',
    description: 'Flattering high-waisted jeans made from stretchable denim. A timeless piece for your wardrobe.',
    price: 1599,
    images: ['7', '8'],
    categoryId: 'womens-clothing',
    rating: 4.4,
    reviewCount: 180,
  },
  {
    id: 'prod-5',
    name: 'Espresso Coffee Machine',
    description: 'Brew cafe-quality espresso at home. This machine features a powerful pressure pump and a milk frother for perfect cappuccinos.',
    price: 8999,
    images: ['9', '10'],
    categoryId: 'kitchen-dining',
    rating: 4.8,
    reviewCount: 75,
  },
  {
    id: 'prod-6',
    name: 'Non-Stick Cookware Set',
    description: 'A complete 10-piece non-stick cookware set. Eco-friendly, durable, and easy to clean.',
    price: 3499,
    images: ['11', '12'],
    categoryId: 'kitchen-dining',
    rating: 4.5,
    reviewCount: 150,
  },
  {
    id: 'prod-7',
    name: 'The Alchemist by Paulo Coelho',
    description: 'A bestselling novel that has inspired a devoted following around the world. This story is a powerful testament to the transforming power of our dreams.',
    price: 299,
    images: ['13', '14'],
    categoryId: 'books',
    rating: 4.9,
    reviewCount: 550,
  },
  {
    id: 'prod-8',
    name: 'Professional Yoga Mat',
    description: 'Extra-thick, non-slip yoga mat for a comfortable and stable practice. Made from eco-friendly TPE material.',
    price: 999,
    images: ['15', '16'],
    categoryId: 'fitness-equipment',
    rating: 4.7,
    reviewCount: 320,
  },
  {
    id: 'prod-9',
    name: 'Portable Bluetooth Speaker',
    description: 'Compact yet powerful speaker with waterproof design. Enjoy your favorite music anywhere, anytime.',
    price: 1299,
    images: ['17', '18'],
    categoryId: 'audio-headphones',
    rating: 4.6,
    reviewCount: 250,
  },
  {
    id: 'prod-10',
    name: 'Leather Strap Watch for Men',
    description: 'A classic timepiece with a genuine leather strap and a minimalist dial. Perfect for both formal and casual wear.',
    price: 2199,
    images: ['19', '20'],
    categoryId: 'accessories',
    rating: 4.5,
    reviewCount: 130,
  },
];

export const reviews: Review[] = [
    { id: 'rev-1', productId: 'prod-1', author: 'Rohan', rating: 5, text: 'Amazing sound quality and very comfortable!', date: '2024-05-10' },
    { id: 'rev-2', productId: 'prod-1', author: 'Priya', rating: 4, text: 'Good battery life, but the noise cancellation could be a bit better in crowded places.', date: '2024-05-08' },
    { id: 'rev-3', productId: 'prod-2', author: 'Amit', rating: 5, text: 'Best smartwatch I\'ve ever owned. The screen is gorgeous.', date: '2024-05-12' },
];

export const orders: Order[] = [
  {
    id: 'ORD-12345',
    date: '2024-04-20',
    total: 2499,
    status: 'Delivered',
    items: [{ product: products[0], quantity: 1 }],
  },
  {
    id: 'ORD-12346',
    date: '2024-05-05',
    total: 6598,
    status: 'Shipped',
    items: [
      { product: products[2], quantity: 1 },
      { product: products[1], quantity: 1 },
    ],
  },
  {
    id: 'ORD-12347',
    date: '2024-05-12',
    total: 999,
    status: 'Processing',
    items: [{ product: products[7], quantity: 1 }],
  },
];
