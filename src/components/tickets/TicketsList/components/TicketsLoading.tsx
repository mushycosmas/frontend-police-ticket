import React from 'react';

export const TicketsLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
};