import React from 'react';

interface TicketsHeaderProps {
  totalCount: number;
  onCreateClick: () => void;
}

export const TicketsHeader: React.FC<TicketsHeaderProps> = ({ 
  totalCount, 
  onCreateClick 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Tickets
        </h2>
        <p className="text-sm text-gray-500">
          {totalCount} total ticket{totalCount !== 1 ? 's' : ''}
        </p>
      </div>

      <button
        onClick={onCreateClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        ✚ New Ticket
      </button>
    </div>
  );
};