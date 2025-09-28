
'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AddEditCreatorDialog } from '@/components/admin/add-edit-creator-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Creator } from '@/lib/types';
import { CreatorCard } from '@/components/admin/creator-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AdminUsersPage() {
    const [creators, setCreators] = useState<Creator[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    
    const filteredCreators = useMemo(() => {
        if (!searchQuery) {
            return creators;
        }
        return creators.filter(creator =>
            creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (creator.email && creator.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, creators]);

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Creators</h1>
                    <p className="text-muted-foreground">Manage your creator accounts.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative sm:w-64 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search by name or email..."
                          className="pl-10 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Creator
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCreators.map(creator => (
                    <CreatorCard key={creator.id} creator={creator} />
                ))}
            </div>

            <AddEditCreatorDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}
