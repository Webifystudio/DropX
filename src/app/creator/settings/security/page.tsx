
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

function SecuritySettingsPage() {
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Security</h1>
                <p className="text-muted-foreground">Manage your account security settings.</p>
            </div>
            
             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Important Security Notice</AlertTitle>
                <AlertDescription>
                   For your protection, password changes and other sensitive security operations must be handled through our main site. Please contact support if you need to make changes to your login credentials.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground py-10">
                    <p>This feature is coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(SecuritySettingsPage);
