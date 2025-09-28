
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PayoutHistoryPage() {
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Transaction History</h1>
                <p className="text-muted-foreground">A record of all your past earnings and withdrawals.</p>
            </div>
            
            <Card>
                <CardContent className="py-20 text-center text-muted-foreground">
                    <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mx-auto mb-4">
                        <History className="h-12 w-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Coming Soon</h3>
                    <p className="mt-2">We are currently building this feature. Your full transaction history will appear here once it's ready.</p>
                    <Button variant="ghost" className="mt-4">Refresh</Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(PayoutHistoryPage);
