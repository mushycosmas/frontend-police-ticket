// components/forms/ReporterInfoStep.tsx
import React, { useEffect, useState } from 'react';
import { Input } from '../common/Input';

import {
  getRegions,
  getDistricts,
  getWards,
} from '../../api/locationApi';

interface Option {
  id: number;
  name: string;
}

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

export const ReporterInfoStep: React.FC<ReporterInfoStepProps> = ({
  form,
  onChange,
}) => {
  const [regions, setRegions] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);

  // ======================
  // LOAD REGIONS
  // ======================
  useEffect(() => {
    getRegions().then((res: any) => {
      setRegions(res.data || []);
    });
  }, []);

  // ======================
  // LOAD DISTRICTS
  // ======================
  useEffect(() => {
    if (!form.region) return;

    getDistricts().then((res: any) => {
      const filtered = (res.data || []).filter(
        (d: any) => String(d.region) === String(form.region)
      );
      setDistricts(filtered);
    });
  }, [form.region]);

  // ======================
  // LOAD WARDS
  // ======================
  useEffect(() => {
    if (!form.district) return;

    getWards().then((res: any) => {
      const filtered = (res.data || []).filter(
        (w: any) => String(w.district) === String(form.district)
      );
      setWards(filtered);
    });
  }, [form.district]);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-lg mr-4">
          1
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Reporter Information
        </h2>
      </div>

      {/* BODY (UNCHANGED LAYOUT) */}
      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">

        {/* ROW 1 */}
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

        {/* EMAIL */}
        <Input
          label="Email Address (Optional)"
          variant="underline"
          type="email"
          value={form.reporterEmail}
          onChange={(e) => onChange('reporterEmail', e.target.value)}
        />

        {/* ROW 2 (REPLACED INPUT → SELECT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* REGION */}
          <div>
            <label className="text-sm text-gray-600">Region</label>
            <select
              value={form.region}
              onChange={(e) => onChange('region', e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none"
            >
              <option value="">Select Region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* DISTRICT */}
          <div>
            <label className="text-sm text-gray-600">District</label>
            <select
              value={form.district}
              onChange={(e) => onChange('district', e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none"
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* ROW 3 (REPLACED INPUT → SELECT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* WARD */}
          <div>
            <label className="text-sm text-gray-600">Ward</label>
            <select
              value={form.ward}
              onChange={(e) => onChange('ward', e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 outline-none"
            >
              <option value="">Select Ward</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* STREET (UNCHANGED) */}
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