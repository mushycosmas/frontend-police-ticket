import { useState } from "react";
import { trackTickets } from "../api/ticketApi";
import { TicketStatusData, TicketUpdate, TicketStatus, Priority, UpdateType } from "../types/ticket.types";

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
      const apiTicket = res.data;
      
      // Map API response to TicketStatusData format
      const ticket: TicketStatusData = {
        id: apiTicket.id,
        ticket_number: apiTicket.ticket_number,
        title: apiTicket.title,
        description: apiTicket.description,
        status: apiTicket.status as TicketStatus,
        priority: apiTicket.priority as Priority,
        created_at: apiTicket.created_at,
        updated_at: apiTicket.updated_at,
        lastUpdate: apiTicket.updated_at || apiTicket.created_at,
        channel: apiTicket.channel,
        attachments: apiTicket.attachments || [],
        
        // Customer information
        customer_name: apiTicket.customer_detail?.customer_name || apiTicket.customer_name || 'N/A',
        customer_email: apiTicket.customer_detail?.customer_email || apiTicket.customer_email || 'N/A',
        customer_phone: apiTicket.customer_detail?.customer_phone || apiTicket.customer_phone || 'N/A',
        
        // Location fields
        street_name: apiTicket.street_name,
        location_full: apiTicket.location_full,
        
        // Assignment fields
        assigned_to_id: apiTicket.assigned_to || null,
        assigned_to_name: apiTicket.assigned_to_name || null,
        team_id: apiTicket.team || null,
      };
      
      // Generate updates based on ticket data
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
      
      // If ticket is resolved, add resolution update
      if (ticket.status === 'RESOLVED' && apiTicket.resolved_at) {
        updates.push({
          date: apiTicket.resolved_at,
          message: 'Ticket has been resolved',
          type: 'resolution',
          user: 'System'
        });
      }
      
      // If ticket is closed, add closure update
      if (ticket.status === 'CLOSED') {
        updates.push({
          date: ticket.updated_at || ticket.created_at,
          message: 'Ticket has been closed',
          type: 'resolution',
          user: 'System'
        });
      }
      
      // Add updates to ticket object
      ticket.updates = updates;
      
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