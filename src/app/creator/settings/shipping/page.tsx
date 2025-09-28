
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent } from '@/components/ui/card';
import { Truck } from 'lucide-react';

function ShippingSettingsPage() {
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Shipping</h1>
                <p className="text-muted-foreground">Manage your shipping settings.</p>
            </div>
            
            <Card>
                <CardContent className="py-20 text-center text-muted-foreground">
                    <Truck className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">Under Development</h3>
                    <p className="text-sm">We are currently building this feature. Shipping settings will be available here soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(ShippingSettingsPage);

    