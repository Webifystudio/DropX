
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, runTransaction, getDoc } from 'firebase/firestore';
import type { Review } from '@/lib/types';

// Schema for submitting a review
const SubmitReviewSchema = z.object({
  productId: z.string(),
  userId: z.string(),
  userName: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, "Your review must be at least 10 characters long."),
});

// Type for review submission
export type SubmitReviewInput = z.infer<typeof SubmitReviewSchema>;

// Flow to submit a new review and update product aggregates
const submitReviewFlow = ai.defineFlow(
  {
    name: 'submitReviewFlow',
    inputSchema: SubmitReviewSchema,
    outputSchema: z.string(),
  },
  async (reviewData) => {
    const productRef = doc(db, 'products', reviewData.productId);

    try {
      // Use a transaction to ensure atomicity
      await runTransaction(db, async (transaction) => {
        // 1. Get the current product document to read existing rating and review count
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists()) {
          throw "Product does not exist!";
        }
        
        const productData = productSnap.data();
        const oldRating = productData.rating || 0;
        const oldReviewCount = productData.reviewCount || 0;

        // 2. Add the new review
        const newReviewRef = doc(collection(db, `products/${reviewData.productId}/reviews`));
        
        // Fetch user data to get photoURL (this read must also be within the transaction)
        const userRef = doc(db, 'users', reviewData.userId);
        const userSnap = await transaction.get(userRef);
        const userPhotoURL = userSnap.exists() ? userSnap.data().photoURL : null;

        transaction.set(newReviewRef, {
            ...reviewData,
            userPhotoURL: userPhotoURL, // Add photoURL to review
            date: serverTimestamp(),
        });
        
        // 3. Calculate new average rating and review count
        const newReviewCount = oldReviewCount + 1;
        const newTotalRating = (oldRating * oldReviewCount) + reviewData.rating;
        const newAverageRating = newTotalRating / newReviewCount;
        
        // 4. Update the product document with the new aggregates
        transaction.update(productRef, {
            rating: newAverageRating,
            reviewCount: newReviewCount,
        });
      });

      return `Review for product ${reviewData.productId} submitted successfully.`;
    } catch (e) {
      console.error("Transaction failed: ", e);
      throw new Error("Failed to submit review.");
    }
  }
);

// Wrapper function to be called from the client
export async function submitReview(input: SubmitReviewInput): Promise<string> {
  return await submitReviewFlow(input);
}


// Flow to get reviews for a product
const getReviewsFlow = ai.defineFlow(
    {
      name: 'getReviewsFlow',
      inputSchema: z.string(), // Product ID
      outputSchema: z.array(z.any()),
    },
    async (productId) => {
      const q = query(
        collection(db, `products/${productId}/reviews`),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const reviews = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Convert Firestore Timestamp to serializable Date
          return { 
              id: doc.id, 
              ...data,
              date: data.date.toDate() 
          };
      });
      return reviews;
    }
  );

// Wrapper function to get reviews
export async function getReviews(productId: string): Promise<Review[]> {
    return (await getReviewsFlow(productId)) as Review[];
}

    