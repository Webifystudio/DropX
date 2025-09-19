
'use client';

import withCreatorAuth from '@/components/auth/with-creator-auth';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

const storeSchema = z.object({
  name: z.string().min(3, 'Store name must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens are allowed.'),
  logo: z.any().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

function CreatorDashboard() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [store, setStore] = useState<{ id: string; logoUrl?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    async function fetchStore() {
      if (user) {
        const storeDocRef = doc(db, 'stores', user.uid);
        const docSnap = await getDoc(storeDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStore({ id: data.id, logoUrl: data.logoUrl });
          setValue('name', data.id);
        }
        setLoading(false);
      }
    }
    fetchStore();
  }, [user, setValue]);

  const onSubmit = async (data: StoreFormValues) => {
    if (!user) return;

    try {
      let logoUrl = store?.logoUrl || '';
      const imgbbApiKey = "81b665cd5c10e982384fcdec4b410fba";

      if (data.logo && data.logo.length > 0) {
        const file = data.logo[0];
        const formData = new FormData();
        formData.append("image", file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          logoUrl = result.data.url;
        } else {
          throw new Error(`Image upload failed: ${result.error.message}`);
        }
      }
      
      const storeData = {
        id: data.name,
        creatorId: user.uid,
        creatorEmail: user.email,
        logoUrl: logoUrl,
      };

      const storeDocRef = doc(db, 'stores', user.uid);
      await setDoc(storeDocRef, storeData);
      
      setStore({ id: data.name, logoUrl });

      toast({
        title: 'Store Updated!',
        description: 'Your store information has been saved.',
      });
    } catch (error) {
      console.error('Error saving store:', error);
      toast({
        title: 'Error',
        description: 'Failed to save store information.',
        variant: 'destructive',
      });
    }
  };

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
          <CardDescription>
            Setup your storefront name and logo. The store name will be used for your unique URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name (URL)</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., my-awesome-store"
                disabled={!!store}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
               <p className="text-sm text-muted-foreground">
                Your store will be available at: {window.location.origin}/<span className="font-medium text-primary">{watch('name')}</span>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Store Logo (Optional)</Label>
              <Input id="logo" type="file" {...register('logo')} />
               {store?.logoUrl && <img src={store.logoUrl} alt="Store logo" className="mt-4 h-20 w-20 object-cover rounded-md" />}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {store && !loading && (
          <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Store Link</CardTitle>
              </CardHeader>
              <CardContent>
                  <p>Your store is live! You can access it here:</p>
                  <Link href={`/${store.id}`} className="text-primary font-bold hover:underline" target="_blank">
                    {window.location.origin}/{store.id}
                  </Link>
              </CardContent>
          </Card>
      )}

    </div>
  );
}

export default withCreatorAuth(CreatorDashboard);
