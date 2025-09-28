
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

function NotificationsSettingsPage() {
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Notifications</h1>
                <p className="text-muted-foreground">Manage your notification preferences.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Choose which email updates you'd like to receive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                            <Label htmlFor="order-updates" className="font-semibold">Order Updates</Label>
                            <p className="text-sm text-muted-foreground">Receive an email when an order is placed through your store.</p>
                        </div>
                        <Switch id="order-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                            <Label htmlFor="payout-updates" className="font-semibold">Payouts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when a payout is processed to your account.</p>
                        </div>
                        <Switch id="payout-updates" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                            <Label htmlFor="weekly-summary" className="font-semibold">Weekly Summary</Label>
                            <p className="text-sm text-muted-foreground">Receive a weekly summary of your store's performance.</p>
                        </div>
                        <Switch id="weekly-summary" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(NotificationsSettingsPage);
