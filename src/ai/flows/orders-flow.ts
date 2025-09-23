
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { doc, updateDoc, addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Flow to cancel an order
export const cancelOrderFlow = ai.defineFlow(
  {
    name: 'cancelOrderFlow',
    inputSchema: z.string(), // Order ID
    outputSchema: z.string(),
  },
  async (orderId) => {
    const orderRef = doc(db, 'orders', orderId);
    
    try {
      await updateDoc(orderRef, { status: 'Cancelled' });
      
      // Create a notification for the cancellation
      await addDoc(collection(db, "notifications"), {
          title: "Order Cancelled by Customer",
          description: `Order #${orderId.slice(-6)} was cancelled by the customer.`,
          date: Timestamp.now(),
          read: false,
          link: `/admin/orders`,
      });

      return `Order ${orderId} has been cancelled.`;
    } catch (error) {
      console.error("Error cancelling order: ", error);
      throw new Error("Failed to cancel order.");
    }
  }
);

// Wrapper function to be called from the client
export async function cancelOrder(orderId: string): Promise<string> {
  return await cancelOrderFlow(orderId);
}
