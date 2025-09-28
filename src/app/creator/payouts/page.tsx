
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, DollarSign, Banknote, Landmark, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { onSnapshot, query, collection, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Creator } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function PayoutsOverviewPage() {
    const { user } = useAuth();
    const [creator, setCreator] = useState<Creator | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'creators'), where('creatorId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const creatorDoc = snapshot.docs[0];
                setCreator({ id: creatorDoc.id, ...creatorDoc.data() } as Creator);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const menuItems = [
        {
            title: 'Request Withdrawal',
            description: 'Transfer your earnings to your bank account.',
            link: '/creator/payouts/request',
            icon: Banknote,
        },
        {
            title: 'Payout Accounts',
            description: 'Manage your UPI ID for receiving payments.',
            link: '/creator/payouts/accounts',
            icon: Landmark,
        },
        {
            title: 'Transaction History',
            description: 'View all your past payouts and earnings.',
            link: '/creator/payouts/history',
            icon: History,
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-40 w-full rounded-lg" />
                <div className="space-y-4">
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-lg" />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                    <CardTitle className="text-sm font-normal">Available Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">
                        ₹{(creator?.totalEarnings || 0).toLocaleString('en-IN')}
                    </p>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {menuItems.map((item) => (
                    <Link href={item.link} key={item.title}>
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <item.icon className="h-8 w-8 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default withCreatorAuth(PayoutsOverviewPage);
