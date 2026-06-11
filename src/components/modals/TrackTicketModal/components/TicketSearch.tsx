import React from 'react';
import { Input } from '../../../common/Input';

interface TicketSearchProps {
  trackId: string;
  setTrackId: (value: string) => void;
  loading: boolean;
  onTrack: () => void;
}

export const TicketSearch: React.FC<TicketSearchProps> = ({
  trackId,
  setTrackId,
  loading,
  onTrack
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <Input 
            label="Search by Ticket Number, Phone, or NIDA" 
            variant="underline"
            value={trackId} 
            onChange={(e) => setTrackId(e.target.value)} 
            placeholder="e.g., TKT-12345678, 0712345678, or 1990010112345678"
            onKeyPress={(e) => e.key === 'Enter' && onTrack()}
            className="bg-white"
          />
        </div>
        <button 
          className="px-6 py-2.5 bg-brand-primary text-white hover:bg-brand-light transition-all rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50"
          onClick={onTrack}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Ticket'}
        </button>
      </div>
    </div>
  );
};