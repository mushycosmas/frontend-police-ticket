// components/layouts/ServicesSection.tsx
import React from 'react';

interface Service {
  text: string;
  icon?: React.ReactNode;
}

interface ServicesSectionProps {
  title: string;
  services: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ title, services }) => {
  return (
    <section>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h2>
        <div className="w-20 h-1.5 bg-brand-primary mx-auto rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
              {service.icon || (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-700 font-semibold leading-snug">{service.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};