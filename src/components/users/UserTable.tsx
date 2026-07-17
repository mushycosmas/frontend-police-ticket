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
  team_names?: string[];        // ✅ Added for multiple teams
  team_ids?: number[];          // ✅ Added for multiple teams
  
  rank?: string | null;

  photo?: string | null;
  profile_picture?: string | null;

  is_active?: boolean;
  is_team_lead_anywhere?: boolean;
  is_global_team_lead?: boolean;
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
     SAFE ROLE HANDLER
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
     SAFE BADGE COLOR
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
    if (r.includes("support"))
      return "bg-green-100 text-green-800";

    return "bg-gray-100 text-gray-800";
  };

  /* =========================
     GET TEAM BADGE COLOR
  ========================= */
  const getTeamBadgeColor = (teamName: string): string => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800',
      'bg-amber-100 text-amber-800',
      'bg-lime-100 text-lime-800',
      'bg-rose-100 text-rose-800',
    ];
    
    // Use hash of team name to get consistent color
    let hash = 0;
    for (let i = 0; i < teamName.length; i++) {
      hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  /* =========================
     EMPTY STATE
  ========================= */
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p>No users found</p>
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
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Team(s)
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => {
            const roleDisplay = getRoleDisplayName(user);
            const avatar = user.photo || user.profile_picture || "";

            const name =
              user.full_name ||
              `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
              user.username ||
              "User";

            const teamNames = user.team_names || [];

            return (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">

                {/* USER */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">

                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold text-white text-sm">
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
                      {/* Show Team Lead badge if user is a team lead */}
                      {user.is_team_lead_anywhere && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full mt-0.5 inline-block font-medium">
                          ⭐ Lead
                        </span>
                      )}
                    </div>

                  </div>
                </td>

                {/* ROLE */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {roleDisplay}
                  </span>
                </td>

                {/* TEAM(S) - ✅ Multiple Teams Support */}
                <td className="px-6 py-4">
                  {teamNames.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {teamNames.map((team, index) => (
                        <span
                          key={index}
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTeamBadgeColor(team)}`}
                          title={team}
                        >
                          {team}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                {/* RANK */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.rank || "—"}
                </td>

                {/* STATUS */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(user)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onEdit(user)}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium px-2 py-1 rounded hover:bg-yellow-50 transition-colors"
                      title="Edit User"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onResetPassword(user)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors"
                      title="Reset Password"
                    >
                      Reset
                    </button>

                    <button
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete User"
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

      {/* FOOTER with count */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default UserTable;