
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { AddProductForm } from '@/components/creator/add-product-form';

function AddProductPage() {

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">Add New Product</h1>
                <p className="text-muted-foreground">Fill out the form below to add a new product to your store.</p>
            </div>
            
            <AddProductForm />

        </div>
    );
}

export default withCreatorAuth(AddProductPage);
