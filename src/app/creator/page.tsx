
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle, Instagram, Send, Rocket, DollarSign, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreatorCard } from '@/components/creator/creator-card';

const features = [
  { icon: Rocket, title: 'Zero Investment', description: 'Start your dropshipping business without spending a single rupee on inventory.' },
  { icon: Package, title: 'We Handle Everything', description: 'From product sourcing and inventory management to shipping, we’ve got you covered.' },
  { icon: DollarSign, title: 'Instant E-commerce Store', description: 'Get a fully-functional e-commerce website, ready to start selling from day one.' },
];

const topCreators = [
    {
        name: 'Sophie Bennett',
        title: 'Fashion Influencer',
        avatarUrl: 'https://i.ibb.co/2S7b4T0/creator1.png',
    },
    {
        name: 'Alex Rivera',
        title: 'Gadget Guru',
        avatarUrl: 'https://i.ibb.co/yBNK4gS/creator2.png',
    },
    {
        name: 'Priya Patel',
        title: 'Home Decor Expert',
        avatarUrl: 'https://i.ibb.co/xGLK53g/creator3.png',
    },
    {
        name: 'John Doe',
        title: 'Fitness Coach',
        avatarUrl: 'https://i.ibb.co/7bJc7gB/creator4.png',
    }
];

export default function CreatorPage() {
  return (
    <>
      <section className="relative bg-primary/5 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-yellow-300/50 rounded-full filter blur-2xl"></div>
            <div className="absolute -bottom-24 -right-16 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl"></div>

          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 relative">
            The best place to <span className="text-primary">launch</span> and <span className="relative inline-block">
                <span className="absolute -bottom-2 left-0 w-full h-4 bg-yellow-300/80 -z-10 transform -skew-x-12"></span>
                grow
            </span> your brand
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            This is a dropshipping partnership, not an affiliate program. We provide the website, the products, and handle all the logistics. You just focus on growing your brand.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/creator/login">Get Started <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2" /> Follow Us
              </a>
            </Button>
          </div>
           <div className="mt-6">
            <span className="text-sm font-medium bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full animate-pulse">
                Early Access Beta
            </span>
          </div>
        </div>
      </section>
      
       <section className="py-20 bg-primary/95 text-primary-foreground">
        <div className="container mx-auto px-4">
           <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">We aim to help creators discover the joy of entrepreneurship</h2>
            <p className="text-primary-foreground/80 mt-2 max-w-2xl mx-auto">Join a community of passionate brand builders and start your journey today.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topCreators.map((creator) => (
                <CreatorCard key={creator.name} {...creator} />
            ))}
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
             <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Register on Instagram</h3>
                <p className="text-muted-foreground">Follow our Instagram page and send us a message to get your free creator account.</p>
            </div>
             <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Get Your Login</h3>
                <p className="text-muted-foreground">We'll provide you with your unique email and password to access your creator dashboard.</p>
            </div>
             <div className="flex flex-col items-center p-6 border rounded-xl hover:shadow-lg transition-shadow">
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
              <Card key={index} className="bg-white p-2">
                <CardContent className="p-6 rounded-lg bg-primary/5 flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
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
