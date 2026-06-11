// src/hooks/useChannels.ts
import { useState, useEffect } from "react";
import { getChannels, Channel } from "../api/channelApi";

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await getChannels();
        // Normalize response (handles paginated or direct array)
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];
        setChannels(data);
      } catch (err) {
        setError("Failed to load channels");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  return { channels, loading, error };
};