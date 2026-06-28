// hooks/useTeams.ts
import { useState, useEffect, useCallback } from "react";
import { getAllTeams, Team, normalizeList } from "../api/teamApi";

interface UseTeamsReturn {
  teams: Team[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getTeamById: (id: number) => Team | undefined;
  getTeamName: (id: number) => string;
  getTeamsByStatus: (status: string) => Team[];
}

export const useTeams = (): UseTeamsReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllTeams();
      
      // Use the normalizeList helper
      const data = normalizeList({ data: response });
      setTeams(data);
    } catch (err) {
      setError("Failed to load teams. Please try again.");
      console.error("Error fetching teams:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Helper to get team by ID
  const getTeamById = useCallback((id: number): Team | undefined => {
    return teams.find(team => team.id === id);
  }, [teams]);

  // Helper to get team name by ID
  const getTeamName = useCallback((id: number): string => {
    const team = teams.find(t => t.id === id);
    return team?.name || 'No Team';
  }, [teams]);

  // Helper to get teams by status
  const getTeamsByStatus = useCallback((status: string): Team[] => {
    if (!status || status === 'all') return teams;
    return teams.filter(team => team.status === status);
  }, [teams]);

  // Helper to search teams
  const searchTeams = useCallback((query: string): Team[] => {
    if (!query.trim()) return teams;
    const searchLower = query.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(searchLower) ||
      team.description?.toLowerCase().includes(searchLower) ||
      team.department?.toLowerCase().includes(searchLower)
    );
  }, [teams]);

  // Helper to get team member count
  const getMemberCount = useCallback((teamId: number): number => {
    const team = teams.find(t => t.id === teamId);
    return team?.member_count || 0;
  }, [teams]);

  // Helper to check if team exists
  const teamExists = useCallback((id: number): boolean => {
    return teams.some(team => team.id === id);
  }, [teams]);

  return { 
    teams, 
    loading, 
    error, 
    refetch: fetchTeams,
    getTeamById,
    getTeamName,
    getTeamsByStatus,
    
  };
};