
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function GeneralSettingsPage() {
    const { user, loading } = useAuth();
    const { toast } = useToast();

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: `${label} has been copied to your clipboard.`,
        });
    };

    if (loading || !user) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/3" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-1/6" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                             <Skeleton className="h-4 w-1/6" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">General Settings</h1>
                <p className="text-muted-foreground">Manage your account and creator details.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>My Details</CardTitle>
                    <CardDescription>These details are used for your account identification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Display Name</Label>
                        <Input value={user.displayName || 'Not set'} readOnly disabled />
                    </div>
                     <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={user.email || 'Not available'} readOnly disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Creator Auth ID</Label>
                        <div className="flex items-center gap-2">
                             <Input value={user.uid} readOnly disabled />
                             <Button size="icon" variant="outline" onClick={() => copyToClipboard(user.uid, "Creator ID")}>
                                <Copy className="h-4 w-4" />
                             </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">This is your unique ID for store and earnings tracking.</p>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-6">
                    <p className="text-sm text-muted-foreground">To change these details, contact admin support.</p>
                </CardFooter>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button variant="destructive">Delete Account</Button>
                     <p className="text-xs text-muted-foreground mt-2">Permanently delete your account and all associated data. This action is irreversible.</p>
                </CardContent>
            </Card>

        </div>
    );
}

export default withCreatorAuth(GeneralSettingsPage);
