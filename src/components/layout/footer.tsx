
import Link from 'next/link';
import { Instagram, Youtube } from 'lucide-react';

export default function Footer() {
    const instagramLink = process.env.NEXT_PUBLIC_INSTAGRAM_LINK || '#';
    const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK || '#';

    return (
        <footer className="bg-background border-t mt-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li><Link href="/categories" className="text-muted-foreground hover:text-primary">All Categories</Link></li>
                            <li><Link href="/category/electronics" className="text-muted-foreground hover:text-primary">Electronics</Link></li>
                            <li><Link href="/category/apparel-clothing" className="text-muted-foreground hover:text-primary">Apparel</Link></li>
                            <li><Link href="/category/home-goods" className="text-muted-foreground hover:text-primary">Home Goods</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">About</h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact-us" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                            <li><Link href="/creator" className="text-muted-foreground hover:text-primary">Become a Creator</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Policy</h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary">Return Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <Instagram />
                            </a>
                             <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <span className="font-bold">{process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India. All rights reserved. Site controlled by {process.env.NEXT_PUBLIC_SITE_NAME || 'DropX'} India.
                    </p>
                </div>
            </div>
        </footer>
    );
}
