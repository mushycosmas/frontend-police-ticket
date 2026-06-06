import React from "react";

type User = {
  id: number;
  username?: string;
  email?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  team_name?: string;
  is_active?: boolean;
};

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onViewDetails: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
}

const getRoleBadgeColor = (role?: string) => {
  const colors: Record<string, string> = {
    ADMIN: "bg-red-100 text-red-800",
    MANAGER: "bg-purple-100 text-purple-800",
    TEAM_LEAD: "bg-blue-100 text-blue-800",
    AGENT: "bg-green-100 text-green-800",
    QA_ANALYST: "bg-yellow-100 text-yellow-800",
  };
  return colors[role || ""] || "bg-gray-100 text-gray-800";
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onViewDetails,
  onDelete,
  onResetPassword,
}) => {
  const getDisplayName = (user: User) => {
    return user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-3 text-xs font-medium text-gray-500">User</th>
            <th className="text-left p-3 text-xs font-medium text-gray-500">Email</th>
            <th className="text-left p-3 text-xs font-medium text-gray-500">Role</th>
            <th className="text-left p-3 text-xs font-medium text-gray-500">Team</th>
            <th className="text-left p-3 text-xs font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-3">
                <div className="font-medium text-gray-800">{getDisplayName(user)}</div>
                <div className="text-xs text-gray-500">@{user.username}</div>
              </td>
              <td className="p-3 text-gray-600">{user.email}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                  {user.role?.replace("_", " ") || "Unknown"}
                </span>
              </td>
              <td className="p-3 text-gray-600">{user.team_name || "—"}</td>
              <td className="p-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onViewDetails(user)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                    title="View Tickets"
                  >
                    🎫 Tickets
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onResetPassword(user)}
                    className="text-yellow-600 hover:text-yellow-800 text-sm"
                  >
                    🔑 Reset
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;