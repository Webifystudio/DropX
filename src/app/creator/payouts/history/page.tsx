
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

function PayoutHistoryPage() {
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Transaction History</h1>
                <p className="text-muted-foreground">A record of all your past earnings and withdrawals.</p>
            </div>
            
            <Card>
                <CardContent className="py-20 text-center text-muted-foreground">
                    <History className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
                    <p className="text-sm">We are working on this feature. Your transaction history will appear here once it's ready.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(PayoutHistoryPage);
