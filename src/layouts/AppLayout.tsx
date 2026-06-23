import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Header } from "./partials/Header";
import { Sidebar } from "./partials/Sidebar";
import { Footer } from "./partials/Footer";

const AppLayout: React.FC = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  const publicRoutes = ["/", "/login", "/faqs", "/report"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (!token && !isPublicRoute) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <Header />

      <div className="flex flex-1">

        {!isPublicRoute && (
          <div className="w-64 shrink-0">
            <Sidebar />
          </div>
        )}

      
        <main
          className={`flex-1 overflow-auto ${
            isPublicRoute ? "p-0" : "p-6"
          }`}
        >
          <Outlet />
        </main>

      </div>

      <Footer />
    </div>
  );
};

export default AppLayout;