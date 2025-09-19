
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

interface WithAuthProps {
  requiredRole?: string;
}

export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  const WithAuth: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) {
        return;
      }

      if (!user) {
        router.replace('/admin/login');
        return;
      }
      
      if (options.requiredRole && user.email !== options.requiredRole) {
          router.replace('/');
      }

    }, [user, loading, router]);

    if (loading || !user || (options.requiredRole && user.email !== options.requiredRole)) {
      return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <Skeleton className="h-10 w-1/3" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-64" />
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
}
