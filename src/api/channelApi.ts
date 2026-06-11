import api from "./axios";

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
export const getChannels = () => api.get("/channels/channels/");

// Get single channel by id
export const getChannel = (id: number) =>
  api.get(`/channels/channels/${id}/`);

// Create channel
export const createChannel = (data: any) =>
  api.post("/channels/channels/", data);

// Update channel
export const updateChannel = (id: number, data: any) =>
  api.put(`/channels/channels/${id}/`, data);

// Patch channel
export const patchChannel = (id: number, data: any) =>
  api.patch(`/channels/channels/${id}/`, data);

// Delete channel
export const deleteChannel = (id: number) =>
  api.delete(`/channels/channels/${id}/`);