import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Header } from "./partials/Header";
import { Sidebar } from "./partials/Sidebar";
import { Footer } from "./partials/Footer";

const AppLayout: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close sidebar automatically on larger screens
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const publicRoutes = ["/", "/login", "/faqs", "/report"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Redirect to login if no token and not on public route
  if (!token && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  // If on public route, render minimal layout
  if (isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header isPublicRoute={true} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header with mobile toggle */}
      <Header 
        onMenuClick={toggleSidebar} 
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1 relative">
        {/* Mobile Overlay */}
        {isMobile && isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            ${isMobile ? 'fixed' : 'relative'}
            ${isMobile ? 'z-50' : 'z-30'}
            ${isMobile ? 'inset-y-0 left-0' : ''}
            ${isMobile ? 'w-72' : 'w-64'}
            ${isMobile ? 'transform transition-transform duration-300 ease-in-out' : ''}
            ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
            shrink-0 h-full
            ${isMobile ? 'shadow-2xl' : 'shadow-sm'}
          `}
        >
          <Sidebar 
            isMobile={isMobile} 
            onClose={closeSidebar}
          />
        </div>

        {/* Main Content */}
        <main
          className={`
            flex-1 overflow-auto transition-all duration-300
            ${isMobile ? 'p-3 sm:p-4' : 'p-6'}
            ${isMobile && isSidebarOpen ? 'opacity-50' : 'opacity-100'}
          `}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;