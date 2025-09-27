
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { Product, Review } from '@/lib/types';
import { ArrowLeft, Heart, Share, Star, ShoppingBag, Truck, Store, Check } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';
import { getReviews, submitReview as submitReviewFlow } from '@/ai/flows/reviews-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProductImageGalleryClient } from './product-image-gallery-client';

type ProductViewProps = {
  product: Product;
};

export function ProductView({ product }: ProductViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || undefined);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchReviews = async () => {
    setLoadingReviews(true);
    const fetchedReviews = await getReviews(product.id);
    setReviews(fetchedReviews);
    setLoadingReviews(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleAddToCart = () => {
      addToCart(product, 1, selectedColor, selectedSize);
  }

  const handleReviewSubmit = async () => {
    if (!user) {
        toast({ title: "Authentication required", description: "You must be logged in to submit a review.", variant: "destructive" });
        return;
    }
    if (rating === 0) {
        toast({ title: "Rating required", description: "Please select a star rating.", variant: "destructive" });
        return;
    }
    if (reviewText.trim().length < 10) {
        toast({ title: "Review too short", description: "Your review must be at least 10 characters long.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
        await submitReviewFlow({
            productId: product.id,
            userId: user.uid,
            userName: user.displayName || "Anonymous",
            rating,
            text: reviewText,
        });
        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
        setReviewText('');
        setRating(0);
        fetchReviews(); // Refresh reviews
    } catch (error) {
        console.error("Error submitting review: ", error);
        if (error instanceof Error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Error", description: "Failed to submit review.", variant: "destructive" });
        }
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="font-semibold text-lg">Product Details</h2>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                        <Share className="h-5 w-5" />
                    </Button>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-24">
        
        <ProductImageGalleryClient images={product.images || []} productName={product.name} />

        <div className="mt-4 bg-background p-4 rounded-t-2xl">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold font-headline">{product.name}</h1>
                     <div className="mt-2 text-sm text-muted-foreground flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-semibold text-gray-800 mr-1">{product.rating?.toFixed(1) || 'N/A'}</span>
                        <span>({product.reviewCount || 0} reviews)</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 flex-shrink-0 text-muted-foreground">
                    <Heart className="h-6 w-6" />
                </Button>
            </div>

            <div className="mt-6 flex gap-8">
                 {product.colors && product.colors.length > 0 && (
                    <div>
                        <p className="font-semibold mb-2 text-sm">Color</p>
                        <div className="flex gap-2 flex-wrap">
                            {product.colors.map(color => (
                                <button
                                    key={color.code} 
                                    onClick={() => setSelectedColor(color)}
                                    className={cn("h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center",
                                      selectedColor?.code === color.code ? 'border-primary' : 'border-transparent'
                                    )}
                                >
                                    <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color.code }}>
                                       {selectedColor?.code === color.code && <Check className="h-4 w-4 text-white mix-blend-difference" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {product.sizes && product.sizes.length > 0 && (
                    <div>
                        <p className="font-semibold mb-2 text-sm">Size</p>
                        <div className="flex gap-2 flex-wrap">
                            {product.sizes.map(size => (
                                <Button 
                                    key={size} 
                                    variant={selectedSize === size ? 'default' : 'outline'}
                                    onClick={() => setSelectedSize(size)}
                                    className="px-4 py-2 h-auto"
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
        
         <div className="mt-4 bg-background p-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Truck className="h-5 w-5 text-primary"/>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">{product.isFreeShipping ? "Free Shipping" : "Shipping extra"}</p>
                        <p className="text-xs text-muted-foreground">{product.isFreeShipping ? "On all orders" : `Charge: ₹${product.shippingCharge}`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Store className="h-5 w-5 text-primary"/>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Official Store</p>
                        <p className="text-xs text-muted-foreground">100% Original</p>
                    </div>
                </div>
            </div>
         </div>


        <div className="mt-4 bg-background p-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
        </div>

        <div className="mt-4 bg-background p-4">
        <h3 className="text-lg font-semibold mb-4">Ratings & Reviews</h3>
        <div className="space-y-6">
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className="flex gap-4">
                        <Avatar className="flex-shrink-0 h-12 w-12">
                            <AvatarImage src={review.userPhotoURL} />
                            <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                             <div className="flex justify-between items-center">
                                <p className="font-semibold">{review.userName}</p>
                                <p className="text-xs text-muted-foreground">{new Date(review.date.seconds * 1000).toLocaleDateString()}</p>
                             </div>
                             <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{review.text}</p>
                        </div>
                    </div>
                ))
            ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">Be the first to review this product!</p>
            )}
        </div>

        {user ? (
            <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold mb-2">Write a review</h4>
                <div className="flex items-center gap-1 mb-2" onMouseLeave={() => setHoverRating(0)}>
                    {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        return (
                            <Star 
                                key={i} 
                                className={`h-7 w-7 cursor-pointer ${starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                            />
                        )
                    })}
                </div>
                <Textarea 
                    placeholder="What did you like or dislike?" 
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="mt-2"
                />
                <Button className="mt-3 w-full" onClick={handleReviewSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
            </div>
        ) : (
            <div className="mt-6 text-center text-sm text-muted-foreground p-4 border-t">
                <p>You must be logged in to write a review.</p>
                <Button variant="link" asChild><Link href="/account">Login or Sign Up</Link></Button>
            </div>
        )}
    </div>
      </div>
      
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Total Price</p>
                    <p className="text-2xl font-bold">₹{product.currentPrice.toLocaleString('en-IN')}</p>
                </div>
                <Button size="lg" className="w-1/2 h-14 rounded-full text-lg" onClick={handleAddToCart}>
                    <ShoppingBag className="mr-2 h-6 w-6" />
                    Add to Bag
                </Button>
            </div>
        </div>
    </div>
  );

}
