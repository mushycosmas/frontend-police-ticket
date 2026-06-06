import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getRoleLabel } from "../../utils/helpers";

/* =========================
   TYPES
========================= */
type MenuChild = {
  to: string;
  label: string;
};

type MenuGroup = {
  label: string;
  icon: string;
  roles: string[];
  children: MenuChild[];
};

/* =========================
   MENU DATA
========================= */
const menuGroups: MenuGroup[] = [
  {
    label: "Dashboard",
    icon: "⊞",
    roles: ["ADMIN", "MANAGER", "TEAM_LEAD", "AGENT", "QA_ANALYST"],
    children: [{ to: "/dashboard", label: "Dashboard" }],
  },
  {
    label: "Tickets",
    icon: "🎫",
    roles: ["ADMIN", "MANAGER", "TEAM_LEAD", "AGENT", "QA_ANALYST"],
    children: [
      { to: "/tickets", label: "All Tickets" },
      { to: "/tickets/my", label: "My Tickets" },
      { to: "/tickets/assigned", label: "Assigned Tickets" },
      { to: "/tickets/unassigned", label: "Unassigned Tickets" },
      { to: "/tickets/open", label: "Open Tickets" },
      { to: "/tickets/in-progress", label: "In Progress" },
      { to: "/tickets/resolved", label: "Resolved Tickets" },
      { to: "/tickets/closed", label: "Closed Tickets" },
    ],
  },
  {
    label: "Customers",
    icon: "👥",
    roles: ["ADMIN"], // Only ADMIN can view customers
    children: [
      { to: "/customers", label: "All Customers" },
    ],
  },
  {
    label: "Reports",
    icon: "📈",
    roles: ["ADMIN", "MANAGER", "TEAM_LEAD"],
    children: [
      { to: "/reports", label: "Reports" },
      { to: "/analytics", label: "Analytics" },
    ],
  },
  {
    label: "Administration",
    icon: "⚙️",
    roles: ["ADMIN"],
    children: [
      { to: "/admin/roles", label: "Roles" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/teams", label: "Teams" },
      { to: "/admin/categories", label: "Categories" },
      { to: "/admin/priorities", label: "Priorities" },
    ],
  },
  {
    label: "Locations",
    icon: "🌍",
    roles: ["ADMIN"],
    children: [
      { to: "/admin/locations/regions", label: "Regions" },
      { to: "/admin/locations/districts", label: "Districts" },
      { to: "/admin/locations/wards", label: "Wards" },
      { to: "/admin/locations/streets", label: "Streets" },
    ],
  },
  {
    label: "System",
    icon: "🖥️",
    roles: ["ADMIN"],
    children: [
      { to: "/settings", label: "Settings" },
      { to: "/logs", label: "System Logs" },
    ],
  },
];

/* =========================
   SIDEBAR
========================= */
export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* =========================
     AUTO OPEN STATE
  ========================= */
  const getInitialOpenState = () => {
    const state: Record<string, boolean> = {};

    menuGroups.forEach((group) => {
      const isActive = group.children.some((child) =>
        location.pathname.startsWith(child.to)
      );

      state[group.label] = isActive;
    });

    return state;
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(
    getInitialOpenState()
  );

  /* =========================
     UPDATE ON ROUTE CHANGE
  ========================= */
  useEffect(() => {
    setOpenMenus((prev) => {
      const updated: Record<string, boolean> = { ...prev };

      menuGroups.forEach((group) => {
        const isActive = group.children.some((child) =>
          location.pathname.startsWith(child.to)
        );

        updated[group.label] = isActive;
      });

      return updated;
    });
  }, [location.pathname]);

  /* =========================
     TOGGLE MENU
  ========================= */
  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const allowedGroups = menuGroups.filter(
    (group) => user && group.roles.includes(user.role)
  );

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

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">

        {allowedGroups.map((group) => {
          const isOpen = openMenus[group.label];

          return (
            <div key={group.label} className="mb-2">

              {/* GROUP HEADER */}
              <button
                onClick={() => toggleMenu(group.label)}
                className="w-full flex items-center justify-between px-3 py-2 text-blue-200 hover:bg-brand-light rounded-lg transition-all"
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
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                      ${
                        isActive
                          ? "bg-white text-brand-primary"
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

      {/* USER */}
      <div className="px-4 py-4 border-t border-brand-light">

        <div className="mb-3">
          <p className="text-white text-sm font-medium">
            {user?.fullName ?? user?.username ?? "User"}
          </p>
          <p className="text-blue-300 text-xs">
            {getRoleLabel(user?.role ?? "")}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                     text-blue-200 hover:bg-brand-light hover:text-white text-sm"
        >
          ↩ Sign Out
        </button>

      </div>

    </aside>
  );
};