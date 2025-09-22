
import type { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.48 4.4999L9.48003 14.4999H14.48L8.48003 24.4999L18.48 9.4999H13.48L15.48 4.4999Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
