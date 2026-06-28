import React, { useEffect, useState } from "react";
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
      // { to: "/tickets/my", label: "My Tickets", permission: "view_ticket" },
      // { to: "/tickets/assigned", label: "Assigned Tickets", permission: "view_ticket" },
      // { to: "/tickets/unassigned", label: "Unassigned Tickets", permission: "view_ticket" },
      // { to: "/tickets/open", label: "Open Tickets", permission: "view_ticket" },
      // { to: "/tickets/in-progress", label: "In Progress", permission: "view_ticket" },
      // { to: "/tickets/resolved", label: "Resolved Tickets", permission: "view_ticket" },
      // { to: "/tickets/closed", label: "Closed Tickets", permission: "view_ticket" },
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
export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, permissions } = useAuth();

  /* =========================
     ROLE NORMALIZER
  ========================= */
  const normalizeRole = (role: any): string => {
    if (!role) return "UNKNOWN";

    if (typeof role === "string") {
      return role.trim().toUpperCase();
    }

    if (typeof role === "object" && role.name) {
      return role.name.trim().toUpperCase();
    }

    return String(role).trim().toUpperCase();
  };

  const userRole = normalizeRole(user?.role);

  /* =========================
     PERMISSION CHECK
  ========================= */
  const hasPermission = (perm: string): boolean => {
    if (!perm) return true;
    if (!Array.isArray(permissions)) return false;
    if (permissions.includes("*")) return true;
    return permissions.includes(perm);
  };

  /* =========================
     FILTER MENU
  ========================= */
  const filteredMenuGroups = menuGroups
    .map((group) => {
      const filteredChildren = group.children.filter((child) =>
        hasPermission(child.permission)
      );
      return { ...group, children: filteredChildren };
    })
    .filter((group) => group.children.length > 0);

  /* =========================
     INITIAL OPEN STATE
  ========================= */
  const getInitialOpenState = (): Record<string, boolean> => {
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
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(
    getInitialOpenState()
  );

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    setOpenMenus(getInitialOpenState());
  }, [location.pathname]);

  /* =========================
     HANDLERS
  ========================= */
  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <aside className="w-64 h-full bg-brand-primary flex flex-col border-r border-blue-900">
      {/* HEADER */}
      <div className="px-6 py-6 border-b border-brand-light">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-brand-primary font-bold text-lg">T</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">TSS Portal</p>
            <p className="text-blue-300 text-xs">Support System</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {filteredMenuGroups.map((group) => {
          const isOpen = openMenus[group.label];

          return (
            <div key={group.label} className="mb-2">
              {/* GROUP HEADER */}
              <button
                onClick={() => toggleMenu(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-blue-200 hover:bg-brand-light rounded-lg transition-all duration-200"
              >
                <span className="flex items-center gap-3">
                  <span className="text-base w-5 text-center">
                    {group.icon}
                  </span>
                  <span className="text-sm font-medium">
                    {group.label}
                  </span>
                </span>
                <span
                  className={`text-xs transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {/* CHILDREN */}
              <div
                className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {group.children.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm rounded-lg transition-all duration-200
                      ${
                        isActive
                          ? "bg-white text-brand-primary font-medium shadow-sm"
                          : "text-blue-200 hover:bg-brand-light hover:text-white"
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
      <div className="px-4 py-4 border-t border-brand-light">
        {/* User Info */}
        <div className="mb-3">
          <p className="text-white text-sm font-medium">
            {`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
              user?.username ||
              "Guest"}
          </p>
          <p className="text-blue-300 text-xs">{userRole}</p>
        </div>

        {/* Quick Actions */}
        {/* <div className="flex flex-col gap-1 mb-3">
          <NavLink
            to="/profile"
            className="text-xs text-blue-200 hover:text-white transition-colors"
          >
            👤 My Profile
          </NavLink>
          <NavLink
            to="/change-password"
            className="text-xs text-blue-200 hover:text-white transition-colors"
          >
            🔒 Change Password
          </NavLink>
        </div> */}

        {/* Logout Button */}
        <LogoutButton />
      </div>
    </aside>
  );
};