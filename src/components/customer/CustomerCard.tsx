import React from "react";
import { Customer } from "../../types/customer.types";

interface CustomerCardProps {
  customer: Customer;
  onClick: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onClick }) => {
  // Handle both naming conventions
  const displayName = customer.full_name || customer.customer_name || "Unknown";
  const displayEmail = customer.email || customer.customer_email || "N/A";
  const displayPhone = customer.phone || customer.customer_phone || "N/A";
  const totalTickets = customer.total_tickets || 0;
  const totalResolved = customer.total_resolved || 0;
  const totalOpen = customer.total_open || 0;

  return (
    <div 
      onClick={() => onClick(customer)}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">
            {displayName}
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-gray-400">📧</span> {displayEmail}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-gray-400">📞</span> {displayPhone}
            </p>
            {customer.company_name && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="text-gray-400">🏢</span> {customer.company_name}
              </p>
            )}
          </div>
        </div>
        
        {/* Stats Badges */}
        <div className="text-right">
          <div className="flex gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {totalTickets} Tickets
            </span>
          </div>
          <div className="flex gap-1 text-xs">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              ✓ {totalResolved}
            </span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              📬 {totalOpen}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};