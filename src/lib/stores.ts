
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { Store } from './types';

export async function getStore(storeId: string): Promise<Store | null> {
    const q = query(collection(db, "stores"), where("id", "==", storeId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const storeDoc = querySnapshot.docs[0];
        return storeDoc.data() as Store;
    }
    return null;
}

export async function getStoreByProductId(productId: string): Promise<Store | null> {
    // This is a placeholder. In a real app, you would have a more direct way
    // to find which store a product belongs to.
    // For now, we are not using this.
    return null;
}
