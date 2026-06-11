import React from "react";
import { IssueTemplate } from "../../api/issueTemplateApi";

interface TemplateTableProps {
  templates: IssueTemplate[];
  loading: boolean;

  page?: number;
  itemsPerPage?: number;
  totalPages?: number;

  onEdit: (template: IssueTemplate) => void;
  onDelete: (template: IssueTemplate) => void;
  onPageChange?: (page: number) => void;
}

export const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  loading,
  page = 1,
  itemsPerPage = 10,
  totalPages = 1,
  onEdit,
  onDelete,
  onPageChange,
}) => {

  // ✅ PRIORITY (FIXED)
  const getPriorityName = (t: IssueTemplate) =>
    t.priority_name || "—";

  const getPriorityColor = (name: string) => {
    const n = name.toLowerCase();

    if (n.includes("critical")) return "bg-red-100 text-red-800";
    if (n.includes("high")) return "bg-orange-100 text-orange-800";
    if (n.includes("medium")) return "bg-yellow-100 text-yellow-800";
    if (n.includes("low")) return "bg-green-100 text-green-800";

    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="text-center py-10 text-gray-500">
        No templates found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Channels</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {templates.map((t, i) => {
              const priority = getPriorityName(t);

              return (
                <tr key={t.id} className="hover:bg-gray-50">

                  <td className="px-4 py-2 text-sm text-gray-500">
                    {(page - 1) * itemsPerPage + i + 1}
                  </td>

                  <td className="px-4 py-2">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-gray-500">
                      {t.description || "—"}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-sm">
                    {t.category_name || "—"}
                  </td>

                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(priority)}`}>
                      {priority}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-sm">
                    {t.channel_names?.join(", ") || "—"}
                  </td>

                  <td className="px-4 py-2 text-right space-x-2">

                    <button
                      onClick={() => onEdit(t)}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(t)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};