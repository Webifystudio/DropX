
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from 'lucide-react';

function TaxesSettingsPage() {
    
    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold font-headline">Taxes & Invoices</h1>
                <p className="text-muted-foreground">Information about commissions and taxes.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Commission Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-foreground">
                        DropX collection comission from your sale.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This is the fee DropX takes from the profit of each sale you make through your storefront. This commission covers the cost of website hosting, payment processing, and our dropshipping services.
                    </p>
                </CardContent>
            </Card>

             <Card>
                <CardContent className="py-20 text-center text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">Invoices Coming Soon</h3>
                    <p className="text-sm">The ability to generate and download invoices for your records is currently under development.</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default withCreatorAuth(TaxesSettingsPage);

    