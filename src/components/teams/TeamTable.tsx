import React from "react";

type Team = {
  id: number;
  name: string;
  description?: string;
};

type Props = {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
};

const TeamTable: React.FC<Props> = ({ teams, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">

      <table className="w-full border border-gray-200 text-sm">

        {/* HEADER */}
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>

          {teams && teams.length > 0 ? (
            teams.map((team) => (
              <tr
                key={team.id}
                className="border-t hover:bg-gray-50"
              >

                {/* ID */}
                <td className="p-3">{team.id}</td>

                {/* NAME */}
                <td className="p-3 font-medium">
                  {team.name}
                </td>

                {/* DESCRIPTION */}
                <td className="p-3 text-gray-600">
                  {team.description || "-"}
                </td>

                {/* ACTIONS */}
                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => onEdit(team)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(team)}
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
                colSpan={4}
                className="text-center py-6 text-gray-500"
              >
                No teams found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default TeamTable;