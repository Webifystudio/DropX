

'use client';

import { usePathname } from 'next/navigation';

export default function AdminRedirectLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // This layout is a pass-through. The real layout is in the (protected) group.
    // This structure prevents the login page from being wrapped by the auth guard.
    return <>{children}</>;
}
