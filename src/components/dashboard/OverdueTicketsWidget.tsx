// components/dashboard/OverdueTicketsWidget.tsx
import React, { useEffect, useState } from 'react';
import { getTickets } from '../../api/ticketApi';
import { useNavigate } from 'react-router-dom';

interface OverdueTicket {
  id: number;
  ticket_number: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  days_old: number;
  assigned_to_name: string | null;
  customer_name: string | null;
}

const OverdueTicketsWidget: React.FC = () => {
  const [tickets, setTickets] = useState<OverdueTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOverdueTickets();
  }, []);

  const fetchOverdueTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the existing getTickets function
      const response = await getTickets();
      
      // Handle different response structures
      let allTickets: any[] = [];
      if (Array.isArray(response.data)) {
        allTickets = response.data;
      } else if (response.data?.results) {
        allTickets = response.data.results;
      } else {
        allTickets = [];
      }
      
      console.log("All tickets for overdue calculation:", allTickets.length);
      
      // Calculate days old and filter tickets older than 2 days that are OPEN
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      const overdueTickets = allTickets
        .filter((ticket: any) => {
          if (!ticket.created_at) return false;
          const createdDate = new Date(ticket.created_at);
          const isOverdue = createdDate < twoDaysAgo;
          // Only include OPEN status tickets
          const isOpen = ticket.status === 'OPEN';
          return isOverdue && isOpen;
        })
        .map((ticket: any) => {
          const createdDate = new Date(ticket.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - createdDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Get customer name from different possible locations
          let customerName = null;
          if (ticket.customer_detail?.customer_name) {
            customerName = ticket.customer_detail.customer_name;
          } else if (ticket.customer_name) {
            customerName = ticket.customer_name;
          } else if (ticket.customer?.full_name) {
            customerName = ticket.customer.full_name;
          }
          
          return {
            id: ticket.id,
            ticket_number: ticket.ticket_number,
            title: ticket.title,
            status: ticket.status,
            priority: ticket.priority,
            created_at: ticket.created_at,
            days_old: diffDays,
            assigned_to_name: ticket.assigned_to_name || ticket.assigned_to?.full_name || null,
            customer_name: customerName,
          };
        })
        .sort((a: OverdueTicket, b: OverdueTicket) => b.days_old - a.days_old); // Sort by oldest first
      
      console.log("Overdue OPEN tickets found:", overdueTickets.length);
      setTickets(overdueTickets);
    } catch (err) {
      console.error('Failed to fetch overdue tickets:', err);
      setError('Failed to load overdue tickets');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'CRITICAL': 'bg-red-100 text-red-800',
      'P1_CRITICAL': 'bg-red-100 text-red-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'P2_HIGH': 'bg-orange-100 text-orange-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'P3_MEDIUM': 'bg-yellow-100 text-yellow-800',
      'LOW': 'bg-green-100 text-green-800',
      'P4_LOW': 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'OPEN': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'ESCALATED': 'bg-red-100 text-red-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'CLOSED': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getDaysBadge = (days: number) => {
    if (days >= 7) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">⚠️ {days} days</span>;
    } else if (days >= 3) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white">⏰ {days} days</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">📋 {days} days</span>;
    }
  };

  const handleTicketClick = (ticketId: number) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-32">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading overdue tickets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-500">{error}</div>
        <button 
          onClick={fetchOverdueTickets}
          className="mt-3 text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Overdue Tickets (OPEN)
          </h3>
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
            All caught up!
          </span>
        </div>
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-green-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No overdue OPEN tickets</p>
          <p className="text-sm text-gray-400">All open tickets are within SLA (2 days)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b bg-gradient-to-r from-red-50 to-orange-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              Overdue OPEN Tickets (Exceeded 2 Days)
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Open tickets that have been pending for more than 2 days without resolution
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {tickets.length} Overdue
            </span>
            <button
              onClick={fetchOverdueTickets}
              className="text-gray-500 hover:text-gray-700"
              title="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {ticket.ticket_number}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {ticket.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {ticket.customer_name || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(ticket.created_at)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getDaysBadge(ticket.days_old)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority?.replace('P1_', '').replace('P2_', '').replace('P3_', '').replace('P4_', '') || ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {ticket.assigned_to_name || 'Unassigned'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t bg-gray-50">
        <button
          onClick={() => navigate('/tickets?status=OPEN')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all open tickets →
        </button>
      </div>
    </div>
  );
};

export default OverdueTicketsWidget;