
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Creator } from '@/lib/types';
import { CheckCircle, Copy, Plus, Minus, Mail, Edit } from 'lucide-react';
import { AddEditCreatorDialog } from './add-edit-creator-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendOrderStatusEmail } from '@/ai/flows/send-email-flow';
import { render } from '@react-email/components';
import { CreatorEarningsEmail } from '@/components/emails/creator-earnings-email';


type CreatorCardProps = {
  creator: Creator;
};

type ManageEarningsDialogProps = {
    creator: Creator;
    mode: 'add' | 'withdraw';
    children: React.ReactNode;
}

function ManageEarningsDialog({ creator, mode, children }: ManageEarningsDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmailPrompt, setShowEmailPrompt] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const { toast } = useToast();

    const handleTransaction = async () => {
        setIsSubmitting(true);
        const currentEarnings = creator.totalEarnings || 0;
        const newEarnings = mode === 'add' ? currentEarnings + amount : currentEarnings - amount;

        if (newEarnings < 0) {
            toast({ title: 'Error', description: 'Withdrawal amount cannot be greater than total earnings.', variant: 'destructive' });
            setIsSubmitting(false);
            return;
        }

        try {
            const creatorRef = doc(db, 'creators', creator.id);
            await updateDoc(creatorRef, { totalEarnings: newEarnings });
            toast({ title: 'Success', description: `Earnings updated successfully. New balance: ₹${newEarnings.toLocaleString()}` });
            setIsOpen(false);
            setAmount(0);
            if (creator.email) {
                setShowEmailPrompt(true);
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update earnings.', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleSendEmail = async () => {
        if (!creator.email) {
            toast({ title: 'Error', description: 'This creator does not have a registered email.', variant: 'destructive' });
            return;
        }
        setIsSendingEmail(true);
        try {
            const emailHtml = render(<CreatorEarningsEmail 
                creatorName={creator.name} 
                transactionType={mode}
                amount={amount}
            />);
            
            await sendOrderStatusEmail({
                to: creator.email,
                subject: `Update on your DropX Earnings`,
                html: emailHtml,
            });

            toast({ title: "Email Sent!", description: `Notification sent to ${creator.email}.` });
            setShowEmailPrompt(false);
        } catch (error) {
            toast({ title: 'Error sending email', description: 'Please check the console for details', variant: 'destructive' });
        } finally {
            setIsSendingEmail(false);
        }
    }


    return (
        <>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add Earnings' : 'Withdraw Earnings'}</DialogTitle>
                    <DialogDescription>
                        Enter the amount to {mode} for {creator.name}. Current balance: ₹{(creator.totalEarnings || 0).toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                 <div className="py-4">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input 
                        id="amount" 
                        type="number"
                        value={amount} 
                        onChange={(e) => setAmount(Number(e.target.value))}
                        placeholder="Enter amount"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleTransaction} disabled={isSubmitting || amount <= 0}>
                        {isSubmitting ? 'Processing...' : `Confirm ${mode === 'add' ? 'Addition' : 'Withdrawal'}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        
        <Dialog open={showEmailPrompt} onOpenChange={setShowEmailPrompt}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Notification</DialogTitle>
                    <DialogDescription>
                        Do you want to send an email notification to {creator.name} about this transaction?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                     <Button variant="outline" onClick={() => setShowEmailPrompt(false)}>No, thanks</Button>
                     <Button onClick={handleSendEmail} disabled={isSendingEmail}>
                        {isSendingEmail ? "Sending..." : <><Mail className="mr-2 h-4 w-4" /> Send Email</>}
                     </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}

export function CreatorCard({ creator }: CreatorCardProps) {
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${label} has been copied to your clipboard.`,
        })
    }

  return (
    <>
    <Card className="rounded-2xl relative group/card flex flex-col">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground opacity-0 group-hover/card:opacity-100 transition-opacity text-xs" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4" />
        </Button>

        <CardContent className="p-4 flex flex-col items-center text-center flex-grow">
            <div className="relative w-24 h-24 mb-3">
                <Image
                    src={creator.avatarUrl || 'https://i.ibb.co/CVCm52w/logo.png'}
                    alt={creator.name}
                    fill
                    className="rounded-full object-cover border-2 border-primary/50"
                    data-ai-hint="person photo"
                />
            </div>
            <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-lg">{creator.name}</h3>
                {creator.isVerified && <CheckCircle className="h-5 w-5 text-green-500 fill-green-100" />}
            </div>
             {creator.creatorId && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground cursor-pointer" onClick={() => copyToClipboard(creator.creatorId, 'Creator Auth ID')}>
                    <span>UID: {creator.creatorId.slice(0, 8)}...</span>
                    <Copy className="h-3 w-3" />
                </div>
            )}
            <p className="text-sm text-muted-foreground mt-2 text-center h-10 overflow-hidden">{creator.description}</p>
        </CardContent>
        <div className="bg-muted/50 p-4 rounded-b-2xl mt-auto">
             <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">₹{(creator.totalEarnings || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <ManageEarningsDialog creator={creator} mode="add">
                    <Button variant="outline" size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </ManageEarningsDialog>
                 <ManageEarningsDialog creator={creator} mode="withdraw">
                    <Button variant="destructive" size="sm" className="w-full">
                        <Minus className="h-4 w-4 mr-1" /> Withdrawal
                    </Button>
                </ManageEarningsDialog>
            </div>
        </div>
    </Card>
    <AddEditCreatorDialog
        creator={creator}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
    />
    </>
  );
}
