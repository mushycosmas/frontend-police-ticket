import React, { useEffect, useState } from "react";
import { createUser, updateUser, getTeams } from "../../api/userApi";
import { Toast } from "../common/Toast";

interface UserFormModalProps {
  show: boolean;
  onHide: () => void;
  user: any;
  onSuccess: () => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  show,
  onHide,
  user,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "AGENT",
    team: "",
    password: "",
    password_confirm: "",
  });

  useEffect(() => {
    if (show) {
      loadTeams();
      if (user) {
        setFormData({
          username: user.username || "",
          email: user.email || "",
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          role: user.role || "AGENT",
          team: user.team?.id?.toString() || user.team_id?.toString() || "",
          password: "",
          password_confirm: "",
        });
      } else {
        setFormData({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          role: "AGENT",
          team: "",
          password: "",
          password_confirm: "",
        });
      }
    }
  }, [show, user]);

  const loadTeams = async () => {
    try {
      const res = await getTeams();
      // Handle both array and object response
      let teamsData = [];
      if (Array.isArray(res.data)) {
        teamsData = res.data;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        teamsData = res.data.results;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        teamsData = res.data.data;
      } else {
        teamsData = [];
      }
      setTeams(teamsData);
    } catch (err) {
      console.error("Failed to load teams:", err);
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username) {
      showToast("Username is required", "error");
      return;
    }
    if (!formData.email) {
      showToast("Email is required", "error");
      return;
    }
    
    if (!user && !formData.password) {
      showToast("Password is required for new user", "error");
      return;
    }
    
    if (!user && formData.password !== formData.password_confirm) {
      showToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        team: formData.team ? parseInt(formData.team) : null,
      };

      if (!user) {
        payload.password = formData.password;
        payload.password_confirm = formData.password_confirm;
        await createUser(payload);
        showToast("✓ User created successfully!", "success");
      } else {
        await updateUser(user.id, payload);
        showToast("✓ User updated successfully!", "success");
      }

      setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
    } catch (err: any) {
      console.error("Save error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save user";
      showToast(`✗ ${errorMessage}`, "error");
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

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onHide}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {user ? "Edit User" : "Create User"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AGENT">Agent</option>
                <option value="TEAM_LEAD">Team Lead</option>
                <option value="ADMIN">Admin</option>
                <option value="QA_ANALYST">QA Analyst</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            {!user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onHide}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  user ? "Update" : "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;