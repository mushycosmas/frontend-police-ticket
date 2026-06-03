// components/layouts/HeroSection.tsx
import React from 'react';
import { LogoGroup } from '../common/LogoGroup';
import { TabButtons } from '../common/TabButtons';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  activeTab: 'report' | 'track' | null;
  onTabChange: (tab: 'report' | 'track') => void;
  leftLogo: string;
  rightLogo: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  activeTab,
  onTabChange,
  leftLogo,
  rightLogo
}) => {
  return (
    <>
      {/* Hero Background */}
      <div className="bg-brand-primary h-[450px] w-full absolute top-0 left-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white opacity-5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-8">
        <LogoGroup 
          leftLogoSrc={leftLogo}
          leftLogoAlt="Coat of Arms"
          rightLogoSrc={rightLogo}
          rightLogoAlt="Police Logo"
          className="mb-10"
        />

        <div className="text-center max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium">
            {subtitle}
          </p>

          <TabButtons 
            activeTab={activeTab}
            onTabChange={onTabChange}
            options={{
              report: { label: 'Create New Ticket' },
              track: { label: 'Track Ticket' }
            }}
          />
        </div>
      </div>
    </>
  );
};