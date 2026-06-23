import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isActive = (path: string) => location.pathname === path;

  /* =========================
     CLOSE ON OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-brand-primary/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          {/* ================= LEFT LOGO ================= */}
          <div className="flex items-center gap-3">
            <img
              src="/Coat of Arms - Taifa logo iliiyopitishwa(4).png"
              className="h-11 w-auto object-contain"
              alt="logo"
            />
          </div>

          {/* ================= CENTER NAV ================= */}
          <nav className="flex items-center gap-2">

            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm rounded-lg transition ${
                    isActive("/")
                      ? "bg-white text-brand-primary font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/faqs"
                  className={`px-4 py-2 text-sm rounded-lg transition ${
                    isActive("/faqs")
                      ? "bg-white text-brand-primary font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
                >
                  FAQs
                </Link>
              </>
            )}
          </nav>

          {/* ================= RIGHT USER ================= */}
          <div className="flex items-center gap-4">

            {/* USER DROPDOWN */}
            {isAuthenticated && user && (
              <div ref={menuRef} className="relative">

                {/* TRIGGER */}
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl  transition"
                >
                  {/* avatar */}
                  <div className="w-9 h-9 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-sm">
                    {user.first_name?.charAt(0)}
                    {user.last_name?.charAt(0)}
                  </div>

                  {/* info */}
                  {/* <div className="text-left leading-tight">
                    <div className="text-sm font-semibold">
                      {user.rank} {user.first_name} {user.last_name}
                    </div>

                    <div className="text-[11px] text-white/70">
                      {typeof user.role === "string"
                        ? user.role
                        : user.role?.name}
                    </div>
                  </div> */}

                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* DROPDOWN */}
                {openMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">

                    {/* HEADER CARD */}
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <p className="font-semibold text-sm">
                        {user.rank} {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {typeof user.role === "string"
                          ? user.role
                          : user.role?.name}
                      </p>
                    </div>

                    {/* MENU ITEMS */}
                    <NavLink
                      to="/profile"
                      className="block px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      👤 My Profile
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      className="block px-4 py-3 text-sm hover:bg-gray-100"
                    >
                      🔒 Change Password
                    </NavLink>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* RIGHT LOGO */}
            {!isAuthenticated && (
            <img
              src="/POLICE LOGO - APP - PLAIN 2.png"
              className="h-11 w-auto object-contain"
              alt="police"
            />
          )}
          </div>

        </div>
      </div>
    </header>
  );
};