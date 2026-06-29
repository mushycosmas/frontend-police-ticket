import { useState, useCallback } from 'react';

export const useTicketFilters = (allTickets: any[], setFilteredTickets: (tickets: any[]) => void) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterTickets = useCallback((tickets: any[], filter: string) => {
    if (filter === 'all') return tickets;
    
    if (filter === 'critical') return tickets.filter(t => t.priority === 'CRITICAL');
    if (filter === 'high') return tickets.filter(t => t.priority === 'HIGH');
    if (filter === 'medium') return tickets.filter(t => t.priority === 'MEDIUM');
    if (filter === 'low') return tickets.filter(t => t.priority === 'LOW');
    
    if (filter === 'open') return tickets.filter(t => t.status === 'OPEN');
    if (filter === 'assigned') return tickets.filter(t => t.status === 'ASSIGNED');
    if (filter === 'in_progress') return tickets.filter(t => t.status === 'IN_PROGRESS');
    if (filter === 'resolved') return tickets.filter(t => t.status === 'RESOLVED');
    if (filter === 'closed') return tickets.filter(t => t.status === 'CLOSED');
    if (filter === 'reopened') return tickets.filter(t => t.status === 'REOPENED');
    
    return tickets;
  }, []);

  const handleFilter = useCallback((filterValue: string) => {
    setActiveFilter(filterValue);
    const filtered = filterTickets(allTickets, filterValue);
    setFilteredTickets(filtered);
  }, [allTickets, filterTickets, setFilteredTickets]);

  return { activeFilter, handleFilter };
};