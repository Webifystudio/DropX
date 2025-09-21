
import { Suspense } from 'react';
import SearchComponent from './SearchComponent';
import { Skeleton } from '@/components/ui/skeleton';

function SearchSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, i) => (
                 <Card key={i}>
                    <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-6 w-1/2 mt-2" />
                    </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

// Dummy Card for skeleton
const Card = ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>
const CardContent = ({children, ...props}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>


export default function SearchPage() {
    return (
        <Suspense fallback={<SearchSkeleton />}>
            <SearchComponent />
        </Suspense>
    )
}
