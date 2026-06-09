// components/users/UserTable.tsx
import React from "react";

/* =========================
   USER TYPE
========================= */
export type User = {
  id: number;
  username?: string;
  email?: string;

  full_name?: string;
  first_name?: string;
  last_name?: string;

  role?: string | { name?: string } | null;
  role_name?: string | null;

  team_name?: string | null;
  rank?: string | null;

  photo?: string | null;
  profile_picture?: string | null;

  is_active?: boolean;
};

/* =========================
   PROPS
========================= */
interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onViewDetails: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
}

/* =========================
   COMPONENT
========================= */
const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onViewDetails,
  onDelete,
  onResetPassword,
}) => {

  /* =========================
     SAFE ROLE HANDLER (FIXED)
  ========================= */
  const getRoleDisplayName = (user: User): string => {
    const role = user.role;

    if (user.role_name) return user.role_name;

    if (typeof role === "string") return role;

    if (role && typeof role === "object") {
      return role.name || "No Role";
    }

    return "No Role";
  };

  /* =========================
     SAFE BADGE COLOR (FIXED)
  ========================= */
  const getRoleBadgeColor = (roleInput: any) => {
    let role = "";

    if (typeof roleInput === "string") {
      role = roleInput;
    } else if (roleInput && typeof roleInput === "object") {
      role = roleInput.name || "";
    }

    const r = role.toLowerCase();

    if (r.includes("admin")) return "bg-red-100 text-red-800";
    if (r.includes("manager") || r.includes("lead"))
      return "bg-purple-100 text-purple-800";
    if (r.includes("agent") || r.includes("user"))
      return "bg-blue-100 text-blue-800";

    return "bg-gray-100 text-gray-800";
  };

  /* =========================
     EMPTY STATE
  ========================= */
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No users found
      </div>
    );
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">

        {/* HEADER */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Team
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            const roleDisplay = getRoleDisplayName(user);
            const avatar =
              user.photo || user.profile_picture || "";

            const name =
              user.full_name ||
              `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
              user.username ||
              "User";

            return (
              <tr key={user.id} className="hover:bg-gray-50">

                {/* USER */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">

                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.email}
                      </div>
                    </div>

                  </div>
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {roleDisplay}
                  </span>
                </td>

                {/* TEAM */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.team_name || "—"}
                </td>

                {/* RANK */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.rank || "—"}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">

                    <button
                      onClick={() => onViewDetails(user)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(user)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onResetPassword(user)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      Reset
                    </button>

                    <button
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;