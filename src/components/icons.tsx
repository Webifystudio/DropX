import type { SVGProps } from 'react';
import Image from 'next/image';

export const Logo = (props: Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'>) => (
  <Image
    src="https://i.ibb.co/CVCm52w/logo.png"
    alt="Logo"
    width={24}
    height={24}
    {...props}
  />
);
