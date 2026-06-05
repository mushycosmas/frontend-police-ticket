import React from 'react';
import { ErrorMessage } from '../../common/ErrorMessage';
import { TicketSearch } from './components/TicketSearch';
import { TicketStatusCard } from './components/TicketStatusCard';
import { ActivityTimeline } from './components/ActivityTimeline';
import { ActionButtons } from './components/ActionButtons';
import { QuickTips } from './components/QuickTips';
import { useTicketTracking } from '../../../hooks/useTicketTracking';

interface TrackTicketModalProps {
  onClose: () => void;
}

export const TrackTicketModal: React.FC<TrackTicketModalProps> = ({ onClose }) => {
  const {
    trackId,
    setTrackId,
    loading,
    error,
    setError,
    ticketStatus,
    trackTicket
  } = useTicketTracking();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-gradient-to-r from-brand-primary to-brand-light">
          <div>
            <h2 className="text-xl font-bold text-white">Track Your Ticket</h2>
            <p className="text-white/80 text-sm mt-1">
              Check the status and updates of your support request
            </p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <TicketSearch 
              trackId={trackId}
              setTrackId={setTrackId}
              loading={loading}
              onTrack={trackTicket}
            />

            <ErrorMessage message={error} onClose={() => setError('')} />

            {ticketStatus && (
              <>
                <TicketStatusCard ticket={ticketStatus} />
                <ActivityTimeline updates={ticketStatus.updates} />
                <ActionButtons ticketId={ticketStatus.id} />
              </>
            )}

            {!ticketStatus && !loading && !error && <QuickTips />}
          </div>
        </div>
      </div>
    </div>
  );
};