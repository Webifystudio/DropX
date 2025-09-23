
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product, Review } from '@/lib/types';
import { ArrowLeft, Heart, Share, Star, ShoppingCart } from 'lucide-react';
import { AddToCartButton } from './add-to-cart-button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
  } from "@/components/ui/carousel"
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';
import { getReviews, submitReview as submitReviewFlow } from '@/ai/flows/reviews-flow';
import { useToast } from '@/hooks/use-toast';

type ProductViewProps = {
  product: Product;
};


export function ProductView({ product }: ProductViewProps) {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
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

  const handleBuyNow = () => {
    addToCart(product, 1, selectedColor, selectedSize);
    router.push('/cart');
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
            userName: user.displayName || user.email || "Anonymous",
            rating,
            text: reviewText,
        });
        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
        setReviewText('');
        setRating(0);
        fetchReviews(); // Refresh reviews
        // We might also want to trigger a re-fetch of the product data itself if the average rating is now displayed on the page.
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
    <div className="flex flex-col h-full bg-background">
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-3">
                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h2 className="font-semibold text-lg">Detail Product</h2>
                    <Link href="/cart" className="relative p-2">
                    <ShoppingCart className="h-6 w-6 text-gray-800" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4">
        
        <div className="pt-4">
            <Carousel className="w-full max-w-lg mx-auto">
                <CarouselContent>
                    {(product.images || []).map((imageUrl, index) => (
                        <CarouselItem key={index}>
                            <div className="p-0 flex aspect-square items-center justify-center relative">
                            <Image
                                src={imageUrl}
                                alt={`${product.name} - image ${index + 1}`}
                                fill
                                className="object-contain"
                                data-ai-hint="product photo"
                            />
                            </div>
                        </CarouselItem>
                        ))}
                </CarouselContent>
            </Carousel>
        </div>

        <div className="mt-6">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="font-bold text-gray-800">H&M</span>
                        <span className="text-xs">•</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-semibold text-gray-800">{product.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-xs">({product.reviewCount || 0} reviews)</span>
                    </div>
                        <h1 className="text-2xl font-bold font-headline mt-1">{product.name}</h1>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 flex-shrink-0">
                    <Heart className="h-6 w-6" />
                </Button>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                    {product.normalPrice > product.currentPrice && (
                        <span className="text-base text-muted-foreground line-through">₹{product.normalPrice.toLocaleString('en-IN')}</span>
                    )}
                </div>
            </div>

            <div className="mt-4">
                    <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
            </div>

            {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                    <p className="font-semibold mb-2">Color: <span className="font-normal">{selectedColor?.name}</span></p>
                    <div className="flex gap-3 flex-wrap">
                        {product.colors.map(color => (
                            <button
                                key={color.name} 
                                onClick={() => setSelectedColor(color)}
                                className={`h-8 w-8 rounded-full border-2 transition-all ${selectedColor?.code === color.code ? 'border-primary scale-110' : 'border-transparent'}`}
                            >
                               <div className="h-full w-full rounded-full border border-stone-200" style={{ backgroundColor: color.code }}></div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                    <p className="font-semibold mb-2">Size</p>
                    <div className="flex gap-2 flex-wrap">
                        {product.sizes.map(size => (
                            <Button 
                                key={size} 
                                variant={selectedSize === size ? 'default' : 'outline'}
                                onClick={() => setSelectedSize(size)}
                                className="w-12"
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
                <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Ratings & Reviews</h3>
                <div className="space-y-4">
                    {loadingReviews ? (
                        <p>Loading reviews...</p>
                    ) : reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.id} className="flex gap-3">
                                <div className="flex-shrink-0 text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 inline ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{review.text}</p>
                                    <p className="text-xs text-muted-foreground">by {review.userName} - {new Date(review.date.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                    )}
                </div>

                {user ? (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Write a review</h4>
                        <div className="flex items-center gap-1 mb-2" onMouseLeave={() => setHoverRating(0)}>
                            {[...Array(5)].map((_, i) => {
                                const starValue = i + 1;
                                return (
                                    <Star 
                                        key={i} 
                                        className={`h-6 w-6 cursor-pointer ${starValue <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setRating(starValue)}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                    />
                                )
                            })}
                        </div>
                        <Textarea 
                            placeholder="Share your thoughts..." 
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        <Button className="mt-2" onClick={handleReviewSubmit} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                ) : (
                    <div className="mt-4 text-center text-sm text-muted-foreground p-4 border rounded-md">
                        <p>You must be logged in to write a review.</p>
                        <Button variant="link" asChild><Link href="/account">Login or Sign Up</Link></Button>
                    </div>
                )}
            </div>
        </div>
      </div>
      </div>
        <div className="p-4 border-t bg-background sticky bottom-0">
            <div className="flex gap-4">
                <Button variant="outline" className="w-full" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
                <Button className="w-full" size="lg" onClick={handleBuyNow}>Buy Now</Button>
            </div>
        </div>
    </div>
  );
}
