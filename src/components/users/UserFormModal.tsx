import React, { useEffect, useState } from "react";

import { createUser, updateUser } from "../../api/userApi";
import { getTeams } from "../../api/teamApi";
import { getRegions } from "../../api/locationApi";

type User = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  team?: number | string;
  region?: number | string;
};

type Team = {
  id: number;
  name: string;
};

type Region = {
  id: number;
  name: string;
};

type Props = {
  show: boolean;
  onHide: () => void;
  user: User | null;
  onSuccess: () => void;
};

const UserFormModal: React.FC<Props> = ({
  show,
  onHide,
  user,
  onSuccess,
}) => {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "AGENT",
    team: "",
    region: "",
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // =========================
  // LOAD TEAMS
  // =========================
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const res = await getTeams();
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load teams", err);
      }
    };

    loadTeams();
  }, []);

  // =========================
  // LOAD REGIONS
  // =========================
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const res = await getRegions();
        setRegions(res.data);
      } catch (err) {
        console.error("Failed to load regions", err);
      }
    };

    loadRegions();
  }, []);

  // =========================
  // FILL FORM
  // =========================
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        role: user.role || "AGENT",
        team: user.team ? String(user.team) : "",
        region: user.region ? String(user.region) : "",
      });
    } else {
      setForm({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "AGENT",
        team: "",
        region: "",
      });
    }
  }, [user]);

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        team: form.team ? Number(form.team) : null,
        region: form.region ? Number(form.region) : null,
      };

      if (user?.id) {
        await updateUser(user.id, payload);
      } else {
        await createUser(payload);
      }

      onSuccess();
      onHide();
    } catch (err) {
      console.error("User save failed", err);
      alert("Failed to save user");
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
      <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6 z-10">

        <h2 className="text-xl font-semibold mb-4">
          {user ? "Edit User" : "Create User"}
        </h2>

        <div className="space-y-3">

          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          {!user && (
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          )}

          {/* ROLE */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="AGENT">Agent</option>
            <option value="TEAM_LEAD">Team Lead</option>
            <option value="QA">QA</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* REGION */}
          <select
            name="region"
            value={form.region}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* TEAM */}
          <select
            name="team"
            value={form.team}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
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

export default UserFormModal;