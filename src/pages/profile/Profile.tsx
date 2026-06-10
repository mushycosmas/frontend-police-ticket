import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500">
          View your account information (read-only from system)
        </p>
      </div>

      {/* TABS */}
      <div className="border-b mb-6">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-medium ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 text-sm font-medium ${
              activeTab === "security"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <div className="space-y-6">

          {/* USER HEADER CARD */}
          <div className="bg-gray-50 p-6 rounded-lg flex items-center gap-6">

            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.first_name?.charAt(0) ||
                user.username?.charAt(0) ||
                "U"}
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                {user.first_name} {user.last_name}
              </h2>

              <p className="text-sm text-gray-500">
                {user.role_name || user.role}
              </p>

              <p className="text-xs text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {/* INFO GRID (READ ONLY) */}
          <div className="bg-white border rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-xs text-gray-500">Check Number</p>
              <p className="font-medium">{user.username}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium">{user.phone || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Team</p>
              <p className="font-medium">{user.team_name || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Rank</p>
              <p className="font-medium">{user.rank || "-"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="font-medium">
                {user.date_joined
                  ? new Date(user.date_joined).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>

          {/* BIO */}
          <div className="bg-white border rounded-lg p-6">
            <p className="text-xs text-gray-500 mb-2">Bio</p>
            <p className="text-sm text-gray-700">
              {user.bio || "No bio available"}
            </p>
          </div>

        </div>
      )}

      {/* ================= SECURITY TAB ================= */}
      {activeTab === "security" && (
        <div className="space-y-6">

          {/* PASSWORD SECTION */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">
              Change Password
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Go to dedicated password page for security changes.
            </p>

            <a
              href="/change-password"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Change Password
            </a>
          </div>

          {/* SESSION INFO (READ ONLY) */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Active Session
            </h3>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="font-medium">Current Device</p>
                <p className="text-xs text-gray-500">
                  Browser Session
                </p>
              </div>

              <span className="text-green-600 text-xs font-medium">
                Active
              </span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};