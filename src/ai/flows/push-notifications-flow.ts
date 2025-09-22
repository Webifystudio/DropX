
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import * as webpush from 'web-push';

if (process.env.VAPID_PRIVATE_KEY && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
    webpush.setVapidDetails(
        'mailto:support@dropx.in',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}


// Schema for saving a subscription
const PushSubscriptionSchema = z.object({
  endpoint: z.string(),
  expirationTime: z.number().nullable(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

// Flow to save a subscription to Firestore
const saveSubscriptionFlow = ai.defineFlow(
  {
    name: 'saveSubscriptionFlow',
    inputSchema: PushSubscriptionSchema,
    outputSchema: z.string(),
  },
  async (subscription) => {
    const subscriptionsRef = collection(db, "pushSubscriptions");
    const q = query(subscriptionsRef, where("endpoint", "==", subscription.endpoint));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(subscriptionsRef, subscription);
      return "Subscription saved.";
    } else {
      return "Subscription already exists.";
    }
  }
);

// Wrapper function for saving subscription
export async function saveSubscription(subscription: PushSubscriptionJSON): Promise<string> {
  return await saveSubscriptionFlow(subscription);
}


// Flow to delete a subscription from Firestore
const deleteSubscriptionFlow = ai.defineFlow(
  {
    name: 'deleteSubscriptionFlow',
    inputSchema: PushSubscriptionSchema,
    outputSchema: z.string(),
  },
  async (subscription) => {
    const subscriptionsRef = collection(db, "pushSubscriptions");
    const q = query(subscriptionsRef, where("endpoint", "==", subscription.endpoint));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "pushSubscriptions", docId));
        return "Subscription deleted.";
    } else {
        return "Subscription not found.";
    }
  }
);

// Wrapper function for deleting subscription
export async function deleteSubscription(subscription: PushSubscriptionJSON): Promise<string> {
  return await deleteSubscriptionFlow(subscription);
}


// Schema for sending a push notification
const SendNotificationSchema = z.object({
  subscription: PushSubscriptionSchema,
  payload: z.string(), // JSON string of the notification payload
});

// Flow to send a single push notification
const sendPushNotificationFlow = ai.defineFlow(
  {
    name: 'sendPushNotificationFlow',
    inputSchema: SendNotificationSchema,
    outputSchema: z.any(),
  },
  async ({ subscription, payload }) => {
    try {
        const result = await webpush.sendNotification(subscription, payload);
        return result;
    } catch(e) {
        console.error("Error sending push notification", e);
        // If subscription is expired or invalid, we could delete it from DB here
        if (e instanceof Error && (e as any).statusCode === 410) {
            await deleteSubscriptionFlow(subscription);
        }
        throw e;
    }
  }
);

// Wrapper function for sending a notification
export async function sendPushNotification(input: z.infer<typeof SendNotificationSchema>): Promise<any> {
    return await sendPushNotificationFlow(input);
}
