// C:\Users\Hp\Desktop\1frontend\src\components\modals\TrackTicketModal.tsx
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { ErrorMessage } from '../common/ErrorMessage';

interface TrackTicketModalProps {
  onClose: () => void;
}

interface TicketStatus {
  id: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  createdAt: string;
  lastUpdate: string;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  updates: Array<{
    date: string;
    message: string;
    type: 'info' | 'update' | 'resolution';
    user?: string;
  }>;
}

export const TrackTicketModal: React.FC<TrackTicketModalProps> = ({ onClose }) => {
  const [trackId, setTrackId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticketStatus, setTicketStatus] = useState<TicketStatus | null>(null);

  const handleTrackTicket = async () => {
    if (!trackId.trim()) {
      setError('Please enter a valid tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setTicketStatus(null);

    try {
      // TODO: Replace with actual API call to your backend
      // const response = await ticketService.trackTicket(trackId);
      // setTicketStatus(response.data);
      
      // Mock data for demonstration purposes
      // Remove this mock data when connecting to real API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockStatus: TicketStatus = {
        id: trackId,
        status: 'in-progress',
        title: 'Network connectivity issue in office',
        description: 'Unable to connect to company network from workstations on the 3rd floor.',
        createdAt: '2024-01-15T10:30:00Z',
        lastUpdate: '2024-01-16T14:20:00Z',
        assignedTo: 'IT Support Team',
        priority: 'high',
        updates: [
          {
            date: '2024-01-15T10:30:00Z',
            message: 'Ticket created successfully',
            type: 'info',
            user: 'System'
          },
          {
            date: '2024-01-15T10:35:00Z',
            message: 'Ticket verification completed',
            type: 'update',
            user: 'System'
          },
          {
            date: '2024-01-15T14:15:00Z',
            message: 'Ticket assigned to IT Support Team for investigation',
            type: 'update',
            user: 'Admin'
          },
          {
            date: '2024-01-16T09:00:00Z',
            message: 'Technician dispatched to investigate the network issue',
            type: 'update',
            user: 'John Doe'
          },
          {
            date: '2024-01-16T14:20:00Z',
            message: 'Network hardware identified as potential cause. New router being configured.',
            type: 'update',
            user: 'John Doe'
          }
        ]
      };
      
      setTicketStatus(mockStatus);
      
    } catch (err) {
      setError('Failed to fetch ticket status. Please check your tracking ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TicketStatus['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status];
  };

  const getStatusText = (status: TicketStatus['status']) => {
    const texts = {
      pending: 'Pending Review',
      'in-progress': 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed'
    };
    return texts[status];
  };

  const getPriorityColor = (priority?: TicketStatus['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-blue-100 text-blue-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700'
    };
    return priority ? colors[priority] : 'bg-gray-100 text-gray-700';
  };

  const getPriorityText = (priority?: TicketStatus['priority']) => {
    const texts = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent'
    };
    return priority ? texts[priority] : 'Not specified';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'update':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'resolution':
        return (
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in-up">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 bg-gradient-to-r from-brand-primary to-brand-light">
          <div>
            <h2 className="text-xl font-bold text-white">
              Track Your Ticket
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Check the status and updates of your support request
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            
            {/* Search Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input 
                    label="Ticket Tracking ID" 
                    variant="underline"
                    value={trackId} 
                    onChange={(e) => setTrackId(e.target.value)} 
                    placeholder="e.g., TKT-12345678 or TKT-ABCD1234"
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackTicket()}
                    className="bg-white"
                  />
                </div>
                <button 
                  className="px-6 py-2.5 bg-brand-primary text-white hover:bg-brand-light transition-all rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-md"
                  onClick={handleTrackTicket}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tracking...
                    </span>
                  ) : (
                    'Track Ticket'
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <ErrorMessage message={error} onClose={() => setError('')} />

            {/* Ticket Status Display */}
            {ticketStatus && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Status Header Card */}
                <div className="bg-gradient-to-r from-brand-primary/5 to-transparent p-6 rounded-xl border-2 border-brand-primary/20">
                  <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{ticketStatus.title}</h3>
                      <p className="text-sm text-gray-600 mt-2">{ticketStatus.description}</p>
                      <p className="text-xs text-gray-500 mt-3 font-mono">ID: {ticketStatus.id}</p>
                    </div>
                    <div className="flex gap-2">
                      {ticketStatus.priority && (
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(ticketStatus.priority)}`}>
                          {getPriorityText(ticketStatus.priority)} Priority
                        </div>
                      )}
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(ticketStatus.status)}`}>
                        {getStatusText(ticketStatus.status)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Created</p>
                      <p className="text-sm font-semibold text-gray-700 mt-1">{formatDate(ticketStatus.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Last Update</p>
                      <p className="text-sm font-semibold text-gray-700 mt-1">{formatDate(ticketStatus.lastUpdate)}</p>
                    </div>
                    {ticketStatus.assignedTo && (
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Assigned To</p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">{ticketStatus.assignedTo}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Timeline */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Activity Timeline
                  </h4>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {ticketStatus.updates.map((update, index) => (
                      <div key={index} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                            {getTypeIcon(update.type)}
                          </div>
                          {index < ticketStatus.updates.length - 1 && (
                            <div className="w-0.5 h-full bg-gradient-to-b from-brand-primary/30 to-transparent mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="bg-gray-50 rounded-lg p-4 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                              <p className="text-xs text-gray-500 font-medium">
                                {formatDate(update.date)}
                              </p>
                              {update.user && (
                                <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                                  {update.user}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{update.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      // TODO: Implement print functionality
                      window.print();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                    </svg>
                    Print Status
                  </button>
                  <button 
                    onClick={() => {
                      // TODO: Implement share functionality
                      navigator.clipboard.writeText(ticketStatus.id);
                      alert('Ticket ID copied to clipboard!');
                    }}
                    className="flex-1 px-4 py-2 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                    </svg>
                    Copy Ticket ID
                  </button>
                </div>

                {/* Help Section */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Need more help?</p>
                      <p className="text-sm text-blue-800 mt-1">
                        If you have additional questions about this ticket, please contact our support team at 
                        <a href="mailto:support@example.com" className="font-bold underline ml-1 hover:text-blue-900">
                          support@example.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips (shown when no ticket is being tracked) */}
            {!ticketStatus && !loading && !error && (
              <div className="bg-gray-50 rounded-xl p-5">
                <h5 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                  Quick Tips
                </h5>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary font-bold">•</span>
                    Your tracking ID was sent to your email when you created the ticket
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary font-bold">•</span>
                    Tracking IDs are case-sensitive - please enter exactly as received
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary font-bold">•</span>
                    Updates are usually posted within 24-48 hours of ticket creation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-brand-primary font-bold">•</span>
                    You can bookmark this page to easily check back for updates
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};