import React from "react";
import { useAuth } from "../../context/AuthContext";

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  const fullName =
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    user?.username ||
    "User";

  return (
    <div className="flex items-center justify-between">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back{" "}
          <span className="font-semibold text-blue-600">
            {fullName}
          </span>
        </p>

        {/* RANK */}
        {user?.rank && (
          <p className="text-xs text-gray-400 mt-1">
            {user.rank}
          </p>
        )}
      </div>

    </div>
  );
};