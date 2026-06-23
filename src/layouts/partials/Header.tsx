import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-brand-primary text-white sticky top-0 z-50 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          {/* LEFT: Logo */}
          <div className="flex items-center">
            <img
              src="/Coat of Arms - Taifa logo iliiyopitishwa(4).png"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* CENTER: Navigation */}
          <nav className="flex items-center gap-4">

            <Link
              to="/"
              className={`text-sm px-3 py-2 rounded-md transition ${
                isActive("/")
                  ? "bg-white text-brand-primary font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              Home
            </Link>

            <Link
              to="/faqs"
              className={`text-sm px-3 py-2 rounded-md transition ${
                isActive("/faqs")
                  ? "bg-white text-brand-primary font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              FAQs
            </Link>

          </nav>

          {/* RIGHT: Logo */}
          <div className="flex items-center">
            <img
              src="/POLICE LOGO - APP - PLAIN 2.png"
              alt="Police Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

        </div>
      </div>
    </header>
  );
};