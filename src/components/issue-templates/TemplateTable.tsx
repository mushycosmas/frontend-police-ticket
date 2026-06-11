// src/components/issue-templates/TemplateTable.tsx
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
  // ======================
  // PRIORITY SAFE HANDLER
  // ======================
  const getPriorityName = (template: IssueTemplate): string => {
    const priority: any = template.suggested_priority;

    if (!priority) return "—";

    // backend FK object
    if (typeof priority === "object" && priority?.name) {
      return priority.name;
    }

    // string fallback
    if (typeof priority === "string") {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    }

    // numeric fallback
    if (typeof priority === "number") {
      return `Priority ${priority}`;
    }

    return "—";
  };

  const getPriorityColor = (name: string): string => {
    const n = name.toLowerCase();

    if (n.includes("critical")) return "bg-red-100 text-red-800";
    if (n.includes("high")) return "bg-orange-100 text-orange-800";
    if (n.includes("medium")) return "bg-yellow-100 text-yellow-800";
    if (n.includes("low")) return "bg-green-100 text-green-800";

    return "bg-gray-100 text-gray-600";
  };

  // ======================
  // LOADING
  // ======================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-3 text-gray-500">Loading templates...</p>
      </div>
    );
  }

  // ======================
  // EMPTY STATE
  // ======================
  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 font-medium">No issue templates found</p>
        <p className="text-sm text-gray-400">
          Create your first template to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">

          {/* HEADER */}
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Channels</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-100">
            {templates.map((template, idx) => {
              const rowNumber = (page - 1) * itemsPerPage + idx + 1;

              const priorityName = getPriorityName(template);
              const priorityColor = getPriorityColor(priorityName);

              const channels = Array.isArray(template.channel_names)
                ? template.channel_names
                : [];

              return (
                <tr key={template.id} className="hover:bg-gray-50">

                  {/* INDEX */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {rowNumber}
                  </td>

                  {/* NAME */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {template.description || "—"}
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {template.category_name || "—"}
                  </td>

                  {/* PRIORITY */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${priorityColor}`}
                    >
                      {priorityName}
                    </span>
                  </td>

                  {/* CHANNELS */}
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {channels.length ? channels.join(", ") : "—"}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right space-x-2">

                    <button
                      onClick={() => onEdit(template)}
                      className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(template)}
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

      {/* PAGINATION */}
      {totalPages > 1 && onPageChange && (
        <div className="flex justify-between items-center px-4 py-3 border-t">

          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
};