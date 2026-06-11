// src/components/forms/NidaVerificationSection.tsx
import React from "react";

interface NidaVerificationSectionProps {
  nida: string;
  setNida: (value: string) => void;
  checkingNida: boolean;
  nidaValid: boolean | null;
}

export const NidaVerificationSection: React.FC<NidaVerificationSectionProps> = ({
  nida,
  setNida,
  checkingNida,
  nidaValid,
}) => {
  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50 transition-all">
      <label className="text-sm font-medium">NIDA Number (20 digits)</label>
      <input
        value={nida}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d*$/.test(val) && val.length <= 20) setNida(val);
        }}
        maxLength={20}
        inputMode="numeric"
        placeholder="Enter 20-digit NIDA number"
        className="w-full border rounded px-3 py-2 mt-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />
      {checkingNida && (
        <div className="flex items-center gap-2 mt-1 text-gray-500 text-sm">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Verifying...</span>
        </div>
      )}
      {nidaValid === true && (
        <p className="text-green-600 text-sm mt-1 flex items-center gap-1 animate-pulse">
          ✓ Verified
        </p>
      )}
      {nidaValid === false && (
        <p className="text-red-600 text-sm mt-1">✗ Invalid NIDA number</p>
      )}
      {nida.length > 0 && nida.length !== 20 && (
        <p className="text-orange-500 text-sm mt-1">Must be exactly 20 digits</p>
      )}
    </div>
  );
};