
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import type { Creator } from '@/lib/types';
import Image from 'next/image';

const creatorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  contact: z.string().min(10, "Contact number is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  followers: z.coerce.number().min(0),
  posts: z.coerce.number().min(0),
  avatar: z.any(),
  isVerified: z.boolean().default(false),
});

type CreatorFormValues = z.infer<typeof creatorSchema>;

type AddEditCreatorDialogProps = {
  creator?: Creator;
  children?: React.ReactNode;
};

export function AddEditCreatorDialog({ creator, children }: AddEditCreatorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<CreatorFormValues>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: '',
      contact: '',
      title: '',
      description: '',
      followers: 0,
      posts: 0,
      isVerified: false,
    },
  });
  
  useEffect(() => {
    if (creator) {
      form.reset({
        name: creator.name,
        contact: creator.contact,
        title: creator.title,
        description: creator.description,
        followers: creator.followers,
        posts: creator.posts,
        isVerified: creator.isVerified,
      });
    } else {
        form.reset();
    }
  }, [creator, form, isOpen]);

  const onSubmit = async (data: CreatorFormValues) => {
    setIsSubmitting(true);
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbApiKey) {
        toast({ title: "Error", description: "IMGBB API Key is not configured.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    try {
      let avatarUrl = creator?.avatarUrl || '';

      if (data.avatar && data.avatar.length > 0) {
        const file = data.avatar[0];
        const formData = new FormData();
        formData.append("image", file);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          avatarUrl = result.data.url;
        } else {
          throw new Error(`Image upload failed: ${result.error.message}`);
        }
      }
      
      const creatorData = {
        name: data.name,
        contact: data.contact,
        title: data.title,
        description: data.description,
        followers: data.followers,
        posts: data.posts,
        isVerified: data.isVerified,
        avatarUrl: avatarUrl,
      };

      if (creator) {
        await setDoc(doc(db, 'creators', creator.id), creatorData);
        toast({ title: "Creator Updated!", description: `${data.name}'s profile has been updated.` });
      } else {
        await addDoc(collection(db, 'creators'), creatorData);
        toast({ title: "Creator Added!", description: `${data.name} has been added.` });
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving creator: ", error);
      toast({ title: "Error", description: "Failed to save creator profile.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button>Add Creator</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{creator ? 'Edit' : 'Add'} Creator</DialogTitle>
          <DialogDescription>
            Fill in the details for the creator profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" {...form.register("name")} />
                    {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="contact">Contact No</Label>
                    <Input id="contact" {...form.register("contact")} />
                    {form.formState.errors.contact && <p className="text-sm text-destructive">{form.formState.errors.contact.message}</p>}
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="title">Title / Role</Label>
                <Input id="title" {...form.register("title")} placeholder="e.g., Product Designer" />
                {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description / Bio</Label>
                <Textarea id="description" {...form.register("description")} placeholder="e.g., who focuses on simplicity & usability." />
                {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="followers">Followers</Label>
                    <Input id="followers" type="number" {...form.register("followers")} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="posts">Posts</Label>
                    <Input id="posts" type="number" {...form.register("posts")} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="avatar">Avatar Image</Label>
                <Input id="avatar" type="file" accept="image/*" {...form.register("avatar")} />
                {creator?.avatarUrl && (
                    <div className="mt-2">
                        <Image src={creator.avatarUrl} alt="Avatar preview" width={80} height={80} className="rounded-md object-cover" />
                    </div>
                )}
            </div>
            
            <div className="flex items-center space-x-2">
                <Switch id="isVerified" {...form.register("isVerified")} />
                <Label htmlFor="isVerified">Verified Creator</Label>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (creator ? "Saving..." : "Adding...") : (creator ? "Save Changes" : "Add Creator")}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
