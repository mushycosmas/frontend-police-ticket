import React from 'react';

interface ActionButtonsProps {
  ticketId: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ ticketId }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(ticketId);
    alert('Ticket ID copied to clipboard!');
  };

  return (
    <div className="flex gap-3 pt-4 border-t border-gray-200">
      <button 
        onClick={handlePrint}
        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Status
      </button>
      <button 
        onClick={handleCopyId}
        className="flex-1 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors rounded-lg font-medium text-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        Copy Ticket ID
      </button>
    </div>
  );
};