import React, { useState } from "react";

import { ErrorMessage } from "../common/ErrorMessage";
import { TicketSearch } from "./TrackTicketModal/components/TicketSearch";
import { TicketStatusCard } from "./TrackTicketModal/components/TicketStatusCard";
import { ActivityTimeline } from "./TrackTicketModal/components/ActivityTimeline";
import { ActionButtons } from "./TrackTicketModal/components/ActionButtons";
import { QuickTips } from "./TrackTicketModal/components/QuickTips";

import { useTicketTracking } from "../../hooks/useTicketTracking";

interface Props {
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';  // Add size option
}

export const TrackTicketModal: React.FC<Props> = ({ onClose, size = 'lg' }) => {
  const {
    trackId,
    setTrackId,
    loading,
    error,
    ticketStatus,
    trackTicket,
  } = useTicketTracking();

  // Size configurations
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw] w-[95vw] h-[90vh]'
  };

  // Height classes based on content
  const heightClasses = size === 'full' ? 'h-[90vh]' : 'max-h-[90vh]';

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-xl shadow-lg relative flex flex-col ${sizeClasses[size]} ${heightClasses} w-full`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER with close button */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold">
            Track Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* SEARCH */}
          <TicketSearch
            trackId={trackId}
            setTrackId={setTrackId}
            onTrack={trackTicket}
            loading={loading}
          />

          {/* ERROR */}
          {error && <ErrorMessage message={error} />}

          {/* LOADING */}
          {loading && (
            <div className="text-center text-gray-500 py-8">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2">Loading ticket...</p>
            </div>
          )}

          {/* CONTENT */}
          {ticketStatus && !loading && (
            <div className="space-y-4">
              <TicketStatusCard ticket={ticketStatus} />
              <ActivityTimeline updates={ticketStatus?.updates || []} />
              <ActionButtons ticketId={trackId} />
            </div>
          )}

          {/* EMPTY STATE */}
          {/* {!ticketStatus && !loading && !error && (
            <div className="text-center text-gray-500 py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p>Enter a ticket ID to track its status</p>
            </div>
          )} */}

          {/* QUICK TIPS */}
          <QuickTips />
        </div>

        {/* FOOTER (optional) */}
        <div className="border-t p-4 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};