// components/forms/ReporterInfoStep.tsx
import React from 'react';
import { Input } from '../common/Input';

interface ReporterInfoStepProps {
  form: {
    reporterName: string;
    reporterPhone: string;
    reporterEmail: string;
    region: string;
    district: string;
    ward: string;
    street: string;
  };
  onChange: (field: string, value: string) => void;
}

export const ReporterInfoStep: React.FC<ReporterInfoStepProps> = ({ form, onChange }) => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg mr-4">1</div>
        <h2 className="text-2xl font-bold text-gray-900">Reporter Information</h2>
      </div>
      
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            variant="underline" 
            value={form.reporterName} 
            onChange={(e) => onChange('reporterName', e.target.value)} 
            required 
          />
          <Input 
            label="Phone Number" 
            variant="underline" 
            value={form.reporterPhone} 
            onChange={(e) => onChange('reporterPhone', e.target.value)} 
            required 
          />
        </div>
        
        <Input 
          label="Email Address (Optional)" 
          variant="underline" 
          type="email" 
          value={form.reporterEmail} 
          onChange={(e) => onChange('reporterEmail', e.target.value)} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Region" 
            variant="underline" 
            value={form.region} 
            onChange={(e) => onChange('region', e.target.value)} 
          />
          <Input 
            label="District" 
            variant="underline" 
            value={form.district} 
            onChange={(e) => onChange('district', e.target.value)} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Ward" 
            variant="underline" 
            value={form.ward} 
            onChange={(e) => onChange('ward', e.target.value)} 
          />
          <Input 
            label="Street / Village" 
            variant="underline" 
            value={form.street} 
            onChange={(e) => onChange('street', e.target.value)} 
          />
        </div>
      </div>
    </div>
  );
};