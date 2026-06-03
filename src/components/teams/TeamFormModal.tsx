import React, { useEffect, useState } from "react";
import { createTeam, updateTeam } from "../../api/teamApi";

type Team = {
  id?: number;
  name?: string;
  description?: string;
};

type Props = {
  show: boolean;
  onHide: () => void;
  team: Team | null;
  onSuccess: () => void;
};

const TeamFormModal: React.FC<Props> = ({
  show,
  onHide,
  team,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (team) {
      setForm({
        name: team.name || "",
        description: team.description || "",
      });
    } else {
      setForm({
        name: "",
        description: "",
      });
    }
  }, [team]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (team?.id) {
        await updateTeam(team.id, form);
      } else {
        await createTeam(form);
      }

      onSuccess();
      onHide();
    } catch (err) {
      console.error("Team save failed", err);
      alert("Failed to save team");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onHide}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 z-10">

        <h2 className="text-lg font-semibold mb-4">
          {team ? "Edit Team" : "Create Team"}
        </h2>

        <div className="space-y-3">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Team Name"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
            className="w-full border px-3 py-2 rounded"
          />

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
};

export default TeamFormModal;