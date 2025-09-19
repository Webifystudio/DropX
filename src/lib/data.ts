
import type { Review, Order, ProductCategory } from './types';

export const categories: ProductCategory[] = [
  {
    id: "electronics",
    name: "Electronics",
    icon: 'Laptop',
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
    icon: 'Shirt',
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
    icon: 'Home',
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
    icon: 'Heart',
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
    icon: 'Bike',
    subCategories: [
      { id: "fitness-equipment", name: "Fitness Equipment" },
      { id: "camping-hiking", name: "Camping & Hiking" },
      { id: "cycling", name: "Cycling" },
      { id: "team-sports", name: "Team Sports" },
      { id: "outdoor-apparel", name: "Outdoor Apparel" },
    ],
  },
  {
    id: "books-media",
    name: "Books & Media",
    icon: 'BookOpen',
    subCategories: [
      { id: "books", name: "Books" },
      { id: "movies-tv-shows", name: "Movies & TV Shows" },
      { id: "music", name: "Music" },
      { id: "video-games", name: "Video Games" },
    ],
  },
  {
    id: "more",
    name: "More",
    icon: 'MoreHorizontal',
    subCategories: [],
  }
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
    items: [],
  },
  {
    id: 'ORD-12346',
    date: '2024-05-05',
    total: 6598,
    status: 'Shipped',
    items: [],
  },
  {
    id: 'ORD-12347',
    date: '2024-05-12',
    total: 999,
    status: 'Processing',
    items: [],
  },
];
