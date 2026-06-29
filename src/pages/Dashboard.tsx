import React, { useEffect, useState, useCallback, useMemo } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { KPISection } from "../components/dashboard/KPISection";
import { RecentTickets } from "../components/dashboard/RecentTickets";
import { StatsSection } from "../components/dashboard/StatsSection";
import TicketViewModal from "../components/tickets/TicketViewModal";
import OverdueTicketsWidget from "../components/dashboard/OverdueTicketsWidget";

import {
  StatusDistribution,
  CategoryBreakdown,
  ChannelBreakdown,
  AgentWorkload,
  TimeStats,
  QuickFilters,
  TrendsWidget
} from "../components/dashboard/widgets";



import { useDashboardData } from "../hooks/useDashboardData";
import { useTicketFilters } from "../hooks/useTicketFilters";

export const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [showView, setShowView] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  
  const {
    stats,
    priorityStats,
    allTickets,
    filteredTickets,
    setFilteredTickets,
    loading,
    loadDashboard,
    ticketCounts
  } = useDashboardData();

  const { activeFilter, handleFilter } = useTicketFilters(allTickets, setFilteredTickets);

  const handleViewTicket = useCallback((ticket: any) => {
    setSelectedTicketId(ticket.id);
    setShowView(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowView(false);
    setSelectedTicketId(null);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader username={user?.username || user?.full_name || "User"} />
      <KPISection stats={stats} />
      
      <QuickFilters 
        onFilter={handleFilter} 
        activeFilter={activeFilter}
        ticketCounts={ticketCounts}
      />
      
      <div className="grid grid-cols-1 gap-6">
        <StatusDistribution tickets={filteredTickets} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown tickets={filteredTickets} />
        <ChannelBreakdown tickets={filteredTickets} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverdueTicketsWidget />
        <AgentWorkload tickets={filteredTickets} />
        <TimeStats tickets={filteredTickets} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTickets tickets={filteredTickets.slice(0, 5)} onViewTicket={handleViewTicket} />
        </div>
        <div>
          <TrendsWidget tickets={filteredTickets} />
        </div>
      </div>
      
      <StatsSection stats={stats} priorityStats={priorityStats} />
      
      <TicketViewModal
        show={showView}
        ticketId={selectedTicketId}
        onHide={handleCloseModal}
        onRefresh={loadDashboard}
      />
    </div>
  );
};

export default Dashboard;