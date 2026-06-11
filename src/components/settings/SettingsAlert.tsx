import React from "react";

interface Props {
  show: boolean;
}

export const SettingsAlert: React.FC<Props> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
      <p className="text-green-700 text-sm font-medium">
        ✅ Settings saved successfully.
      </p>
    </div>
  );
};