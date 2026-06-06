import React, { useState, useEffect } from "react";
import { Customer, CustomerTicket } from "../../types/customer.types";
import { getCustomerTickets } from "../../api/customerApi";
import { StatusBadge, PriorityBadge } from "../common/Badge";
import { timeAgo } from "../../utils/helpers";

interface CustomerDetailModalProps {
  customer: Customer | null;
  onClose: () => void;
  onViewTicket?: (ticket: CustomerTicket) => void;
}

export const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ 
  customer, 
  onClose, 
  onViewTicket 
}) => {
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (customer) {
      loadCustomerTickets();
    }
  }, [customer]);

  const loadCustomerTickets = async () => {
    if (!customer) return;
    
    setLoading(true);
    try {
      const res = await getCustomerTickets(customer.id);
      // Handle different response structures
      let ticketsData: CustomerTicket[] = [];
      if (Array.isArray(res.data)) {
        ticketsData = res.data;
      } else if (res.data?.results && Array.isArray(res.data.results)) {
        ticketsData = res.data.results;
      } else {
        ticketsData = [];
      }
      setTickets(ticketsData);
    } catch (err) {
      console.error("Error loading customer tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "OPEN").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length,
    closed: tickets.filter(t => t.status === "CLOSED").length,
  };

  if (!customer) return null;

  // Get customer name from either field
  const customerName = customer.full_name || customer.customer_name || "Unknown";
  const customerEmail = customer.email || customer.customer_email || "N/A";
  const customerPhone = customer.phone || customer.customer_phone || "N/A";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-lg w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{customerName}</h2>
            <p className="text-sm text-gray-500 mt-1">Customer Details & Tickets</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl">
            ✕
          </button>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 block">Email</label>
              <p className="text-sm text-gray-800">{customerEmail}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 block">Phone</label>
              <p className="text-sm text-gray-800">{customerPhone}</p>
            </div>
            {customer.company_name && (
              <div>
                <label className="text-xs text-gray-500 block">Company</label>
                <p className="text-sm text-gray-800">{customer.company_name}</p>
              </div>
            )}
            {customer.address && (
              <div className="md:col-span-3">
                <label className="text-xs text-gray-500 block">Address</label>
                <p className="text-sm text-gray-800">
                  {customer.address}, {customer.city}, {customer.country}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-5 gap-2 p-4 bg-white border-b">
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
            <div className="text-xs text-gray-600">Open</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
            <div className="text-xs text-gray-600">Closed</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 p-4 border-b overflow-x-auto">
          {["all", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === status 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All Tickets" : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No tickets found</div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onViewTicket?.(ticket)}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-blue-600">
                          {ticket.ticket_number}
                        </span>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <h4 className="font-medium text-gray-800">{ticket.title}</h4>
                      {ticket.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {ticket.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>Created: {timeAgo(ticket.created_at)}</span>
                        {ticket.assigned_to_name && (
                          <span>Assigned to: {ticket.assigned_to_name}</span>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};