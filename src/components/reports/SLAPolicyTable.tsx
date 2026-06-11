import React from "react";

export const SLAPolicyTable = () => {
  const rows = [
    {
      p: "P1 — Critical",
      fr: "< 15 mins",
      res: "< 1 hour",
      to: "Senior Agent",
    },
    {
      p: "P2 — High",
      fr: "< 30 mins",
      res: "< 4 hours",
      to: "Senior Agent",
    },
    {
      p: "P3 — Medium",
      fr: "< 1 hour",
      res: "< 8 hours",
      to: "Any Agent",
    },
    {
      p: "P4 — Low",
      fr: "< 4 hours",
      res: "< 24 hours",
      to: "Any Agent",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4">
        SLA Policy Reference
      </h2>

      {/* table content */}
    </div>
  );
};