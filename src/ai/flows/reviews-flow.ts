
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
    const reviewsCollectionRef = collection(productRef, 'reviews');

    try {
      // Use a transaction to ensure atomicity
      await runTransaction(db, async (transaction) => {
        // 1. Add the new review
        const newReviewRef = doc(collection(db, `products/${reviewData.productId}/reviews`));
        transaction.set(newReviewRef, {
            ...reviewData,
            date: serverTimestamp(),
        });
        
        // 2. Get all reviews to calculate new average (including the new one)
        const reviewsSnapshot = await getDocs(query(reviewsCollectionRef));
        
        const existingReviews = reviewsSnapshot.docs.map(doc => doc.data() as Review);
        const allReviews = [...existingReviews, reviewData];

        const totalReviews = allReviews.length;
        const totalRating = allReviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = totalRating / totalReviews;
        
        // 3. Update the product document with the new average rating and review count
        transaction.update(productRef, {
            rating: averageRating,
            reviewCount: totalReviews,
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
