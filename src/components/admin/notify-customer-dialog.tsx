
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Order } from '@/lib/types';
import { Copy, ExternalLink } from 'lucide-react';

type NotifyCustomerDialogProps = {
    order: Order;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
};

export function NotifyCustomerDialog({ order, isOpen, onOpenChange }: NotifyCustomerDialogProps) {
    const { toast } = useToast();
    const [whatsAppUrl, setWhatsAppUrl] = useState('');

    useEffect(() => {
        if (order && typeof window !== 'undefined') {
            const baseUrl = window.location.origin;
            const trackingUrl = `${baseUrl}/track/${order.id}`;

            const statusMessage = `Your order *#${order.id.slice(-6)}* with ${process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} is now *${order.status}*.`;
            const trackingMessage = `You can track your order here: ${trackingUrl}`;
            
            const fullMessage = encodeURIComponent(`${statusMessage}\n\n${trackingMessage}`);
            const customerNumber = order.shippingAddress.whatsappNumber;
            const url = `https://wa.me/91${customerNumber}?text=${fullMessage}`;
            setWhatsAppUrl(url);
        }
    }, [order]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(whatsAppUrl);
        toast({
            title: "Link Copied!",
            description: "WhatsApp notification link copied to clipboard.",
        });
        onOpenChange(false);
    };

    const launchWhatsApp = () => {
        window.open(whatsAppUrl, '_blank');
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Notify Customer</DialogTitle>
                    <DialogDescription>
                        Copy the WhatsApp link or launch WhatsApp to notify the customer about order #{order.id.slice(-6)}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp-link">WhatsApp Link</Label>
                        <div className="flex gap-2">
                             <Input id="whatsapp-link" value={whatsAppUrl} readOnly />
                             <Button size="icon" onClick={copyToClipboard}>
                                <Copy className="h-4 w-4" />
                             </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={launchWhatsApp}>
                       <ExternalLink className="mr-2 h-4 w-4" /> Launch WhatsApp
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
