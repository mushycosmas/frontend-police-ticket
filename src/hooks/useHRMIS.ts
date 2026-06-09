// src/hooks/useHRMIS.ts
import { useState, useCallback } from 'react';
import {
  fetchHRMISUser,
  fetchHRMISUserWithRetry,
  validateHRMISConnection,
  HRMISUser,
  HRMISResponse,
} from '../api/hrmisApi';

interface UseHRMISReturn {
  // State
  user: HRMISUser | null;
  loading: boolean;
  error: string | null;
  syncing: boolean;
  
  // Methods
  searchUser: (checkno: string) => Promise<HRMISUser | null>;
  searchUserWithRetry: (checkno: string, maxRetries?: number) => Promise<HRMISUser | null>;
  validateConnection: () => Promise<boolean>;
  clearError: () => void;
  clearUser: () => void;
  reset: () => void;
}

export const useHRMIS = (): UseHRMISReturn => {
  const [user, setUser] = useState<HRMISUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search single user by check number
  const searchUser = useCallback(async (checkno: string): Promise<HRMISUser | null> => {
    if (!checkno || !checkno.trim()) {
      setError('Check number is required');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response: HRMISResponse = await fetchHRMISUser(checkno);
      
      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      } else {
        setError(response.message || 'User not found in HRMIS');
        setUser(null);
        return null;
      }
    } catch (err: any) {
      console.error('HRMIS search error:', err);
      setError(err.message || 'Failed to search user');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Search user with retry mechanism
  const searchUserWithRetry = useCallback(async (
    checkno: string, 
    maxRetries: number = 3
  ): Promise<HRMISUser | null> => {
    if (!checkno || !checkno.trim()) {
      setError('Check number is required');
      return null;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response: HRMISResponse = await fetchHRMISUserWithRetry(checkno, maxRetries);
      
      if (response.success && response.data) {
        setUser(response.data);
        return response.data;
      } else {
        setError(response.message || 'User not found after multiple attempts');
        setUser(null);
        return null;
      }
    } catch (err: any) {
      console.error('HRMIS search with retry error:', err);
      setError(err.message || 'Failed to search user');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate HRMIS connection
  const validateConnection = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await validateHRMISConnection();
      if (!result.success) {
        setError(result.message || 'Cannot connect to HRMIS server');
      }
      return result.success;
    } catch (err: any) {
      console.error('HRMIS connection validation error:', err);
      setError(err.message || 'HRMIS connection failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear user
  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setUser(null);
    setError(null);
    setLoading(false);
    setSyncing(false);
  }, []);

  return {
    // State
    user,
    loading,
    error,
    syncing,
    
    // Methods
    searchUser,
    searchUserWithRetry,
    validateConnection,
    clearError,
    clearUser,
    reset,
  };
};