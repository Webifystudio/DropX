
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
      
      // Optional: Add role check if you have roles for creators
      // if (user.role !== 'creator') {
      //     router.replace('/');
      //     return;
      // }

      setIsAuthorized(true);

    }, [user, loading, router]);

    if (!isAuthorized) {
        return null; 
    }
    
    return <WrappedComponent {...props} />;
  };
  
  WithCreatorAuth.displayName = `withCreatorAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithCreatorAuth;
}
