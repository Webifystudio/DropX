
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { categories } from '@/lib/data';
import type { HeroSectionConfig } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const headerSchema = z.object({
  heading: z.string().min(3, 'Heading is required'),
  subheading: z.string().min(3, 'Subheading is required'),
  buttonText: z.string().min(2, 'Button text is required'),
  linkType: z.enum(['category', 'custom']),
  link: z.string().min(1, 'Link is required'),
  image: z.any(),
});

type HeaderFormValues = z.infer<typeof headerSchema>;

export default function AdminHeaderPage() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<HeaderFormValues>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      linkType: 'category',
      link: '',
    },
  });

  const linkType = form.watch('linkType');

  useEffect(() => {
    async function fetchHeaderConfig() {
      const docRef = doc(db, 'site_config', 'hero_section');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as HeroSectionConfig;
        form.reset(data);
        if (data.imageUrl) {
          setCurrentImageUrl(data.imageUrl);
        }
      }
      setLoading(false);
    }
    fetchHeaderConfig();
  }, [form]);

  const onSubmit = async (data: HeaderFormValues) => {
    setIsSubmitting(true);
    const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbApiKey) {
      toast({ title: "Error", description: "IMGBB API Key is not configured.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    try {
      let imageUrl = currentImageUrl || '';
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.success) {
          imageUrl = result.data.url;
        } else {
          throw new Error(`Image upload failed: ${result.error.message}`);
        }
      }

      const finalLink = data.linkType === 'category' ? `/category/${data.link}` : data.link;

      const configData: HeroSectionConfig = {
        heading: data.heading,
        subheading: data.subheading,
        buttonText: data.buttonText,
        linkType: data.linkType,
        link: finalLink,
        imageUrl: imageUrl,
      };

      await setDoc(doc(db, 'site_config', 'hero_section'), configData);
      toast({ title: "Success!", description: "Header section has been updated." });
      if (imageUrl) setCurrentImageUrl(imageUrl);

    } catch (error) {
      console.error("Error updating header: ", error);
      toast({ title: "Error", description: "Failed to update header section.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Home Page Header</CardTitle>
        <CardDescription>Customize the main hero section of your home page.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" {...form.register("heading")} placeholder="e.g., NEW COLLECTIONS" />
            {form.formState.errors.heading && <p className="text-sm text-destructive">{form.formState.errors.heading.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subheading">Subheading</Label>
            <Input id="subheading" {...form.register("subheading")} placeholder="e.g., 20% OFF" />
            {form.formState.errors.subheading && <p className="text-sm text-destructive">{form.formState.errors.subheading.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input id="buttonText" {...form.register("buttonText")} placeholder="e.g., Shop Now" />
            {form.formState.errors.buttonText && <p className="text-sm text-destructive">{form.formState.errors.buttonText.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Button Link</Label>
            <Controller
              name="linkType"
              control={form.control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="category" id="r1" />
                    <Label htmlFor="r1">Category</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="r2" />
                    <Label htmlFor="r2">Custom Link</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div className="space-y-2">
            {linkType === 'category' ? (
              <Controller
                name="link"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.replace('/category/', '') : ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input {...form.register("link")} placeholder="https://example.com" />
            )}
            {form.formState.errors.link && <p className="text-sm text-destructive">{form.formState.errors.link.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Background Image</Label>
            <Input id="image" type="file" {...form.register("image")} accept="image/*" />
            {currentImageUrl && (
              <div className="mt-4">
                <Image src={currentImageUrl} alt="Current header image" width={200} height={100} className="rounded-md object-cover" />
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
