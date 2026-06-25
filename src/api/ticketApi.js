import api from "./axios";
import publicApi from "./publicApi";
// ----------------------
// TICKETS CRUD
// ----------------------
export const getTickets = () =>
    api.get("/tickets/tickets/");

export const getTicket = (id) =>
    api.get(`/tickets/tickets/${id}/`);

export const createTicket = (data) =>
    api.post("/tickets/tickets/", data,{
        headers: {
      "Content-Type": "multipart/form-data",
    },
    });

export const updateTicket = (id, data) =>
    api.patch(`/tickets/tickets/tickets/${id}/`, data);

// export const deleteTicket = (id) =>
//     api.delete(`/tickets/tickets/tickets/${id}/`);


// Update ticket priority - uses the update endpoint
export const updateTicketPriority = (id, priority) =>
  api.patch(`/tickets/tickets/${id}/`, { priority });
// ----------------------
// TICKET ACTIONS


// Resolve ticket with optional comment
export const resolveTicket = (id, comment = '') =>
  api.post(`/tickets/tickets/${id}/resolve/`, {
    comment: comment?.trim() || null
  });

export const closeTicket = (id, comment = '') =>
  api.post(`/tickets/tickets/${id}/close/`, {
    comment: comment?.trim() || null
  });

 

// export const assignTicket = (id, data) =>
//     api.post(`/tickets/tickets/${id}/assign/`, data);

export const assignTicket = (id, data) => {
  if (!data?.type || !data?.id) {
    throw new Error("type and id are required for assignment");
  }

  return api.post(`/tickets/tickets/${id}/assign/`, {
    type: data.type,
    id: data.id,
  });
};

export const getMyTickets = () =>
    api.get("/tickets/tickets/?filter=my");

export const getAssignedTickets = () =>
    api.get("/tickets/?filter=assigned");

export const getUnassignedTickets = () =>
    api.get("/tickets/tickets/?filter=unassigned");

export const getClosedTickets = () =>
    api.get("/tickets/tickets/?filter=closed");


export const inprogressTickets = () =>
    api.get("/tickets/tickets/?filter= in-progress");


export const trackTickets = (ticket_number) => {
  
  return publicApi.get(`/tickets/tickets/track/?ticket_number=${ticket_number}`);
};


// api/ticketApi.ts
export const getOverdueTickets = async () => {
    // Fallback to getTickets since the backend endpoint doesn't exist
    return getTickets();
};

export const getAgingTickets = async () => {
    // Fallback to getTickets
    return getTickets();
};

// Soft delete a ticket (already existing, but ensures it uses soft delete)
export const deleteTicket = (id) => api.delete(`/tickets/tickets/${id}/`);

// Restore a soft‑deleted ticket
export const restoreTicket = (id) => api.post(`/tickets/tickets/${id}/restore/`);

// List all soft‑deleted tickets (admin only)
export const getDeletedTickets = (params) => api.get("/tickets/tickets/deleted/", { params });

// api/ticketApi.ts


export const returnTicket = (ticketId, data) =>
  api.post(`/tickets/tickets/${ticketId}/return/`, data);


export const updateTicketCategory = (ticketId, categoryId) => {
  return api.patch(`/tickets/tickets/${ticketId}/update_category/`, { category_id: categoryId });
};