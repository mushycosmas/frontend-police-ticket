import React from 'react';

interface TicketsEmptyProps {
  hasFilters: boolean;
  onClearFilters: () => void;
}

export const TicketsEmpty: React.FC<TicketsEmptyProps> = ({ 
  hasFilters, 
  onClearFilters 
}) => {
  return (
    <div className="text-center py-10 text-gray-500">
      {hasFilters ? (
        <div>
          <p>No tickets match your filters.</p>
          <button
            onClick={onClearFilters}
            className="mt-2 text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
};