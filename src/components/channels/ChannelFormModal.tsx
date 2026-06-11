// components/channels/ChannelFormModal.tsx
import React, { useEffect, useState } from "react";
import { Channel } from "../../api/channelApi";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; status: "private" | "public" }) => void;
  editingChannel?: Channel | null;
  loading?: boolean; // optional external loading state
}

export const ChannelFormModal: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  editingChannel,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"private" | "public">("private");
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (editingChannel) {
      setName(editingChannel.name);
      setStatus(editingChannel.status);
    } else {
      setName("");
      setStatus("private");
    }
    setErrors({});
    setTouched(false);
  }, [editingChannel, show]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};
    if (!name.trim()) newErrors.name = "Channel name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setTouched(true);
    if (!validate()) return;
    onSubmit({ name: name.trim(), status });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal panel */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all"
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingChannel ? "Edit Channel" : "Create New Channel"}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {editingChannel ? "Update channel details" : "Add a new communication channel"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form body */}
          <div className="px-6 py-4 space-y-4">
            {/* Channel Name */}
            <div>
              <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 mb-1">
                Channel Name <span className="text-red-500">*</span>
              </label>
              <input
                id="channel-name"
                type="text"
                placeholder="e.g., Email, Phone, Chat, WhatsApp"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (touched) validate();
                }}
                onBlur={() => {
                  setTouched(true);
                  validate();
                }}
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.name && touched
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                }`}
                autoFocus
              />
              {errors.name && touched && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="public"
                    checked={status === "public"}
                    onChange={() => setStatus("public")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Public</span>
                  <span className="text-xs text-gray-400">(Visible to all)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="private"
                    checked={status === "private"}
                    onChange={() => setStatus("private")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Private</span>
                  <span className="text-xs text-gray-400">(Restricted access)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (touched && !!errors.name)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                editingChannel ? "Update Channel" : "Create Channel"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};