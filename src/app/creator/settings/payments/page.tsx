
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, query, collection, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Creator } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const payoutSchema = z.object({
  upiId: z.string().min(3, 'A valid UPI ID is required.'),
});

type PayoutFormValues = z.infer<typeof payoutSchema>;

function PaymentsSettingsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [creator, setCreator] = useState<Creator | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PayoutFormValues>({
        resolver: zodResolver(payoutSchema),
    });

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'creators'), where('creatorId', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const creatorDoc = snapshot.docs[0];
                const creatorData = { id: creatorDoc.id, ...creatorDoc.data() } as Creator;
                setCreator(creatorData);
                reset({ upiId: creatorData.upiId || '' });
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, reset]);

    const onSubmit = async (data: PayoutFormValues) => {
        if (!creator) return;
        
        try {
            const creatorRef = doc(db, 'creators', creator.id);
            await setDoc(creatorRef, { upiId: data.upiId }, { merge: true });
            toast({ title: 'Success!', description: 'Your UPI ID has been saved.' });
        } catch (error) {
            console.error("Error saving UPI ID: ", error);
            toast({ title: 'Error', description: 'Failed to save UPI ID.', variant: 'destructive' });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Payments & Payouts</h1>
                <p className="text-muted-foreground">Manage where your earnings will be sent.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>UPI Details</CardTitle>
                        <CardDescription>
                            Enter your UPI ID to receive payments. This is the only method we use for payouts currently.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="upiId">Your UPI ID</Label>
                            <Input 
                                id="upiId" 
                                placeholder="yourname@bank" 
                                {...register('upiId')} 
                            />
                            {errors.upiId && <p className="text-sm text-destructive mt-1">{errors.upiId.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save UPI ID'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default withCreatorAuth(PaymentsSettingsPage);
