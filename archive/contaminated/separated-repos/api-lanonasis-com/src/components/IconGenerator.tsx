import React, { useId } from 'react';

interface IconGeneratorProps {
  size: number;
  format?: 'png' | 'svg';
}

const IconGenerator: React.FC<IconGeneratorProps> = ({ size, format = 'svg' }) => {
  // Generate unique IDs for SVG elements to prevent conflicts when multiple icons are rendered
  const uniqueId = useId();
  const id = `lan-onasis-icon-${uniqueId}`;
  
  // Create SVG content
  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      id={id}
    >
      {/* Background with gradient */}
      <defs>
        <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A1930" />
          <stop offset="50%" stopColor="#00B4FF" />
          <stop offset="100%" stopColor="#39FF14" />
        </linearGradient>
        <linearGradient id={`bg-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0A1930" />
          <stop offset="100%" stopColor="#0F233A" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="256" cy="256" r="256" fill={`url(#bg-gradient-${uniqueId})`} />
      
      {/* Geometric pattern - representing network/ecosystem */}
      <g opacity="0.3">
        {/* Network lines */}
        <path d="M100 200 L256 150 L412 200" stroke="#00B4FF" strokeWidth="2" opacity="0.5" />
        <path d="M100 312 L256 362 L412 312" stroke="#39FF14" strokeWidth="2" opacity="0.5" />
        <path d="M256 150 L256 362" stroke="#00B4FF" strokeWidth="2" opacity="0.5" />
      </g>
      
      {/* Center logo mark - "L" for Lan Onasis */}
      <g transform="translate(256, 256)">
        {/* Main L shape with gradient */}
        <path
          d="M -60 -80 L -60 60 L 60 60 L 60 20 L -20 20 L -20 -80 Z"
          fill={`url(#gradient-${uniqueId})`}
          opacity="0.9"
        />
        
        {/* Accent dot */}
        <circle cx="40" cy="-40" r="20" fill="#39FF14" opacity="0.8" />
      </g>
      
      {/* Orbital rings */}
      <circle cx="256" cy="256" r="180" stroke="#00B4FF" strokeWidth="1" fill="none" opacity="0.2" />
      <circle cx="256" cy="256" r="220" stroke="#39FF14" strokeWidth="1" fill="none" opacity="0.1" />
    </svg>
  );

  if (format === 'png') {
    // For PNG generation, we'd need to use canvas API
    // This is a placeholder for the concept
    return (
      <div data-size={size} data-format="png">
        {svgContent}
      </div>
    );
  }

  return svgContent;
};

// Helper component to generate all icon sizes
export const GenerateAllIcons: React.FC = () => {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-gray-100">
      {sizes.map((size) => (
        <div key={size} className="flex flex-col items-center">
          <div className="border border-gray-300 rounded-lg p-2 bg-white">
            <IconGenerator size={size} />
          </div>
          <p className="mt-2 text-sm text-gray-600">icon-{size}.png</p>
          <button
            className="mt-1 text-xs text-blue-600 hover:underline"
            onClick={() => {
              // Convert SVG to PNG logic would go here
              console.log(`Download icon-${size}.png`);
            }}
          >
            Download PNG
          </button>
        </div>
      ))}
    </div>
  );
};

export default IconGenerator;