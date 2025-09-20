
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
        return; // Wait until authentication state is loaded
      }

      if (!user) {
        // If not logged in, redirect to login page
        router.replace('/admin/login');
        return;
      }
      
      // Check for required role after confirming user is loaded
      if (options.requiredRole) {
        if (user.email === options.requiredRole) {
          setIsAuthorized(true);
        } else {
          // If role doesn't match, redirect to home
          router.replace('/');
        }
      } else {
        // If no role is required, user is authorized
        setIsAuthorized(true);
      }

    }, [user, loading, router]);

    // Render a loading state or nothing while checking authorization
    if (!isAuthorized) {
        return null; 
    }
    
    // If authorized, render the wrapped component
    return <WrappedComponent {...props} />;
  };
  
  WithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuth;
}
