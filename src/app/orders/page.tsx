import { orders as mockOrders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function getPlaceholderImage(id: string) {
    const image = PlaceHolderImages.find((img) => img.id === id);
    return image || { imageUrl: 'https://picsum.photos/seed/placeholder/600/600', imageHint: 'placeholder' };
}

function getStatusBadge(status: 'Processing' | 'Shipped' | 'Delivered') {
    switch (status) {
        case 'Processing':
            return <Badge variant="secondary"><Package className="h-3 w-3 mr-1" />{status}</Badge>;
        case 'Shipped':
            return <Badge className="bg-blue-500 hover:bg-blue-600"><Truck className="h-3 w-3 mr-1" />{status}</Badge>;
        case 'Delivered':
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />{status}</Badge>;
    }
}

export default function OrdersPage() {
    
    if (!mockOrders || mockOrders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
              <Package className="mx-auto h-24 w-24 text-muted-foreground" />
              <h1 className="mt-4 text-2xl font-bold">No orders yet</h1>
              <p className="mt-2 text-muted-foreground">You haven't placed any orders with us. Let's change that!</p>
              <Button asChild className="mt-6">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          );
    }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-headline">Your Orders</h1>
      <div className="space-y-6">
        {mockOrders.slice().reverse().map(order => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Order #{order.id.split('-')[1]}</CardTitle>
                <CardDescription>Date: {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
              </div>
              {getStatusBadge(order.status)}
            </CardHeader>
            <Separator />
            <CardContent className="p-6 space-y-4">
              {order.items.map(({product, quantity}) => {
                  const { imageUrl, imageHint } = getPlaceholderImage(product.images[0]);
                  return (
                    <div key={product.id} className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                            <Image src={imageUrl} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={imageHint} />
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
                        </div>
                        <p className="font-medium text-sm">₹{(product.price * quantity).toLocaleString('en-IN')}</p>
                    </div>
                  )
              })}
            </CardContent>
            <Separator />
            <div className="p-6 flex justify-between items-center">
                <span className="font-semibold text-lg">Total: ₹{order.total.toLocaleString('en-IN')}</span>
                <Button variant="outline">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
