// components/common/TabButtons.tsx
import React from 'react';

interface TabButtonsProps {
  activeTab: 'report' | 'track' | null;
  onTabChange: (tab: 'report' | 'track') => void;
  options: {
    report: { label: string };
    track: { label: string };
  };
}

export const TabButtons: React.FC<TabButtonsProps> = ({
  activeTab,
  onTabChange,
  options
}) => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
      <button 
        className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
          activeTab === 'report' 
            ? 'bg-white text-brand-primary shadow-lg' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`} 
        onClick={() => onTabChange('report')}
      >
        {options.report.label}
      </button>
      <button 
        className={`px-8 py-3.5 rounded-xl font-bold transition-all ${
          activeTab === 'track' 
            ? 'bg-white text-brand-primary shadow-lg' 
            : 'bg-white/10 text-white hover:bg-white/20'
        }`} 
        onClick={() => onTabChange('track')}
      >
        {options.track.label}
      </button>
    </div>
  );
};