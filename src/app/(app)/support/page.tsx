
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export default function SupportPage() {
    const supportNumber = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT_NUMBER || '910000000000';
    const whatsappUrl = `https://wa.me/${supportNumber}?text=${encodeURIComponent("Hello, I need help with my order.")}`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <WhatsAppIcon />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-bold">Contact Support</CardTitle>
                    <CardDescription className="mt-2">
                        Have questions or need help with your order? Tap the button below to chat with us directly on WhatsApp.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                        <Button size="lg" className="w-full h-14 rounded-full text-lg bg-green-500 hover:bg-green-600 text-white">
                           <WhatsAppIcon />
                            Chat on WhatsApp
                        </Button>
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
