import { useState } from 'react';
import { TicketStatusData } from '../types/ticket.types';

export const useTicketTracking = () => {
  const [trackId, setTrackId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketStatus, setTicketStatus] = useState<TicketStatusData | null>(null);

  const trackTicket = async () => {
    if (!trackId.trim()) {
      setError('Please enter a valid tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setTicketStatus(null);

    try {
      // API call here
      const response = await fetch(`/api/tickets/track/${trackId}`);
      const data = await response.json();
      setTicketStatus(data);
    } catch (err) {
      setError('Failed to fetch ticket status. Please check your tracking ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    trackId,
    setTrackId,
    loading,
    error,
    setError,
    ticketStatus,
    trackTicket
  };
};