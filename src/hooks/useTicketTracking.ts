import { useState } from "react";
import { trackTickets } from "../api/ticketApi";
import { TicketStatusData, TicketUpdate } from "../types/ticket.types";

export const useTicketTracking = () => {
  const [trackId, setTrackId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticketStatus, setTicketStatus] = useState<TicketStatusData | null>(null);

  const trackTicket = async () => {
    if (!trackId.trim()) {
      setError("Please enter a valid ticket number");
      return;
    }

    setLoading(true);
    setError("");
    setTicketStatus(null);

    try {
      const res = await trackTickets(trackId);
      const ticket = res.data;
      
      // Generate mock updates based on ticket data
      const updates: TicketUpdate[] = [
        {
          date: ticket.created_at,
          message: `Ticket "${ticket.title}" was created`,
          type: 'info',
          user: ticket.customer_name
        },
        {
          date: ticket.created_at,
          message: `Priority set to ${ticket.priority}`,
          type: 'update',
          user: 'System'
        },
        {
          date: ticket.created_at,
          message: `Status: ${ticket.status}`,
          type: 'update',
          user: 'System'
        }
      ];
      
      // If there are attachments, add an update
      if (ticket.attachments && ticket.attachments.length > 0) {
        updates.push({
          date: ticket.created_at,
          message: `${ticket.attachments.length} attachment(s) added`,
          type: 'update',
          user: ticket.customer_name
        });
      }
      
      // Add to ticket object
      ticket.updates = updates;
      ticket.lastUpdate = ticket.updated_at || ticket.created_at;
      
      setTicketStatus(ticket);
    } catch (err: any) {
      console.error("Track error:", err);
      if (err.response?.status === 404) {
        setError(`Ticket "${trackId}" not found. Please check the ticket number.`);
      } else {
        setError("Failed to fetch ticket. Please check ticket number.");
      }
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
    trackTicket,
  };
};