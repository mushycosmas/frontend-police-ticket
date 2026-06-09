import React, { useEffect, useState } from "react";
import { createUser, updateUser } from "../../api/userApi";
import { Toast } from "../common/Toast";
import { getTeams } from "../../api/teamApi";
import { getRoles } from "../../api/roleApi";

interface Props {
  show: boolean;
  onHide: () => void;
  user: any;
  onSuccess: () => void;
}

const DEFAULT_PASSWORD = "support123";

/* =========================
   SAFE RESPONSE NORMALIZER
========================= */
const normalizeResponse = (res: any) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.results)) return res.data.results;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res)) return res;
  return [];
};

const UserFormModal: React.FC<Props> = ({
  show,
  onHide,
  user,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [toast, setToast] = useState<any>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role_id: "",
    team: "",
    rank: "",
    password: "",
    password_confirm: "",
  });

  /* =========================
     LOAD TEAMS
  ========================= */
  const loadTeams = async () => {
    try {
      const res = await getTeams();
      const data = normalizeResponse(res);
      setTeams(data);
    } catch (err) {
      console.error("loadTeams error:", err);
    }
  };

  /* =========================
     LOAD ROLES
  ========================= */
  const loadRoles = async () => {
    try {
      const res = await getRoles();
      const data = normalizeResponse(res);
      setRoles(data);
    } catch (err) {
      console.error("loadRoles error:", err);
    }
  };

  /* =========================
     INIT FORM
  ========================= */
  useEffect(() => {
    if (!show) return;

    loadTeams();
    loadRoles();

    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role_id: user.role_id || "",
        team: user.team || "",
        rank: user.rank || "",
        password: "",
        password_confirm: "",
      });
    } else {
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role_id: "",
        team: "",
        rank: "",
        password: DEFAULT_PASSWORD,
        password_confirm: DEFAULT_PASSWORD,
      });
    }
  }, [show, user]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role_id: formData.role_id ? Number(formData.role_id) : null,
        rank: formData.rank,
        team: formData.team ? Number(formData.team) : null,
      };

      if (!user) {
        await createUser({
          ...payload,
          password: formData.password || DEFAULT_PASSWORD,
          password_confirm: formData.password_confirm || DEFAULT_PASSWORD,
        });

        setToast({
          message: "User created successfully",
          type: "success",
        });
      } else {
        await updateUser(user.id, payload);

        setToast({
          message: "User updated successfully",
          type: "success",
        });
      }

      setTimeout(() => {
        onSuccess();
        onHide();
      }, 800);
    } catch (err: any) {
      setToast({
        message:
          err?.response?.data?.message || "Failed to save user",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onHide}
      >
        <div
          className="bg-white w-full max-w-lg rounded-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4">
            {user ? "Edit User" : "Create User (HRMIS Import)"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            {/* USERNAME */}
            <input
              name="username"
              placeholder="Check Number"
              value={formData.username}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            {/* EMAIL */}
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            {/* NAME */}
            <div className="flex gap-2">
              <input
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            {/* RANK */}
            <input
              name="rank"
              placeholder="Rank (e.g PC, SGT, INSPECTOR)"
              value={formData.rank}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            {/* ROLE */}
            <select
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* TEAM */}
            <select
              name="team"
              value={formData.team}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">No Team</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* PASSWORD (CREATE ONLY) */}
            {!user && (
              <>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />

                <input
                  name="password_confirm"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                />
              </>
            )}

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onHide}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Saving..." : user ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;