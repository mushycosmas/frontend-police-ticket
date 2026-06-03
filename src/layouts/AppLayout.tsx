import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { Header } from "./partials/Header";
import { Sidebar } from "./partials/Sidebar";
import { Footer } from "./partials/Footer";

const AppLayout: React.FC = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <Header />

      {/* Middle Section */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default AppLayout;