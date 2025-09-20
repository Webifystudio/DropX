

'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Notification } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mailbox, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type NotificationWithId = Notification & { id: string };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'notifications'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as NotificationWithId));
      setNotifications(notificationsData);
      setLoading(false);
      // Mark all as read when the page is viewed
      markAllAsRead(notificationsData);
    });

    return () => unsubscribe();
  }, []);

  const markAllAsRead = async (notificationsToUpdate: NotificationWithId[]) => {
    const unread = notificationsToUpdate.filter(n => !n.read);
    for (const notification of unread) {
      const notifRef = doc(db, 'notifications', notification.id);
      await updateDoc(notifRef, { read: true });
    }
  };

  const timeSince = (date: any) => {
    const seconds = Math.floor((new Date().getTime() - date.seconds * 1000) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  if (loading) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold font-headline">Notifications</h1>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <Card>
                <CardContent className="p-6 space-y-6">
                    {Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-headline">Notifications</h1>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-20">
            <CardContent>
                <Mailbox className="mx-auto h-24 w-24 text-primary" />
                <h2 className="mt-6 text-2xl font-semibold">No notifications yet</h2>
                <p className="mt-2 text-muted-foreground">Your notifications will appear here once you've received them.</p>
            </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {notifications.map((notification, index) => (
                <div key={notification.id} className="p-4 flex items-start gap-4 hover:bg-muted/50">
                   <Avatar className="h-10 w-10 border">
                        <AvatarFallback className={!notification.read ? 'bg-primary/20' : ''}>
                           {notification.title.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                    {timeSince(notification.date)}
                    {!notification.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary"></span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
