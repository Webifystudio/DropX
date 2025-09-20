
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

interface WithAuthProps {
  requiredRole?: string;
}

function AuthLoader() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="space-y-6 w-full max-w-4xl p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="space-y-2">
                             <Skeleton className="h-4 w-2/3" />
                             <Skeleton className="h-8 w-1/2" />
                             <Skeleton className="h-3 w-full" />
                        </div>
                    ))}
                </div>
                 <div className="space-y-4">
                    <Skeleton className="w-full h-[400px]" />
                 </div>
            </div>
        </div>
    )
}


export default function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  const WithAuth: React.FC<P> = (props) => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

    useEffect(() => {
      if (authLoading) {
        return; 
      }

      if (!user) {
        router.replace('/admin/login');
        setStatus('unauthorized');
        return;
      }
      
      if (options.requiredRole) {
        if (user.email === options.requiredRole) {
          setStatus('authorized');
        } else {
          router.replace('/');
          setStatus('unauthorized');
        }
      } else {
        setStatus('authorized');
      }

    }, [user, authLoading, router, options.requiredRole]);

    if (status === 'loading') {
        return <AuthLoader />;
    }
    
    if (status === 'authorized') {
        return <WrappedComponent {...props} />;
    }

    return null; // or a specific "Unauthorized" component
  };
  
  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
}
