import React, { useEffect, useState } from 'react';
import { Input } from '../common/Input';

import {
  getRegions,
  getDistricts,
  getWards,
  getStreets,
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

export const ReporterInfoStep: React.FC<ReporterInfoStepProps> = ({
  form,
  onChange,
}) => {
  const [regions, setRegions] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const [streets, setStreets] = useState<Option[]>([]);

  useEffect(() => {
    getRegions().then((res: any) => setRegions(res.data || []));
  }, []);

  useEffect(() => {
    if (!form.region) {
      setDistricts([]);
      return;
    }
    onChange("district", "");
    onChange("ward", "");
    onChange("street_id", "");
    getDistricts().then((res: any) => {
      const filtered = (res.data || []).filter(
        (d: any) => String(d.region) === String(form.region)
      );
      setDistricts(filtered);
    });
  }, [form.region]);

  useEffect(() => {
    if (!form.district) {
      setWards([]);
      return;
    }
    onChange("ward", "");
    onChange("street_id", "");
    getWards().then((res: any) => {
      const filtered = (res.data || []).filter(
        (w: any) => String(w.district) === String(form.district)
      );
      setWards(filtered);
    });
  }, [form.district]);

  useEffect(() => {
    if (!form.ward) {
      setStreets([]);
      return;
    }
    onChange("street_id", "");
    getStreets().then((res: any) => {
      const filtered = (res.data || []).filter(
        (s: any) => String(s.ward) === String(form.ward)
      );
      setStreets(filtered);
    });
  }, [form.ward]);

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
          {/* Phone field – visible, user can fill */}
          <Input
            label="Phone Number"
            variant="underline"
            value={form.customer_phone}
            onChange={(e) => onChange('customer_phone', e.target.value)}
            required
          />
        </div>

        <Input
          label="Email Address (Optional)"
          variant="underline"
          type="email"
          value={form.customer_email}
          onChange={(e) => onChange('customer_email', e.target.value)}
        />

        {/* Location dropdowns (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Region</label>
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
            <label className="text-sm text-gray-600">District</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Ward</label>
            <select
              value={form.ward}
              onChange={(e) => onChange('ward', String(e.target.value))}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-brand-primary transition-colors"
              disabled={!form.district}
            >
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w.id} value={String(w.id)}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">
              Street <span className="text-red-500">*</span>
            </label>
            <select
              value={form.street_id}
              onChange={(e) => onChange('street_id', String(e.target.value))}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none focus:border-brand-primary transition-colors"
              disabled={!form.ward}
              required
            >
              <option value="">Select Street</option>
              {streets.map((s) => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};