import React, { useEffect, useState, useMemo, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import LogoutButton from "../../components/common/LogoutButton";
import { useAuth } from "../../context/AuthContext";

/* =========================
   TYPES
========================= */
type MenuChild = {
  to: string;
  label: string;
  permission: string;
};

type MenuGroup = {
  label: string;
  icon: string;
  permission: string;
  children: MenuChild[];
};

/* =========================
   MENU DATA
========================= */
const menuGroups: MenuGroup[] = [
  {
    label: "Dashboard",
    icon: "⊞",
    permission: "view_dashboard",
    children: [
      { to: "/dashboard", label: "Dashboard", permission: "view_dashboard" },
    ],
  },
  {
    label: "Tickets",
    icon: "🎫",
    permission: "view_ticket",
    children: [
      { to: "/tickets", label: "All Tickets", permission: "view_ticket" },
      { to: "/admin/deleted-tickets", label: "Deleted Tickets", permission: "view_deleted_ticket" },
    ],
  },
  {
    label: "Customers",
    icon: "👥",
    permission: "view_customer",
    children: [
      { to: "/customers", label: "All Customers", permission: "view_customer" },
    ],
  },
  {
    label: "QA Review",
    icon: "✓",
    permission: "qa_review",
    children: [
      { to: "/qa", label: "QA Review", permission: "qa_review" },
    ],
  },
  {
    label: "Reports",
    icon: "📈",
    permission: "view_report",
    children: [
      { to: "/reports", label: "Reports", permission: "view_report" },
      { to: "/analytics", label: "Analytics", permission: "view_report" },
    ],
  },
  {
    label: "Administration",
    icon: "⚙️",
    permission: "view_user",
    children: [
      { to: "/admin/roles", label: "Roles", permission: "view_role" },
      { to: "/admin/permissions", label: "Permissions", permission: "view_permission" },
      { to: "/admin/users", label: "Users", permission: "view_user" },
      { to: "/admin/teams", label: "Teams", permission: "view_team" },
      { to: "/admin/categories", label: "Categories", permission: "view_category" },
      { to: "/admin/channels", label: "Channels", permission: "view_channel" },
      { to: "/admin/priorities", label: "Priorities", permission: "view_priority" },
      { to: "/admin/issue-templates", label: "Issue Templates", permission: "view_issuetemplate" },
      { to: "/admin/faqs", label: "FAQ", permission: "view_faq" },
    ],
  },
  {
    label: "Locations",
    icon: "🌍",
    permission: "view_location",
    children: [
      { to: "/admin/locations/regions", label: "Regions", permission: "view_region" },
      { to: "/admin/locations/districts", label: "Districts", permission: "view_district" },
      { to: "/admin/locations/wards", label: "Wards", permission: "view_ward" },
      { to: "/admin/locations/streets", label: "Streets", permission: "view_street" },
    ],
  },
  {
    label: "System",
    icon: "⚙️",
    permission: "view_settings",
    children: [
      { to: "/settings", label: "Settings", permission: "view_settings" },
      { to: "/logs", label: "System Logs", permission: "view_logs" },
    ],
  },
];

/* =========================
   SIDEBAR COMPONENT
========================= */
interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isMobile = false, 
  onClose 
}) => {
  const location = useLocation();
  const { user, permissions } = useAuth();

  /* =========================
     ROLE NORMALIZER
  ========================= */
  const normalizeRole = useCallback((role: any): string => {
    if (!role) return "UNKNOWN";

    if (typeof role === "string") {
      return role.trim().toUpperCase();
    }

    if (typeof role === "object" && role.name) {
      return role.name.trim().toUpperCase();
    }

    return String(role).trim().toUpperCase();
  }, []);

  const userRole = useMemo(() => normalizeRole(user?.role), [user?.role, normalizeRole]);

  /* =========================
     PERMISSION CHECK
  ========================= */
  const hasPermission = useCallback((perm: string): boolean => {
    if (!perm) return true;
    if (!Array.isArray(permissions)) return false;
    if (permissions.includes("*")) return true;
    return permissions.includes(perm);
  }, [permissions]);

  /* =========================
     FILTER MENU
  ========================= */
  const filteredMenuGroups = useMemo(() => {
    return menuGroups
      .map((group) => {
        const filteredChildren = group.children.filter((child) =>
          hasPermission(child.permission)
        );
        return { ...group, children: filteredChildren };
      })
      .filter((group) => group.children.length > 0);
  }, [hasPermission]);

  /* =========================
     INITIAL OPEN STATE
  ========================= */
  const getInitialOpenState = useCallback((): Record<string, boolean> => {
    const state: Record<string, boolean> = {};

    filteredMenuGroups.forEach((group) => {
      const isActive = group.children.some((child) => {
        if (child.to === location.pathname) return true;
        if (child.to !== "/" && location.pathname.startsWith(child.to)) return true;
        return false;
      });
      state[group.label] = isActive;
    });

    return state;
  }, [filteredMenuGroups, location.pathname]);

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(
    getInitialOpenState()
  );

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    setOpenMenus(getInitialOpenState());
  }, [location.pathname, getInitialOpenState]);

  /* =========================
     HANDLERS
  ========================= */
  const toggleMenu = useCallback((label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }, []);

  const handleNavClick = useCallback(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [isMobile, onClose]);

  /* =========================
     RENDER
  ========================= */
  return (
    <aside className={`
      h-full bg-brand-primary flex flex-col
      ${isMobile ? 'w-72' : 'w-64'}
    `}>
      {/* HEADER - with close button on mobile */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-900 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-brand-primary font-bold text-base sm:text-lg">T</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm sm:text-base truncate">TSS Portal</p>
            <p className="text-blue-300 text-[10px] sm:text-xs truncate">Support System</p>
          </div>
        </div>
        
        {/* Close button - Mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-blue-800/50 text-blue-300 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2 sm:px-3 py-3 sm:py-4 overflow-y-auto">
        {filteredMenuGroups.map((group) => {
          const isOpen = openMenus[group.label];

          return (
            <div key={group.label} className="mb-1 sm:mb-2">
              {/* GROUP HEADER */}
              <button
                onClick={() => toggleMenu(group.label)}
                className="w-full flex items-center justify-between px-2 sm:px-3 py-2 text-blue-200 hover:bg-blue-800/30 rounded-lg transition-all duration-200"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-base sm:text-lg w-5 text-center flex-shrink-0">
                    {group.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {group.label}
                  </span>
                </span>
                <span
                  className={`text-xs transition-transform duration-200 flex-shrink-0 ml-2 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {/* CHILDREN */}
              <div
                className={`
                  ml-4 sm:ml-5 mt-1 space-y-0.5 sm:space-y-1 overflow-hidden transition-all duration-300
                  ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                {group.children.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `block px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-white text-brand-primary font-medium shadow-sm"
                          : "text-blue-200 hover:bg-blue-800/30 hover:text-white"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-blue-900 flex-shrink-0">
        {/* User Info */}
        <div className="mb-2 sm:mb-3">
          <p className="text-white text-xs sm:text-sm font-medium truncate">
            {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
              user?.username ||
              "Guest"}
          </p>
          <p className="text-blue-300 text-[10px] sm:text-xs truncate">{userRole}</p>
        </div>

        {/* Logout Button - Mobile friendly */}
        <div className="w-full">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;