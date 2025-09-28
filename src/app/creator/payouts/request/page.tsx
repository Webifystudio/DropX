
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, query, collection, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Creator } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { sendWithdrawalRequestEmail } from '@/ai/flows/send-email-flow';
import { useRouter } from 'next/navigation';

const withdrawalSchema = z.object({
  amount: z.coerce.number().min(100, 'Withdrawal amount must be at least ₹100.'),
});

type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

function RequestWithdrawalPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [creator, setCreator] = useState<Creator | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WithdrawalFormValues>({
        resolver: zodResolver(withdrawalSchema),
    });

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

    const onSubmit = async (data: WithdrawalFormValues) => {
        if (!creator || !creator.upiId) {
            toast({ title: 'UPI ID Missing', description: 'Please set your UPI ID in Payout Accounts first.', variant: 'destructive' });
            return;
        }

        const currentBalance = creator.totalEarnings || 0;
        if (data.amount > currentBalance) {
            toast({ title: 'Insufficient Balance', description: 'Withdrawal amount cannot exceed your available balance.', variant: 'destructive' });
            return;
        }

        try {
            await sendWithdrawalRequestEmail({
                creatorName: creator.name,
                creatorContact: creator.contact,
                creatorUpiId: creator.upiId,
                withdrawalAmount: data.amount,
                currentBalance: currentBalance,
                requestDate: new Date().toLocaleString('en-IN'),
            });
            toast({ title: 'Request Sent!', description: 'Your withdrawal request has been submitted for review.' });
            router.push('/creator/payouts/history');
        } catch (error) {
            console.error("Error sending withdrawal request email: ", error);
            toast({ title: 'Error', description: 'Failed to send withdrawal request. Please try again.', variant: 'destructive' });
        }
    };
    
    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                    <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
                </Card>
            </div>
        )
    }

    if (!creator?.upiId) {
        return (
            <Alert variant="destructive">
                <AlertTitle>No Payout Account Found</AlertTitle>
                <AlertDescription>
                    You must add a UPI ID to your payout accounts before you can request a withdrawal.
                    <Button asChild variant="link" className="p-0 h-auto ml-1">
                        <Link href="/creator/payouts/accounts">Add UPI ID</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Request Withdrawal</h1>
                <p className="text-muted-foreground">Transfer your earnings to your linked UPI account.</p>
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle>Available Balance</CardTitle>
                    <CardDescription>
                        You can withdraw up to ₹{(creator?.totalEarnings || 0).toLocaleString('en-IN')}. Minimum withdrawal is ₹100.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input 
                                id="amount"
                                type="number"
                                placeholder="e.g., 500"
                                {...register('amount')} 
                            />
                            {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-6">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default withCreatorAuth(RequestWithdrawalPage);
