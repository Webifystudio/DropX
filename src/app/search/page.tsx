import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="relative mx-auto max-w-xl">
                <Input
                    type="text"
                    placeholder="Search for products, brands and more..."
                    className="w-full rounded-full bg-gray-100 py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500" />
            </div>

            <div className="mt-12 text-center">
                <p className="text-muted-foreground">Search for your favorite products.</p>
            </div>
        </div>
    )
}
