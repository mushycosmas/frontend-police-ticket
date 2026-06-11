import React from "react";

const preferences = [
  {
    label: "Email notifications on ticket assignment",
    defaultChecked: true,
  },
  {
    label: "Email notifications on SLA breach",
    defaultChecked: true,
  },
  {
    label: "Email notifications on ticket closure",
    defaultChecked: false,
  },
  {
    label: "Show CSAT prompt after ticket closure",
    defaultChecked: true,
  },
];

export const PreferencesCard = () => {
  return (
    <div className="card space-y-4">
      <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
        System Preferences
      </h2>

      {preferences.map((pref) => (
        <label
          key={pref.label}
          className="flex items-center justify-between py-2 border-b border-brand-border last:border-0 cursor-pointer"
        >
          <span className="text-sm text-brand-primary">
            {pref.label}
          </span>

          <input
            type="checkbox"
            defaultChecked={pref.defaultChecked}
          />
        </label>
      ))}
    </div>
  );
};