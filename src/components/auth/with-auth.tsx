
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    const [isAuthorized, setIsAuthorized] = useState(false);

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
          return;
      }

      setIsAuthorized(true);

    }, [user, loading, router]);

    if (!isAuthorized) {
        // You can return a loader here, or null
        return null; 
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
}
