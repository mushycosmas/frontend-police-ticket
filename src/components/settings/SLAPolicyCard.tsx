import React from "react";

const slaPolicies = [
  {
    p: "P1 — Critical",
    fr: "15 mins",
    rt: "1 hour",
  },
  {
    p: "P2 — High",
    fr: "30 mins",
    rt: "4 hours",
  },
  {
    p: "P3 — Medium",
    fr: "1 hour",
    rt: "8 hours",
  },
  {
    p: "P4 — Low",
    fr: "4 hours",
    rt: "24 hours",
  },
];

export const SLAPolicyCard = () => {
  return (
    <div className="card space-y-3">
      <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
        Active SLA Policy
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {slaPolicies.map((row) => (
              <tr key={row.p}>
                <td>{row.p}</td>
                <td>{row.fr}</td>
                <td>{row.rt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};