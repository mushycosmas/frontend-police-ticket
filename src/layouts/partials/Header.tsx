import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* =========================
   TYPES
========================= */
interface HeaderProps {
  onMenuClick?: () => void;
  isMobile?: boolean;
  isSidebarOpen?: boolean;
  isPublicRoute?: boolean;
}

/* =========================
   HEADER COMPONENT
========================= */
export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  isMobile = false,
  isSidebarOpen = false,
  isPublicRoute = false
}) => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     HELPERS
  ========================= */
  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  const getUserInitials = useCallback(() => {
    if (!user) return "U";
    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";
    return first || last || user.username?.charAt(0) || "U";
  }, [user]);

  const getUserDisplayName = useCallback(() => {
    if (!user) return "Guest";
    const rank = user.rank ? `${user.rank} ` : "";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${rank}${firstName} ${lastName}`.trim() || user.username || "User";
  }, [user]);

  const getUserRole = useCallback(() => {
    if (!user) return "";
    if (typeof user.role === "string") return user.role;
    if (user.role?.name) return user.role.name;
    return "";
  }, [user]);

  /* =========================
     EFFECTS
  ========================= */
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on mobile menu toggle
  useEffect(() => {
    if (isMobile) {
      setOpenMenu(false);
    }
  }, [isMobile]);

  /* =========================
     HANDLERS
  ========================= */
  const toggleMenu = useCallback(() => {
    setOpenMenu(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setOpenMenu(false);
    logout();
  }, [logout]);

  /* =========================
     RENDER
  ========================= */
  return (
    <header className="sticky top-0 z-50 bg-brand-primary/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">

          {/* ================= LEFT SECTION ================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Menu Toggle */}
            {!isPublicRoute && isMobile && (
              <button
                onClick={onMenuClick}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              >
                <svg 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}

            {/* Logo - Left */}
            <img
              src="/Coat of Arms - Taifa logo iliiyopitishwa(4).png"
              className="h-8 sm:h-9 lg:h-11 w-auto object-contain"
              alt="logo"
            />
          </div>

          {/* ================= CENTER NAV ================= */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {!isAuthenticated && (
              <>
                <Link
                  to="/"
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition ${
                    isActive("/")
                      ? "bg-white text-brand-primary font-semibold shadow"
                      : "hover:bg-white/10"
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/faqs"
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition ${
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

          {/* ================= RIGHT SECTION ================= */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Dropdown */}
            {isAuthenticated && user && (
              <div ref={menuRef} className="relative">
                {/* Trigger Button */}
                <button
                  onClick={toggleMenu}
                  className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl hover:bg-white/10 transition"
                  aria-expanded={openMenu}
                  aria-label="User menu"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-full bg-white text-brand-primary flex items-center justify-center font-bold text-xs sm:text-sm">
                    {getUserInitials()}
                  </div>

                  {/* User Info - Hidden on mobile */}
                  <div className="hidden sm:block text-left leading-tight">
                    <div className="text-xs lg:text-sm font-semibold truncate max-w-[120px] lg:max-w-[180px]">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-[10px] lg:text-[11px] text-white/70 truncate max-w-[120px] lg:max-w-[180px]">
                      {getUserRole()}
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${
                      openMenu ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openMenu && (
                  <div className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                    {/* Header Card */}
                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b">
                      <p className="font-semibold text-xs sm:text-sm truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        {getUserRole()}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <NavLink
                      to="/profile"
                      onClick={() => setOpenMenu(false)}
                      className="block px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                    >
                      👤 My Profile
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      onClick={() => setOpenMenu(false)}
                      className="block px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                    >
                      🔒 Change Password
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm hover:bg-red-50 text-red-600 transition-colors border-t"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Right Logo - Hidden on mobile */}
            {!isAuthenticated && (
              <img
                src="/POLICE LOGO - APP - PLAIN 2.png"
                className="h-8 sm:h-9 lg:h-11 w-auto object-contain hidden xs:block"
                alt="police"
              />
            )}

            {/* Login Button - Mobile */}
            {!isAuthenticated && isMobile && (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;