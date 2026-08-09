import { cn } from '@/lib/utils';

interface LanoLogoProps {
  size?: number;
  className?: string;
}

export function LanoLogo({ size = 24, className = "" }: LanoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-current", className)}
    >
      {/* L */}
      <path
        d="M4 3v14h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 0 */}
      <ellipse cx="16" cy="10" rx="4" ry="5.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

interface L0LogoProps {
  className?: string;
  size?: number;
}

export const L0Logo = ({ className = "h-5 w-5", size }: L0LogoProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-current", className)}
    width={size}
    height={size}
  >
    {/* L shape */}
    <path
      d="M6 3v15h8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* 0 shape - circle with accent */}
    <circle
      cx="16.5"
      cy="13"
      r="4.5"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M16.5 9v8"
      stroke="currentColor"
      strokeWidth="1.5"
      opacity="0.6"
    />
  </svg>
);

export default LanoLogo;
