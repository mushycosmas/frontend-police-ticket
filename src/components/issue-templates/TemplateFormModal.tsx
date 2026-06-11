// src/components/issue-templates/TemplateFormModal.tsx
import React from "react";
import { Category, IssueTemplate } from "../../api/issueTemplateApi";

export interface Priority {
  id: number;
  name: string;
}

export interface Channel {
  id: number;
  name: string;
}

interface TemplateFormModalProps {
  show: boolean;
  editingTemplate: IssueTemplate | null;

  categories: Category[];
  priorities: Priority[];
  channels: Channel[];

  loadingCategories: boolean;
  loadingPriorities?: boolean;
  loadingChannels?: boolean;

  saving: boolean;

  form: {
    name: string;
    description: string;
    category_id: string;
    suggested_priority: string;
    channel_ids: number[];
    steps_to_reproduce: string;
  };

  onFormChange: (form: TemplateFormModalProps["form"]) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  show,
  editingTemplate,
  categories,
  priorities,
  channels,
  loadingCategories,
  loadingPriorities,
  loadingChannels,
  saving,
  form,
  onFormChange,
  onSubmit,
  onClose,
}) => {
  if (!show) return null;

  const toggleChannel = (channelId: number) => {
    const exists = form.channel_ids.includes(channelId);

    const updated = exists
      ? form.channel_ids.filter((id) => id !== channelId)
      : [...form.channel_ids, channelId];

    onFormChange({
      ...form,
      channel_ids: updated,
    });
  };

  const isInvalidChannels =
    !loadingChannels && channels.length > 0 && form.channel_ids.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">

          {/* HEADER */}
          <div className="px-6 pt-5 pb-3 border-b flex justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h3>
              <p className="text-sm text-gray-500">
                {editingTemplate
                  ? "Update template details"
                  : "Create a new issue template"}
              </p>
            </div>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* NAME */}
            <input
              className="w-full border p-2 rounded"
              placeholder="Template name"
              value={form.name}
              onChange={(e) =>
                onFormChange({ ...form, name: e.target.value })
              }
            />

            {/* DESCRIPTION */}
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                onFormChange({ ...form, description: e.target.value })
              }
            />

            {/* CATEGORY */}
            <select
              className="w-full border p-2 rounded"
              value={form.category_id}
              onChange={(e) =>
                onFormChange({ ...form, category_id: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* PRIORITY */}
            <select
              className="w-full border p-2 rounded"
              value={form.suggested_priority}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  suggested_priority: e.target.value,
                })
              }
            >
              <option value="">Auto priority</option>
              {priorities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* CHANNELS */}
            <div>
              <p className="font-medium mb-2">Channels</p>

              {loadingChannels ? (
                <p className="text-gray-500">Loading channels...</p>
              ) : (
                <div className="border rounded p-2 max-h-40 overflow-y-auto space-y-2">
                  {channels.map((ch) => (
                    <label
                      key={ch.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.channel_ids.includes(ch.id)}
                        onChange={() => toggleChannel(ch.id)}
                      />
                      {ch.name}
                    </label>
                  ))}
                </div>
              )}

              {isInvalidChannels && (
                <p className="text-red-500 text-sm mt-1">
                  Select at least one channel
                </p>
              )}
            </div>

            {/* STEPS */}
            <textarea
              className="w-full border p-2 rounded font-mono text-sm"
              placeholder="Steps to reproduce"
              value={form.steps_to_reproduce}
              onChange={(e) =>
                onFormChange({
                  ...form,
                  steps_to_reproduce: e.target.value,
                })
              }
            />
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 flex justify-end gap-2 border-t bg-gray-50">

            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={saving || isInvalidChannels}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {saving ? "Saving..." : editingTemplate ? "Update" : "Create"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};