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
    <div className="mb-8 rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-300">
      {/* Header with gradient */}
      <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-800">Identity Verification</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            NIDA Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              value={nida}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val) && val.length <= 20) setNida(val);
              }}
              maxLength={20}
              inputMode="numeric"
              placeholder="Enter 20‑digit NIDA number"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white transition-all duration-200 focus:outline-none focus:ring-2 ${
                nidaValid === true
                  ? "border-green-400 focus:ring-green-200"
                  : nidaValid === false
                  ? "border-red-400 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
              }`}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M6 14h12m-6-7v7" />
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status messages */}
        <div className="min-h-[56px]">
          {checkingNida && (
            <div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-50 rounded-lg px-3 py-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Verifying NIDA number...</span>
            </div>
          )}

          {nidaValid === true && (
            <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 rounded-lg px-3 py-2 animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Verified successfully</span>
            </div>
          )}

          {nidaValid === false && (
            <div className="flex items-center gap-2 text-red-700 text-sm bg-red-50 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Invalid NIDA number. Please check and try again.</span>
            </div>
          )}

          {nida.length > 0 && nida.length !== 20 && nidaValid === null && !checkingNida && (
            <div className="flex items-center gap-2 text-orange-600 text-sm bg-orange-50 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Must be exactly 20 digits</span>
            </div>
          )}
        </div>

        {/* Help text */}
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Your NIDA number is used to verify your identity and will be stored securely.
        </p>
      </div>
    </div>
  );
};