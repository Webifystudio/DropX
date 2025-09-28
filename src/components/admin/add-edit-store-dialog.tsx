
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { doc, setDoc } from 'firebase/firestore';
import type { Store } from '@/lib/types';
import Image from 'next/image';

const storeSchema = z.object({
  id: z.string().min(2, "Store name is required").regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens are allowed.'),
  creatorId: z.string().min(5, "Creator ID is required"),
  creatorEmail: z.string().email("A valid creator email is required"),
  logo: z.any().optional(),
});

type StoreFormValues = z.infer<typeof storeSchema>;

type AddEditStoreDialogProps = {
  store?: Store | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddEditStoreDialog({ store, isOpen, onOpenChange }: AddEditStoreDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!store;

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      id: '',
      creatorId: '',
      creatorEmail: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (store) {
        form.reset(store);
      } else {
        form.reset({
          id: '',
          creatorId: '',
          creatorEmail: '',
          logo: undefined,
        });
      }
    }
  }, [store, form, isOpen]);

  const onSubmit = async (data: StoreFormValues) => {
    setIsSubmitting(true);
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    try {
      let logoUrl = store?.logoUrl || '';

      if (data.logo && data.logo.length > 0) {
        if (!imgbbApiKey) {
            toast({ title: "Error", description: "IMGBB API Key is not configured.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
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
        id: data.id,
        creatorId: data.creatorId,
        creatorEmail: data.creatorEmail,
        logoUrl: logoUrl,
      };

      await setDoc(doc(db, 'stores', data.id), storeData, { merge: isEditMode });
      toast({ title: `Store ${isEditMode ? 'Updated' : 'Added'}!`, description: `Store "${data.id}" has been saved.` });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving store: ", error);
      toast({ title: "Error", description: "Failed to save store.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit' : 'Add'} Store</DialogTitle>
          <DialogDescription>
            Fill in the details for the creator's storefront.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="id">Store Name (URL)</Label>
            <Input id="id" {...form.register("id")} disabled={isEditMode} placeholder="my-awesome-store" />
            {form.formState.errors.id && <p className="text-sm text-destructive">{form.formState.errors.id.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="creatorId">Creator ID</Label>
            <Input id="creatorId" {...form.register("creatorId")} placeholder="Firebase User ID" />
            {form.formState.errors.creatorId && <p className="text-sm text-destructive">{form.formState.errors.creatorId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="creatorEmail">Creator Email</Label>
            <Input id="creatorEmail" type="email" {...form.register("creatorEmail")} placeholder="creator@example.com" />
            {form.formState.errors.creatorEmail && <p className="text-sm text-destructive">{form.formState.errors.creatorEmail.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo">Store Logo (Optional)</Label>
            <Input id="logo" type="file" accept="image/*" {...form.register("logo")} />
            {store?.logoUrl && (
              <div className="mt-2">
                <Image src={store.logoUrl} alt="Logo preview" width={60} height={60} className="rounded-md object-cover" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Store'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
