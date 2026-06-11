import publicApi from "./publicApi";

// =========================
// TYPE
// =========================
export interface Channel {
  id: number;
  name: string;
  status: "private" | "public";
  created_at?: string;
  updated_at?: string;
}

// Get all channels
export const getChannels = () => publicApi.get("/channels/channels/");

// Get single channel by id
export const getChannel = (id: number) =>
  publicApi.get(`/channels/channels/${id}/`);

// Create channel
export const createChannel = (data: any) =>
  publicApi.post("/channels/channels/", data);

// Update channel
export const updateChannel = (id: number, data: any) =>
  publicApi.put(`/channels/channels/${id}/`, data);

// Patch channel
export const patchChannel = (id: number, data: any) =>
  publicApi.patch(`/channels/channels/${id}/`, data);

// Delete channel
export const deleteChannel = (id: number) =>
  publicApi.delete(`/channels/channels/${id}/`);