export type ChannelStatus = "private" | "public";

export interface Team {
  id: number;
  name: string;
  description?: string;
}

export interface Channel {
  id: number;
  name: string;
  status: ChannelStatus;

  // IMPORTANT: allow undefined safely
  teamId?: number;

  team?: Team;

  created_at?: string;
  updated_at?: string;
}

export interface ChannelFormData {
  name: string;
  status: ChannelStatus;
  teamId: number;
}