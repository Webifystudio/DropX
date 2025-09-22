
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff } from 'lucide-react';
import { saveSubscription, deleteSubscription } from '@/ai/flows/push-notifications-flow';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushSubscriptionManager() {
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSubscription() {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        if (sub) {
          setIsSubscribed(true);
          setSubscription(sub);
        }
      }
      setIsLoading(false);
    }
    checkSubscription();
  }, []);

  const subscribeUser = async () => {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      console.error("VAPID public key not found.");
      toast({
        title: 'Configuration Error',
        description: 'VAPID public key is missing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      await saveSubscription(sub.toJSON());
      
      setSubscription(sub);
      setIsSubscribed(true);
      toast({
        title: 'Subscribed!',
        description: 'You will now receive notifications for new orders.',
      });
    } catch (err) {
      console.error('Failed to subscribe the user: ', err);
      toast({
        title: 'Subscription Failed',
        description: 'Could not subscribe to notifications. Please check permissions.',
        variant: 'destructive',
      });
    }
  };

  const unsubscribeUser = async () => {
    if (subscription) {
      try {
        await subscription.unsubscribe();
        await deleteSubscription(subscription.toJSON());
        setSubscription(null);
        setIsSubscribed(false);
        toast({
          title: 'Unsubscribed',
          description: 'You will no longer receive order notifications.',
        });
      } catch (err) {
        console.error('Failed to unsubscribe the user: ', err);
        toast({
          title: 'Unsubscription Failed',
          description: 'Could not unsubscribe. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Bell className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isSubscribed ? unsubscribeUser : subscribeUser}
      aria-label={isSubscribed ? 'Unsubscribe from notifications' : 'Subscribe to notifications'}
    >
      {isSubscribed ? <BellOff className="h-6 w-6 text-destructive" /> : <Bell className="h-6 w-6" />}
    </Button>
  );
}
