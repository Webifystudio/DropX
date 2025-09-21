
import { Mail, Phone } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-4 text-center">Contact Us</h1>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        We'd love to hear from you! Whether you have a question about our products, an order, or anything else, our team is ready to answer all your questions.
      </p>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-4">
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Email</h3>
                    <p className="text-muted-foreground">General Inquiries</p>
                    <a href="mailto:support@dropx.in" className="text-primary hover:underline">support@dropx.in</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold">Phone</h3>
                    <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                    <a href="tel:+910000000000" className="text-primary hover:underline">+91 000 000 0000</a>
                </div>
            </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Send us a message</h2>
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
            <textarea placeholder="Your message" className="w-full p-2 border rounded" rows={5}></textarea>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-md">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
