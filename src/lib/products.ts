
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from './types';

export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        currentPrice: data.currentPrice,
        normalPrice: data.normalPrice,
        images: data.images || [],
        category: data.category,
        createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
      } as Product;
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore: ", error);
    return [];
  }
}
