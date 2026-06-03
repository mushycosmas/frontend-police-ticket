import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex justify-between items-center gap-4">
          
          {/* Left Logo - Coat of Arms */}
          <div className="flex-shrink-0">
            <img 
              src="/Coat of Arms - Taifa logo iliiyopitishwa(4).png" 
              alt="Coat of Arms" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Center Content */}
          <div className="text-center flex-grow">
            {/* Removed text as requested */}
          </div>

          {/* Right Logo - Police */}
          <div className="flex-shrink-0">
            <img 
              src="/POLICE LOGO - APP - PLAIN 2.png" 
              alt="Police Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
