import React from "react";

interface DashboardHeaderProps {
  username: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ username }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back <span className="font-semibold text-blue-600">{username}</span>
        </p>
      </div>
    </div>
  );
};