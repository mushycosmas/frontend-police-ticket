import React, { useState } from "react";
import { CustomerList } from "../../components/customer/CustomerList";
import TicketViewModal from "../../components/tickets/TicketViewModal";

export const Customers: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Check if user has admin or team lead access
  if (user.role !== "ADMIN" && user.role !== "TEAM_LEAD") {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Access Denied. Only administrators and team leads can view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all customer information
          </p>
        </div>
      </div>

      {/* Customer List Component */}
      <CustomerList onViewTicket={handleViewTicket} />

      {/* Ticket View Modal */}
      <TicketViewModal
        show={showTicketModal}
        ticket={selectedTicket}
        onHide={() => {
          setShowTicketModal(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
};

export default Customers;