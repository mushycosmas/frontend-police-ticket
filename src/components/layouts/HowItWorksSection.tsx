// components/layouts/HowItWorksSection.tsx
import React from 'react';

interface Step {
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  title: string;
  steps: Step[];
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ title, steps }) => {
  return (
    <section className="relative">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h2>
        <div className="w-20 h-1.5 bg-brand-primary mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-brand-primary text-white flex items-center justify-center text-2xl font-black mb-6 shadow-xl shadow-brand-primary/20 ring-8 ring-gray-50 group-hover:scale-110 transition-transform duration-300">
              {idx + 1}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed px-2">
              {step.description}
            </p>
            
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[3px] bg-gradient-to-r from-brand-primary/30 to-brand-primary/5 -z-10"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};