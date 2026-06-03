// components/common/LogoGroup.tsx
import React from 'react';

interface LogoGroupProps {
  leftLogoSrc: string;
  leftLogoAlt: string;
  rightLogoSrc: string;
  rightLogoAlt: string;
  className?: string;
}

export const LogoGroup: React.FC<LogoGroupProps> = ({
  leftLogoSrc,
  leftLogoAlt,
  rightLogoSrc,
  rightLogoAlt,
  className = ''
}) => {
  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      <div className="flex-shrink-0">
        <img 
          src={leftLogoSrc} 
          alt={leftLogoAlt} 
          className="h-16 md:h-20 w-auto object-contain"
        />
      </div>
      <div className="flex-shrink-0">
        <img 
          src={rightLogoSrc} 
          alt={rightLogoAlt} 
          className="h-16 md:h-20 w-auto object-contain"
        />
      </div>
    </div>
  );
};