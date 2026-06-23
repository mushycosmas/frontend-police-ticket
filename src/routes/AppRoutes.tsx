import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

/* Layout */
import AppLayout from "../layouts/AppLayout";

/* Auth */
import ProtectedRoute from "./ProtectedRoute";

/* Pages */
import { Login } from "../pages/Login";
import { Home } from "../pages/Home/Home";
import { PublicCreateTicket } from "../pages/PublicCreateTicket";

import { Dashboard } from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import { Customers } from "../pages/customers/Customers";

import { Reports } from "../pages/Reports";
import { Settings } from "../pages/Settings";
import Permissions from "../pages/admin/Permissions";

/* Admin Pages */
import Categories from "../pages/admin/Categories";
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import Teams from "../pages/admin/Teams";
import Priorities from "../pages/admin/Priorities";

/* Locations */
import Regions from "../pages/admin/locations/Regions";
import Districts from "../pages/admin/locations/Districts";
import Wards from "../pages/admin/locations/Wards";
import Streets from "../pages/admin/locations/Streets";
import { Channels } from "../pages/admin/channels/Channels";

/* System */
import SystemLogs from "../pages/system/SystemLogs";

/* Reports */
import Analytics from "../pages/reports/Analytics";
import { Profile } from "../pages/profile/Profile";
import { ChangePassword } from "../pages/profile/ChangePassword";
import { IssueTemplateManager } from "../pages/admin/issue-template/IssueTemplate";
import { DeletedTickets } from "../components/tickets/DeletedTickets";

import Faqs from "../pages/admin/Faqs";
/* ========== ROUTER CONFIGURATION ========== */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/report",
    element: <PublicCreateTicket />,
  },

  /* PROTECTED ROUTES */
  {
    element: <AppLayout />,
    children: [
      /* ========== DASHBOARD ========== */
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedPermissions={["view_dashboard"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      /* ========== TICKETS ========== */
      {
        path: "/tickets",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "/tickets/my",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tickets/assigned",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tickets/unassigned",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tickets/open",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tickets/in-progress",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tickets/resolved",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tickets/closed",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <Tickets />
          </ProtectedRoute>
        ),
      },
       {
        path: "/admin/deleted-tickets",
        element: (
          <ProtectedRoute allowedPermissions={["view_ticket"]}>
            <DeletedTickets />
          </ProtectedRoute>
        ),
      },

      /* ========== CUSTOMERS ========== */
      {
        path: "/customers",
        element: (
          <ProtectedRoute allowedPermissions={["view_customer"]}>
            <Customers />
          </ProtectedRoute>
        ),
      },

      /* ========== QA ========== */
      

      /* ========== ADMINISTRATION ========== */
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute allowedPermissions={["view_user"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/roles",
        element: (
          <ProtectedRoute allowedPermissions={["view_role"]}>
            <Roles />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/permissions",
        element: (
          <ProtectedRoute allowedPermissions={["view_permission"]}>
            <Permissions />
          </ProtectedRoute>
        ),
      },

      
      {
        path: "/admin/teams",
        element: (
          <ProtectedRoute allowedPermissions={["view_team"]}>
            <Teams />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/categories",
        element: (
          <ProtectedRoute allowedPermissions={["view_category"]}>
            <Categories />
          </ProtectedRoute>
        ),
      }, {
        path: "/admin/channels",
        element: (
          <ProtectedRoute allowedPermissions={["view_channel"]}>
            <Channels />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/priorities",
        element: (
          <ProtectedRoute allowedPermissions={["view_priority"]}>
            <Priorities />
          </ProtectedRoute>
        ),
      },
       {
      path: "/admin/faqs",
      element: (
        <ProtectedRoute allowedPermissions={["view_faq"]}>
          <Faqs />
        </ProtectedRoute>
      ),
    },
      {
        path: "/admin/issue-templates",
        element: (
          <ProtectedRoute allowedPermissions={["view_issuetemplate"]}>
            <IssueTemplateManager />
          </ProtectedRoute>
        ),
      },

      /* ========== LOCATIONS ========== */
      {
        path: "/admin/locations/regions",
        element: (
          <ProtectedRoute allowedPermissions={["view_region"]}>
            <Regions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/locations/districts",
        element: (
          <ProtectedRoute allowedPermissions={["view_district"]}>
            <Districts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/locations/wards",
        element: (
          <ProtectedRoute allowedPermissions={["view_ward"]}>
            <Wards />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/locations/streets",
        element: (
          <ProtectedRoute allowedPermissions={["view_street"]}>
            <Streets />
          </ProtectedRoute>
        ),
      },

      /* ========== REPORTS ========== */
      {
        path: "/reports",
        element: (
          <ProtectedRoute allowedPermissions={["view_report"]}>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "/analytics",
        element: (
          <ProtectedRoute allowedPermissions={["view_report"]}>
            <Analytics />
          </ProtectedRoute>
        ),
      },

      /* ========== SYSTEM ========== */
     {
      path: "/settings",
      element: (
        <ProtectedRoute allowedPermissions={["view_settings"]}>
          <Settings />
        </ProtectedRoute>
      ),
    },
    {
      path: "/logs",
      element: (
        <ProtectedRoute allowedPermissions={["view_logs"]}>
          <SystemLogs />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute allowedPermissions={["view_profile"]}>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/change-password",
      element: (
        <ProtectedRoute allowedPermissions={["view_profile"]}>
          <ChangePassword />
        </ProtectedRoute>
      ),
    },
    ],
  },

  /* FALLBACK ROUTE */
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
 
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;