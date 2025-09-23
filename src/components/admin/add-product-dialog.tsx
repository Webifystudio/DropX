
"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/hooks/use-toast"
import { collection, addDoc, Timestamp, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { categories } from "@/lib/data"
import { Plus, Trash } from "lucide-react"
import Image from "next/image"
import type { Supplier } from "@/lib/types"

const productSchema = z.object({
  name: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Description is too short"),
  normalPrice: z.coerce.number().min(0, "Price cannot be negative"),
  currentPrice: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Please select a category"),
  supplierId: z.string().optional(),
  sizes: z.array(z.object({ value: z.string().min(1, "Size cannot be empty") })).optional(),
  colors: z.array(z.object({ name: z.string().min(1, "Color name is required"), code: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex code") })).optional(),
  isFreeShipping: z.boolean().default(true),
  shippingCharge: z.coerce.number().optional(),
  images: z.any()
}).refine(data => data.currentPrice <= data.normalPrice, {
    message: "Current price cannot be greater than normal price",
    path: ["currentPrice"],
}).refine(data => !data.isFreeShipping ? data.shippingCharge !== undefined && data.shippingCharge >= 0 : true, {
  message: "Shipping charge is required when shipping is not free",
  path: ["shippingCharge"],
});


type ProductFormValues = z.infer<typeof productSchema>

export function AddProductDialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { toast } = useToast()
  
  useEffect(() => {
    if (isOpen) {
      const unsubscribe = onSnapshot(collection(db, 'suppliers'), (snapshot) => {
        const suppliersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
        setSuppliers(suppliersData);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
        isFreeShipping: true,
        sizes: [{ value: 'M' }],
        colors: [{ name: 'Default', code: '#000000' }]
    }
  })

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: "sizes"
  });
  
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors"
  });

  const isFreeShipping = watch("isFreeShipping")
  const imageFiles = watch("images");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        const previews = Array.from(files).map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    } else {
        setImagePreviews([]);
    }
  }

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    const imgbbApiKey = "81b665cd5c10e982384fcdec4b410fba";
    let imageUrls: string[] = [];

    try {
      if (data.images && data.images.length > 0) {
        const uploadPromises = Array.from(data.images).map(async (file: any) => {
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          if (result.success) {
            return result.data.url;
          } else {
            throw new Error(`Image upload failed: ${result.error.message}`);
          }
        });

        imageUrls = await Promise.all(uploadPromises);
      }
      
      const productData = {
        name: data.name,
        description: data.description,
        normalPrice: data.normalPrice,
        currentPrice: data.currentPrice,
        category: data.category,
        supplierId: data.supplierId,
        sizes: data.sizes?.map(s => s.value) || [],
        colors: data.colors || [],
        isFreeShipping: data.isFreeShipping,
        shippingCharge: data.isFreeShipping ? 0 : data.shippingCharge,
        images: imageUrls,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "products"), productData);

      toast({
        title: "Product Added!",
        description: `${data.name} has been successfully added.`,
      })
      reset()
      setImagePreviews([]);
      setIsOpen(false)
    } catch (error) {
      console.error("Error adding product: ", error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
            reset();
            setImagePreviews([]);
        }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your store.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="name">Product Title</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="normalPrice">Normal Price (₹)</Label>
                    <Input id="normalPrice" type="number" {...register("normalPrice")} />
                    {errors.normalPrice && <p className="text-sm text-destructive">{errors.normalPrice.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="currentPrice">Current Price (₹)</Label>
                    <Input id="currentPrice" type="number" {...register("currentPrice")} />
                    {errors.currentPrice && <p className="text-sm text-destructive">{errors.currentPrice.message}</p>}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                            {categories.map((mainCategory) => (
                                <SelectGroup key={mainCategory.id}>
                                <Label className="px-2 py-1.5 text-sm font-semibold">{mainCategory.name}</Label>
                                {mainCategory.subCategories.map((subCategory) => (
                                    <SelectItem key={subCategory.id} value={subCategory.id}>
                                    {subCategory.name}
                                    </SelectItem>
                                ))}
                                </SelectGroup>
                            ))}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Supplier</Label>
                    <Controller
                        name="supplierId"
                        control={control}
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a supplier" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((supplier) => (
                                    <SelectItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Sizes</Label>
                {sizeFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input {...register(`sizes.${index}.value`)} placeholder={`Size ${index + 1}`} />
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeSize(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSize({ value: "" })}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Size
                </Button>
            </div>

            <div className="space-y-2">
                <Label>Colors</Label>
                {colorFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input {...register(`colors.${index}.name`)} placeholder="Color Name (e.g. Black)" />
                    <div className="relative">
                        <Input {...register(`colors.${index}.code`)} placeholder="#000000" className="pl-8" />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border" style={{ backgroundColor: watch(`colors.${index}.code`) }}></span>
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeColor(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                 <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendColor({ name: "", code: "#000000" })}
                  className="mt-2"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Color
                </Button>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="images">Product Images</Label>
                <Input 
                    id="images" 
                    type="file" 
                    multiple 
                    {...register("images")} 
                    onChange={handleImageChange}
                    accept="image/*"
                />
                 {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative h-20 w-20">
                                <Image
                                    src={src}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <Controller
                        name="isFreeShipping"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                id="isFreeShipping"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />
                    <Label htmlFor="isFreeShipping">Free Shipping</Label>
                </div>
                {!isFreeShipping && (
                    <div className="flex-grow space-y-2">
                        <Label htmlFor="shippingCharge">Shipping Charge (₹)</Label>
                        <Input id="shippingCharge" type="number" {...register("shippingCharge")} />
                        {errors.shippingCharge && <p className="text-sm text-destructive">{errors.shippingCharge.message}</p>}
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
