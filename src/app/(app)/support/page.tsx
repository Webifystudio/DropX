
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Mic, Send, Bot, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const messages = [
    { from: 'support', text: "Hello! How can we help you today?", time: "11:45" },
    { from: 'user', text: "I have a question about my recent order.", time: "11:46" },
    { from: 'support', text: "Of course, I can help with that. Could you please provide the order number?", time: "11:47" },
];

function SupportPageSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/30">
            <div className="w-full max-w-md mx-auto p-4">
                <Skeleton className="h-[70vh] w-full rounded-2xl" />
            </div>
        </div>
    )
}

export default function SupportPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <SupportPageSkeleton />;
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
              <MessageCircle className="mx-auto h-24 w-24 text-muted-foreground" />
              <h1 className="mt-4 text-2xl font-bold">Please sign in</h1>
              <p className="mt-2 text-muted-foreground">You need to be signed in to access our support chat.</p>
              <Button asChild className="mt-6">
                <Link href="/account">Sign In</Link>
              </Button>
            </div>
          );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-muted/30 p-4">
            <div className="w-full max-w-md h-[80vh] flex flex-col bg-background rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex-shrink-0 p-4 border-b flex items-center justify-between bg-background">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar>
                                <AvatarFallback>S</AvatarFallback>
                            </Avatar>
                             <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                        </div>
                        <div>
                            <p className="font-bold">Support Team</p>
                            <p className="text-xs text-green-500 font-semibold">Online</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Bot />
                    </Button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}>
                             {msg.from === 'support' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>S</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={`max-w-[75%] p-3 rounded-2xl ${msg.from === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} text-right`}>{msg.time}</p>
                            </div>
                             {msg.from === 'user' && (
                                <Avatar className="h-8 w-8">
                                     <AvatarImage src={user.photoURL || undefined} />
                                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t bg-background flex-shrink-0">
                    <div className="relative">
                        <Input placeholder="Type a message..." className="rounded-full h-12 pl-12 pr-24 bg-muted" />
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <Paperclip className="h-5 w-5 text-muted-foreground" />
                         </div>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <Mic className="h-5 w-5 text-muted-foreground" />
                             <Button size="icon" className="rounded-full h-8 w-8">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

