import publicApi from "./publicApi";

// =========================
// TYPE (FRONTEND STYLE)
// =========================
export interface Channel {
  id: number;
  name: string;
  status: "private" | "public";

  teamId?: number;

  team?: {
    id: number;
    name: string;
    description?: string;
    department?: string;
  };

  created_at?: string;
  updated_at?: string;
}

// =========================
// GET
// =========================
export const getChannels = () =>
  publicApi.get("/channels/channels/");

export const getChannel = (id: number) =>
  publicApi.get(`/channels/channels/${id}/`);

// =========================
// CREATE (FIXED)
// =========================
export const createChannel = (data: {
  name: string;
  status: "private" | "public";
  teamId: number;
}) =>
  publicApi.post("/channels/channels/", {
    name: data.name,
    status: data.status,
    team_id: data.teamId, // ✅ convert here
  });

// =========================
// UPDATE (FIXED)
// =========================
export const updateChannel = (
  id: number,
  data: {
    name: string;
    status: "private" | "public";
    teamId: number;
  }
) =>
  publicApi.put(`/channels/channels/${id}/`, {
    name: data.name,
    status: data.status,
    team_id: data.teamId, // ✅ convert here
  });

// =========================
// PATCH
// =========================
export const patchChannel = (id: number, data: any) =>
  publicApi.patch(`/channels/channels/${id}/`, data);

// =========================
// DELETE
// =========================
export const deleteChannel = (id: number) =>
  publicApi.delete(`/channels/channels/${id}/`);