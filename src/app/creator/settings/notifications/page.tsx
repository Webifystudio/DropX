
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import type { CreatorNotification } from '@/lib/types';
import { cn } from '@/lib/utils';
import { collection, onSnapshot, query, where, orderBy, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { Bell, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

function NotificationsSettingsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<CreatorNotification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        const q = query(
            collection(db, 'creator_notifications'), 
            where('creatorId', '==', user.uid),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CreatorNotification));
            setNotifications(notifs);
            setLoading(false);
            markAllAsRead(notifs);
        });

        return () => unsubscribe();
    }, [user]);

    const markAllAsRead = async (notifsToUpdate: CreatorNotification[]) => {
        const unread = notifsToUpdate.filter(n => !n.read);
        if (unread.length === 0) return;

        const batch = writeBatch(db);
        unread.forEach(notification => {
            const notifRef = doc(db, 'creator_notifications', notification.id);
            batch.update(notifRef, { read: true });
        });
        await batch.commit();
    };

    const timeSince = (date: any) => {
        if (!date?.seconds) return '';
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

    const StatusIcon = ({ status }: { status: 'paid' | 'rejected' }) => {
        if (status === 'paid') {
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        }
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Notifications</h1>
                <p className="text-muted-foreground">Updates about your withdrawals and account activity.</p>
            </div>
            
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-6 space-y-4">
                            {Array.from({length: 3}).map((_, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="flex-grow space-y-2">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                         <div className="py-20 text-center text-muted-foreground">
                            <Bell className="h-16 w-16 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground">No Notifications Yet</h3>
                            <p className="text-sm">Your notifications will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map(notif => (
                                <div key={notif.id} className="p-4 flex items-start gap-4">
                                    <div className="mt-1">
                                        <StatusIcon status={notif.status} />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{notif.title}</p>
                                        <p className="text-sm text-muted-foreground">{notif.description}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-right flex-shrink-0 w-24">
                                        {timeSince(notif.date)}
                                        {!notif.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(NotificationsSettingsPage);
