import React, { useState, useEffect } from "react";
import { Customer } from "../../types/customer.types";
import { getCustomers, searchCustomers } from "../../api/customerApi";
import { CustomerCard } from "./CustomerCard";
import { CustomerDetailModal } from "./CustomerDetailModal";

interface CustomerListProps {
  onViewTicket?: (ticket: any) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ onViewTicket }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomers();
      console.log("CustomerList API response:", res);
      
      // Handle different response structures
      let customersData = [];
      if (res.data && Array.isArray(res.data)) {
        customersData = res.data;
      } else if (res.data && res.data.results && Array.isArray(res.data.results)) {
        customersData = res.data.results;
      } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
        customersData = res.data.data;
      } else {
        customersData = [];
      }
      
      setCustomers(customersData);
    } catch (err: any) {
      console.error("Error loading customers:", err);
      setError(err.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadCustomers();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await searchCustomers(search);
      let customersData = [];
      if (res.data && Array.isArray(res.data)) {
        customersData = res.data;
      } else if (res.data && res.data.results && Array.isArray(res.data.results)) {
        customersData = res.data.results;
      } else {
        customersData = [];
      }
      setCustomers(customersData);
    } catch (err: any) {
      console.error("Error searching customers:", err);
      setError(err.message || "Failed to search customers");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    loadCustomers();
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={loadCustomers}
            className="mt-2 text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Customer Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p>No customers found</p>
          {search && (
            <button
              onClick={handleClearSearch}
              className="mt-2 text-blue-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onClick={setSelectedCustomer}
            />
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onViewTicket={onViewTicket}
      />
    </div>
  );
};