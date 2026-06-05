import { TicketStatus, Priority } from '../types/ticket.types';

export const getStatusColor = (status: TicketStatus) => {
  const colors = {
    // Backend uses UPPERCASE
    'OPEN': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-200',
    'RESOLVED': 'bg-green-100 text-green-800 border-green-200',
    'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200',
    
    // Keep lowercase for backward compatibility if needed
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    resolved: 'bg-green-100 text-green-800 border-green-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getStatusText = (status: TicketStatus) => {
  const texts = {
    // Backend uses UPPERCASE
    'OPEN': 'Open',
    'IN_PROGRESS': 'In Progress',
    'RESOLVED': 'Resolved',
    'CLOSED': 'Closed',
    
    // Keep lowercase for backward compatibility
    pending: 'Pending Review',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  };
  return texts[status] || status;
};

export const getPriorityColor = (priority?: Priority) => {
  const colors = {
    // Backend uses UPPERCASE
    'LOW': 'bg-gray-100 text-gray-700',
    'MEDIUM': 'bg-blue-100 text-blue-700',
    'HIGH': 'bg-orange-100 text-orange-700',
    'URGENT': 'bg-red-100 text-red-700',
    
    // Keep lowercase for backward compatibility
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };
  return priority ? colors[priority] : 'bg-gray-100 text-gray-700';
};

export const getPriorityText = (priority?: Priority) => {
  const texts = {
    // Backend uses UPPERCASE
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High',
    'URGENT': 'Urgent',
    
    // Keep lowercase for backward compatibility
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  };
  return priority ? texts[priority] : 'Not specified';
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};