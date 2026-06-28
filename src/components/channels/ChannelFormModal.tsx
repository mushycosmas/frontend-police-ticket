// components/channels/ChannelFormModal.tsx
import React, { useState, useEffect } from "react";
import { Channel } from "../../types/channel";
import { Team } from "../../api/teamApi";

interface ChannelFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; status: "private" | "public"; teamId: number }) => void;
  editingChannel: Channel | null;
  teams?: Team[];
  loading?: boolean;
}

export const ChannelFormModal: React.FC<ChannelFormModalProps> = ({
  show,
  onClose,
  onSubmit,
  editingChannel,
  teams = [],
  loading = false
}) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"private" | "public">("private");
  const [teamId, setTeamId] = useState<number | "">("");
  const [errors, setErrors] = useState<{ name?: string; teamId?: string }>({});

  useEffect(() => {
    if (editingChannel) {
      setName(editingChannel.name);
      setStatus(editingChannel.status);
      setTeamId(editingChannel.teamId || "");
    } else {
      setName("");
      setStatus("private");
      setTeamId("");
    }
    setErrors({});
  }, [editingChannel, show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { name?: string; teamId?: string } = {};
    if (!name.trim()) {
      newErrors.name = "Channel name is required";
    }
    if (!teamId) {
      newErrors.teamId = "Please select a team";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ 
      name: name.trim(), 
      status,
      teamId: Number(teamId)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingChannel ? 'Edit Channel' : 'Create New Channel'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Channel Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter channel name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Team Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team *
            </label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : "")}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.teamId ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            >
              <option value="">{loading ? 'Loading teams...' : 'Select a team'}</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name} {team.department ? `(${team.department})` : ''}
                </option>
              ))}
            </select>
            {errors.teamId && (
              <p className="mt-1 text-sm text-red-600">{errors.teamId}</p>
            )}
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="public"
                  checked={status === 'public'}
                  onChange={(e) => setStatus(e.target.value as "public")}
                  className="mr-2"
                />
                Public
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="private"
                  checked={status === 'private'}
                  onChange={(e) => setStatus(e.target.value as "private")}
                  className="mr-2"
                />
                Private
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingChannel ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};