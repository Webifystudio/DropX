

'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddEditCreatorDialog } from '@/components/admin/add-edit-creator-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Creator } from '@/lib/types';
import { CreatorCard } from '@/components/admin/creator-card';

export default function AdminUsersPage() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'creators'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const creatorsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Creator));
            setCreators(creatorsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Creators</h1>
                        <p className="text-muted-foreground">Manage your creator accounts.</p>
                    </div>
                    <Skeleton className="h-10 w-28 rounded-md" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Creators</h1>
                    <p className="text-muted-foreground">Manage your creator accounts.</p>
                </div>
                <AddEditCreatorDialog />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {creators.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} />
                ))}
            </div>
        </div>
    )
}
