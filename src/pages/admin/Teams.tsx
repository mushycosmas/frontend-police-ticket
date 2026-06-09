import React, { useEffect, useMemo, useState } from "react";
import {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
} from "../../api/teamApi";
import { getUsers } from "../../api/userApi";

interface Team {
  id: number;
  name: string;
  description?: string;
  member_count?: number;
  lead_id?: number;
  lead_name?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  role: string;
  role_name?: string;
}

const ITEMS_PER_PAGE = 6;

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [teamLeads, setTeamLeads] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({
    name: "",
    description: "",
    lead_id: "",
  });

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTeams();
      
      // Handle different response structures
      let teamsData: Team[] = [];
      if (response && response.results) {
        teamsData = response.results;
      } else if (Array.isArray(response)) {
        teamsData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        teamsData = response.data;
      } else if (response && response.data && response.data.results) {
        teamsData = response.data.results;
      } else {
        teamsData = [];
      }
      
      setTeams(teamsData);
    } catch (err) {
      setError("Failed to load teams. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await getUsers();
      
      // Handle different response structures
      let usersData: User[] = [];
      if (response && response.results) {
        usersData = response.results;
      } else if (Array.isArray(response)) {
        usersData = response;
      } else if (response && response.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response && response.data && response.data.results) {
        usersData = response.data.results;
      } else {
        usersData = [];
      }
      
      setAllUsers(usersData);
      
      // Filter users who can be team leads (ADMIN or TEAM_LEAD)
      const leads = usersData.filter(
        (u: User) => u.role_name === "ADMIN" || u.role_name === "TEAM_LEAD" || u.role === "ADMIN" || u.role === "TEAM_LEAD"
      );
      setTeamLeads(leads);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const loadTeamMembers = async (teamId: number) => {
    try {
      const response = await getTeamMembers(teamId);
      
      // Handle different response structures
      let membersData: User[] = [];
      if (Array.isArray(response)) {
        membersData = response;
      } else if (response && response.results) {
        membersData = response.results;
      } else if (response && response.data && Array.isArray(response.data)) {
        membersData = response.data;
      } else {
        membersData = [];
      }
      
      setTeamMembers(membersData);
    } catch (err) {
      console.error("Failed to load team members:", err);
      setTeamMembers([]);
    }
  };

  useEffect(() => {
    loadTeams();
    loadAllUsers();
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter(
      (t) =>
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [teams, search]);

  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const paginatedTeams = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTeams.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTeams, page]);

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setForm({
      name: team.name || "",
      description: team.description || "",
      lead_id: team.lead_id?.toString() || "",
    });
    setShowModal(true);
  };

  const handleViewMembers = async (team: Team) => {
    setSelectedTeam(team);
    await loadTeamMembers(team.id);
    setShowMembersModal(true);
  };

  const handleDelete = async () => {
    if (!selectedTeam) return;
    try {
      await deleteTeam(selectedTeam.id);
      setShowDelete(false);
      setSelectedTeam(null);
      await loadTeams();
    } catch (err) {
      setError("Failed to delete team");
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        alert("Team name is required");
        return;
      }

      const teamData = {
        name: form.name,
        description: form.description,
        lead_id: form.lead_id ? parseInt(form.lead_id) : null,
      };

      if (selectedTeam) {
        await updateTeam(selectedTeam.id, teamData);
      } else {
        await createTeam(teamData);
      }

      setShowModal(false);
      setSelectedTeam(null);
      setForm({ name: "", description: "", lead_id: "" });
      await loadTeams();
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save team");
    }
  };

  const handleAddMember = async () => {
    if (!selectedMember || !selectedTeam) return;
    try {
      await addTeamMember(selectedTeam.id, selectedMember.id);
      await loadTeamMembers(selectedTeam.id);
      setSelectedMember(null);
      const selectElement = document.getElementById('member-select') as HTMLSelectElement;
      if (selectElement) selectElement.value = "";
      alert("Member added successfully");
    } catch (err) {
      console.error("Failed to add member:", err);
      alert("Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!selectedTeam) return;
    if (!confirm("Remove this member from the team?")) return;
    try {
      await removeTeamMember(selectedTeam.id, memberId);
      await loadTeamMembers(selectedTeam.id);
      alert("Member removed successfully");
    } catch (err) {
      console.error("Failed to remove member:", err);
      alert("Failed to remove member");
    }
  };

  const availableUsers = allUsers.filter(
    (user) => !teamMembers.some((member) => member.id === user.id)
  );

  const getUserDisplayName = (user: User): string => {
    return user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username;
  };

  const getUserRole = (user: User): string => {
    return user.role_name || user.role || "Unknown";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Teams</h2>
          <p className="text-sm text-gray-500 mt-1">Manage teams and their members</p>
        </div>
        <button
          onClick={() => {
            setSelectedTeam(null);
            setForm({ name: "", description: "", lead_id: "" });
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Team
        </button>
      </div>

      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search team by name or description..."
          className="w-full md:w-1/3 border px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
          <button onClick={loadTeams} className="ml-3 underline">Try Again</button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Loading teams...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 text-xs font-medium text-gray-500">ID</th>
                  <th className="p-3 text-xs font-medium text-gray-500">Team Name</th>
                  <th className="p-3 text-xs font-medium text-gray-500">Description</th>
                  <th className="p-3 text-xs font-medium text-gray-500">Members</th>
                  <th className="p-3 text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTeams.map((team) => (
                  <tr key={team.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 text-sm">{team.id}</td>
                    <td className="p-3 font-medium text-gray-800">{team.name}</td>
                    <td className="p-3 text-sm text-gray-600">{team.description || "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleViewMembers(team)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        {team.member_count || 0} Members
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(team)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeam(team);
                            setShowDelete(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && paginatedTeams.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>No teams found</p>
            <button
              onClick={() => {
                setSelectedTeam(null);
                setForm({ name: "", description: "", lead_id: "" });
                setShowModal(true);
              }}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Create your first team
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600">Page {page} of {totalPages} ({filteredTeams.length} total teams)</p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Team Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">{selectedTeam ? "Edit Team" : "Create Team"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team description"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Lead</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.lead_id}
                  onChange={(e) => setForm({ ...form, lead_id: e.target.value })}
                >
                  <option value="">Select Team Lead</option>
                  {teamLeads.map((user) => (
                    <option key={user.id} value={user.id}>
                      {getUserDisplayName(user)} ({getUserRole(user)})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedTeam(null);
                  setForm({ name: "", description: "", lead_id: "" });
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                {selectedTeam ? "Update" : "Create"} Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembersModal && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowMembersModal(false)}>
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedTeam.name}</h2>
                  <p className="text-sm text-gray-500">Team Members ({teamMembers.length})</p>
                </div>
                <button onClick={() => setShowMembersModal(false)} className="text-gray-500 hover:text-black text-2xl leading-none">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 border-b">
              <div className="flex gap-2">
                <select
                  id="member-select"
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedMember?.id || ""}
                  onChange={(e) => {
                    const userId = parseInt(e.target.value);
                    const user = availableUsers.find(u => u.id === userId);
                    setSelectedMember(user || null);
                  }}
                >
                  <option value="">Select a user to add...</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {getUserDisplayName(user)} ({getUserRole(user)})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!selectedMember}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Member
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No members in this team</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <div className="font-medium text-gray-800">{getUserDisplayName(member)}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                        <div className="text-xs text-gray-400 mt-1">Role: {getUserRole(member)}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t p-4 flex justify-end">
              <button onClick={() => setShowMembersModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDelete(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Delete Team</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-medium">"{selectedTeam?.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDelete(false);
                  setSelectedTeam(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                Delete Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;