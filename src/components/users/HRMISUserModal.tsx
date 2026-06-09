// src/components/users/HRMISUserModal.tsx
import React, { useState, useEffect } from "react";
import { Team } from "../../types/team.types";
import { Role } from "../../types/roles.types";

/* =========================
   TYPES
========================= */
interface HRMISUserInfo {
  checkno: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  rank: string;
  profile_picture?: string | null;
  department?: string;
  phone?: string;
}

interface HRMISUserModalProps {
  show: boolean;
  onHide: () => void;
  teams: Team[];
  roles: Role[];
  onSuccess: () => void;
  onSearch: (checkno: string) => Promise<any>;
  onCreateUser: (payload: any) => Promise<any>;
}

/* =========================
   COMPONENT
========================= */
export const HRMISUserModal: React.FC<HRMISUserModalProps> = ({
  show,
  onHide,
  teams,
  roles,
  onSuccess,
  onSearch,
  onCreateUser,
}) => {
  const [checkno, setCheckno] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [searching, setSearching] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [hrmisUser, setHrmisUser] = useState<HRMISUserInfo | null>(null);

  /* =========================
     RESET
  ========================= */
  useEffect(() => {
    if (!show) {
      setCheckno("");
      setSelectedRoleId(null);
      setSelectedTeamId(null);
      setLocalError(null);
      setHrmisUser(null);
    }
  }, [show]);

  /* =========================
     DEFAULT ROLE
  ========================= */
  useEffect(() => {
    if (!roles?.length) return;

    if (selectedRoleId === null) {
      const defaultRole = roles.find((r) => r.name === "AGENT") || roles[0];
      if (defaultRole) setSelectedRoleId(defaultRole.id);
    }
  }, [roles, selectedRoleId]);

  /* =========================
     SEARCH HRMIS USER
  ========================= */
  const handleSearch = async () => {
    if (!checkno.trim()) {
      setLocalError("Enter check number");
      return;
    }
    
    setLocalError(null);
    setSearching(true);
    setHrmisUser(null);
    
    try {
      const response = await onSearch(checkno);
      
      console.log("Search response:", response);
      
      if (response && response.success && response.data) {
        const userData = response.data;
        
        const firstName = userData.fname || userData.first_name || "";
        const lastName = userData.lname || userData.last_name || "";
        const middleName = userData.mname || userData.middle_name || "";
        const fullName = `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, " ");
        
        setHrmisUser({
          checkno: userData.checkno,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName || `${firstName} ${lastName}`,
          email: userData.email,
          rank: userData.rank || userData.designation || "",
          profile_picture: userData.photo || userData.profile_picture || null,
          department: userData.department || "",
          phone: userData.phoneno || userData.phone || "",
        });
      } else {
        setLocalError(response?.message || "User not found in HRMIS");
      }
    } catch (err: any) {
      console.error("HRMIS search error:", err);
      setLocalError(err?.message || "Failed to search HRMIS. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  /* =========================
     SAVE USER
  ========================= */
  const handleSave = async () => {
    if (!hrmisUser) {
      setLocalError("No user data found. Please search first.");
      return;
    }
    
    if (!selectedRoleId) {
      setLocalError("Please select a role");
      return;
    }

    const role = roles.find((r) => r.id === selectedRoleId);
    if (!role) {
      setLocalError("Invalid role selected");
      return;
    }

    setSaving(true);
    setLocalError(null);

    try {
      const userPayload = {
        username: hrmisUser.checkno,
        email: hrmisUser.email,
        first_name: hrmisUser.first_name,
        last_name: hrmisUser.last_name,
        full_name: hrmisUser.full_name,
        rank: hrmisUser.rank,
        profile_picture: hrmisUser.profile_picture || null,
        role: role.name,
        team: selectedTeamId || null,
        password: "support123",
        confirm_password: "support123",
        is_active: true,
      };

      console.log("Creating user with payload:", userPayload);
      await onCreateUser(userPayload);
      onSuccess();
      onHide();
    } catch (err: any) {
      console.error("Error creating user:", err);
      setLocalError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create user"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const error = localError;

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* HEADER */}
        <div className="p-4 border-b bg-white flex-shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Add HRMIS User</h2>
            <button onClick={onHide} className="text-gray-500 hover:text-gray-700 text-xl">
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Search for an employee using their check number
          </p>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          
          {/* SEARCH SECTION */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Check Number
            </label>
            <div className="flex gap-2">
              <input
                value={checkno}
                onChange={(e) => setCheckno(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter check number (e.g., 113857824)"
                autoFocus
              />
              <button
                onClick={handleSearch}
                disabled={searching || !checkno.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 transition-colors"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* HRMIS USER INFO - Display when found */}
          {hrmisUser && (
            <div className="space-y-4 border rounded-lg overflow-hidden">
              {/* Header with Avatar */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
                <div className="flex items-center gap-3">
                  {hrmisUser.profile_picture ? (
                    <img
                      src={hrmisUser.profile_picture}
                      alt={hrmisUser.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {hrmisUser.first_name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {hrmisUser.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">{hrmisUser.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Username: <span className="font-mono font-semibold">{hrmisUser.checkno}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">First Name</label>
                    <p className="text-sm font-medium">{hrmisUser.first_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Last Name</label>
                    <p className="text-sm font-medium">{hrmisUser.last_name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Rank</label>
                    <p className="text-sm font-medium">{hrmisUser.rank || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Department</label>
                    <p className="text-sm font-medium">{hrmisUser.department || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Phone</label>
                    <p className="text-sm font-medium">{hrmisUser.phone || "N/A"}</p>
                  </div>
                </div>

                {/* Role & Team Selection */}
                <div className="mt-4 pt-4 border-t">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={selectedRoleId || ""}
                      onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a role...</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name.replace(/_/g, " ")} {r.description && `- ${r.description}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team (Optional)
                    </label>
                    <select
                      value={selectedTeamId || ""}
                      onChange={(e) =>
                        setSelectedTeamId(e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No Team</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Password Info */}
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Default Password</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Password: <strong>support123</strong>
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      User should change this after first login.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NO RESULT STATE */}
          {!hrmisUser && !searching && !error && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500">Enter a check number to search for an employee</p>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 flex-shrink-0">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hrmisUser || saving || !selectedRoleId}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRMISUserModal;