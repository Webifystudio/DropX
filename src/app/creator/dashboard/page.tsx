
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CreatorDashboard() {
    const { user, signOut } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Creator Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.email}!</p>
                </div>
                <Button onClick={signOut}>Sign Out</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Your Store</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>This is your creator dashboard. More features coming soon!</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default withCreatorAuth(CreatorDashboard);
