import React, { useEffect, useState } from 'react';
import { Input } from '../common/Input';

import {
  getRegions,
  getDistricts,
} from '../../api/locationApi';

interface Option {
  id: number;
  name: string;
}

interface ReporterInfoStepProps {
  form: {
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    street_id: string;
    region: string;
    district: string;
    ward: string;
  };
  onChange: (field: string, value: string) => void;
}

// ============================================================
// PHONE NUMBER VALIDATION - EXACTLY 12 DIGITS, STARTING WITH 255
// ============================================================
const validatePhoneNumber = (phone: string): { valid: boolean; message: string; formatted: string } => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if empty
  if (!cleaned) {
    return { valid: false, message: 'Phone number is required', formatted: '' };
  }
  
  // Check if it starts with 255
  if (!cleaned.startsWith('255')) {
    return { 
      valid: false, 
      message: 'Phone number must start with 255 (Tanzania country code)', 
      formatted: cleaned 
    };
  }
  
  // Check total length - MUST BE EXACTLY 12 DIGITS
  if (cleaned.length !== 12) {
    return { 
      valid: false, 
      message: `Phone number must be exactly 12 digits (current: ${cleaned.length})`, 
      formatted: cleaned 
    };
  }
  
  // Valid - 255 + 9 digits (12 total)
  return { valid: true, message: 'Valid phone number', formatted: cleaned };
};

// Format phone number for display (add + prefix)
const formatPhoneDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('255') && cleaned.length === 12) {
    return `+${cleaned}`;
  }
  return phone;
};
// ============================================================

export const ReporterInfoStep: React.FC<ReporterInfoStepProps> = ({
  form,
  onChange,
}) => {
  const [regions, setRegions] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  
  // Phone validation state
  const [phoneError, setPhoneError] = useState<string>("");
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);

  useEffect(() => {
    getRegions().then((res: any) => setRegions(res.data || []));
  }, []);

  useEffect(() => {
    if (!form.region) {
      setDistricts([]);
      return;
    }
    onChange("district", "");
    getDistricts().then((res: any) => {
      const filtered = (res.data || []).filter(
        (d: any) => String(d.region) === String(form.region)
      );
      setDistricts(filtered);
    });
  }, [form.region]);

  // Handle phone change with validation
  const handlePhoneChange = (value: string) => {
    onChange('customer_phone', value);
    
    // Validate phone number
    const validation = validatePhoneNumber(value);
    if (!validation.valid && value.length > 0) {
      setPhoneError(validation.message);
      setIsPhoneValid(false);
    } else if (validation.valid) {
      setPhoneError("");
      setIsPhoneValid(true);
      // Update with formatted phone number
      onChange('customer_phone', validation.formatted);
    } else {
      setPhoneError("");
      setIsPhoneValid(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg mr-4">
          1
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Reporter Information</h2>
      </div>

      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            variant="underline"
            value={form.customer_name}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          
          {/* Phone field with validation - EXACTLY 12 DIGITS */}
          <div className="space-y-1">
            <Input
              label="Phone Number *"
              variant="underline"
              type="tel"
              value={form.customer_phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="255XXXXXXXXX (e.g. 255659703509)"
              className={phoneError ? 'border-red-500' : isPhoneValid ? 'border-green-500' : ''}
              required
            />
            {phoneError && (
              <p className="text-xs text-red-500 mt-1">{phoneError}</p>
            )}
            {isPhoneValid && form.customer_phone && (
              <p className="text-xs text-green-500 mt-1">
                ✅ Valid: {formatPhoneDisplay(form.customer_phone)}
              </p>
            )}
            {!phoneError && !isPhoneValid && form.customer_phone && form.customer_phone.length > 0 && (
              <p className="text-xs text-yellow-500 mt-1">
                ⚠️ Must be exactly 12 digits (255 + 9 digits)
              </p>
            )}
            {!form.customer_phone && (
              <p className="text-xs text-gray-400 mt-1">
                Phone number must be exactly 12 digits: 255 + 9 digits (e.g., 255659703509)
              </p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">
              Format: 255 + 9 digit phone number (total: 12 digits)
            </p>
          </div>
        </div>

        <Input
          label="Email Address (Optional)"
          variant="underline"
          type="email"
          value={form.customer_email}
          onChange={(e) => onChange('customer_email', e.target.value)}
        />

        {/* Location dropdowns - both optional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Region (Optional)</label>
            <select
              value={form.region}
              onChange={(e) => onChange('region', String(e.target.value))}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-brand-primary transition-colors"
            >
              <option value="">Select Region</option>
              {regions.map((r) => (
                <option key={r.id} value={String(r.id)}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">District (Optional)</label>
            <select
              value={form.district}
              onChange={(e) => onChange('district', String(e.target.value))}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-brand-primary transition-colors"
              disabled={!form.region}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={String(d.id)}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Validation summary */}
        {isPhoneValid && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-center">
              <span className="mr-2">✅</span> 
              Phone number is valid: <span className="font-mono font-bold ml-1">{formatPhoneDisplay(form.customer_phone)}</span>
            </p>
          </div>
        )}
        {phoneError && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 flex items-center">
              <span className="mr-2">❌</span> 
              {phoneError}
            </p>
          </div>
        )}
        {form.customer_phone && !isPhoneValid && !phoneError && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700 flex items-center">
              <span className="mr-2">⚠️</span> 
              Phone number must be exactly 12 digits starting with 255
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Current: {form.customer_phone.replace(/\D/g, '').length || 0} digits
            </p>
          </div>
        )}
      </div>
    </div>
  );
};