

import { collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
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
        ...data
      } as Product;
    });

    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore: ", error);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | undefined> {
  try {
    const productRef = doc(db, 'products', productId);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data
      } as Product;
    } else {
      console.log("No such document!");
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching product from Firestore: ", error);
    return undefined;
  }
}
