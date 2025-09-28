
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';

export default function withCreatorAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithCreatorAuth: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (loading) {
        return;
      }

      if (!user) {
        router.replace('/creator/login');
        return;
      }
      
      // The user is logged in, so they are authorized to see creator pages.
      // The dashboard itself will handle logic for fetching store data.
      setIsAuthorized(true);

    }, [user, loading, router]);

    if (loading || !isAuthorized) {
        return null; // or a loading spinner
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithCreatorAuth.displayName = `withCreatorAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithCreatorAuth;
}
