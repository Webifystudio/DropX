
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Instagram, Send, Rocket, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  { icon: Rocket, title: 'Zero Investment', description: 'Start your dropshipping business without spending a single rupee on inventory.' },
  { icon: Package, title: 'We Handle Everything', description: 'From product sourcing and inventory management to shipping, we’ve got you covered.' },
  { icon: DollarSign, title: 'Instant E-commerce Store', description: 'Get a fully-functional e-commerce website, ready to start selling from day one.' },
];

export default function CreatorPage() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-primary/10 to-transparent py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
            Become a DropX Creator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Launch your own e-commerce brand with zero investment. This is a dropshipping partnership, not an affiliate program. We provide the website, the products, and handle all the logistics. You just focus on growing your brand.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2" /> Follow on Instagram
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/creator/login">Creator Login <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
           <div className="mt-4">
            <span className="text-sm font-medium bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full animate-pulse">
                Early Access Beta
            </span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">How It Works</h2>
            <p className="text-muted-foreground mt-2">Starting your journey with DropX is as simple as 1-2-3.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
             <div className="flex flex-col items-center p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Register on Instagram</h3>
                <p className="text-muted-foreground">Follow our Instagram page and send us a message to get your free creator account.</p>
            </div>
             <div className="flex flex-col items-center p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Get Your Login</h3>
                <p className="text-muted-foreground">We'll provide you with your unique email and password to access your creator dashboard.</p>
            </div>
             <div className="flex flex-col items-center p-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Start Selling</h3>
                <p className="text-muted-foreground">Log in, customize your store, and start promoting your products to earn from the profits.</p>
            </div>
          </div>
        </div>
      </section>
      
       <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground mt-2">We provide the tools, you bring the passion.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">Ready to Start Your Journey?</h2>
          <p className="text-muted-foreground mb-8">Follow us on Instagram and message us to get your free creator account today!</p>
          <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg hover:shadow-xl transition-shadow">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Send className="mr-2" /> Message Us on Instagram
              </a>
            </Button>
        </div>
      </section>
    </>
  );
}
