import React from "react";
import { Outlet } from "react-router-dom";

import {Header} from "./partials/Header";
import {Sidebar} from "./partials/Sidebar";
import {Footer} from "./partials/Footer";

const MainLayout = () => {
     return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* BODY AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default MainLayout;