import React from "react";

type User = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  team_name?: string;
  is_active?: boolean;
};

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
};

const getRoleColor = (role?: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-gray-800";
    case "MANAGER":
      return "bg-blue-600";
    case "TEAM_LEAD":
      return "bg-cyan-500";
    case "AGENT":
      return "bg-green-600";
    case "QA":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
};

const UserTable: React.FC<Props> = ({
  users,
  onEdit,
  onDelete,
  onResetPassword,
}) => {
  return (
    <div className="overflow-x-auto">

      <table className="w-full border border-gray-200 text-sm">

        {/* HEADER */}
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Team</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>

          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                className="border-t hover:bg-gray-50"
              >

                {/* INDEX */}
                <td className="p-3">{index + 1}</td>

                {/* NAME */}
                <td className="p-3 font-medium">
                  {user.first_name} {user.last_name}
                </td>

                {/* EMAIL */}
                <td className="p-3 text-gray-600">
                  {user.email}
                </td>

                {/* ROLE */}
                <td className="p-3">
                  <span
                    className={`text-white text-xs px-2 py-1 rounded ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </td>

                {/* TEAM */}
                <td className="p-3">
                  {user.team_name ? (
                    <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded">
                      {user.team_name}
                    </span>
                  ) : (
                    <span className="text-gray-400">No Team</span>
                  )}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  {user.is_active ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => onEdit(user)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onResetPassword(user)}
                    className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="text-center py-6 text-gray-500"
              >
                No users found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default UserTable;