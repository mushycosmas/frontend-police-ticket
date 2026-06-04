import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

/* Layout */
import AppLayout from "../layouts/AppLayout";

/* Pages */
import { Login } from "../pages/Login";
import { Home } from "../pages/Home/Home";
import { PublicCreateTicket } from "../pages/PublicCreateTicket";

import { Dashboard } from "../pages/Dashboard";
import { Tickets } from "../pages/Tickets";
import { TicketDetail } from "../pages/TicketDetail";
import { CreateTicket } from "../pages/CreateTicket";
import { QAReview } from "../pages/QAReview";
import { Reports } from "../pages/Reports";
import { Settings } from "../pages/Settings";

/* Admin Pages */
import  Categories  from "../pages/admin/Categories";
import  Users  from "../pages/admin/Users";
import Roles  from "../pages/admin/Roles";
import Teams  from "../pages/admin/Teams";

import  Priorities  from "../pages/admin/Priorities";

/* Locations Pages */
import  Regions  from "../pages/admin/locations/Regions";
import  Districts  from "../pages/admin/locations/Districts";
import  Wards  from "../pages/admin/locations/Wards";
import  Streets  from "../pages/admin/locations/Streets";

/* Team Lead Pages */
// import { TeamTickets } from "../pages/team/TeamTickets";
// import { TeamAgents } from "../pages/team/TeamAgents";

/* System Pages */
import  SystemLogs  from "../pages/system/SystemLogs";

/* Analytics Pages */
import  Analytics  from "../pages/reports/Analytics";

/* PUBLIC ROUTES */
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
      /* Dashboard */
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      /* Tickets */
      {
        path: "/tickets",
        element: <Tickets />,
      },
      {
        path: "/tickets/:id",
        element: <TicketDetail />,
      },
      {
        path: "/tickets/create",
        element: <CreateTicket />,
      },
      {
        path: "/tickets/my",
        element: <Tickets />,
      },
      {
        path: "/tickets/assigned",
        element: <Tickets />,
      },
      {
        path: "/tickets/unassigned",
        element: <Tickets />,
      },
      {
        path: "/tickets/open",
        element: <Tickets />,
      },
      {
        path: "/tickets/in-progress",
        element: <Tickets />,
      },
      {
        path: "/tickets/resolved",
        element: <Tickets />,
      },
      {
        path: "/tickets/closed",
        element: <Tickets />,
      },

      /* QA */
      {
        path: "/qa",
        element: <QAReview />,
      },

      /* Team Lead */
      // {
      //   path: "/team/tickets",
      //   element: <TeamTickets />,
      // },
      // {
      //   path: "/team/agents",
      //   element: <TeamAgents />,
      // },

      /* Administration */
      {
        path: "/admin/roles",
        element: <Roles />,
      },
      {
        path: "/admin/users",
        element: <Users />,
      },
      {
        path: "/admin/teams",
        element: <Teams />,
      },
      {
        path: "/admin/categories",
        element: <Categories />,
      },
      {
        path: "/admin/priorities",
        element: <Priorities />,
      },
     

      /* Locations */
      {
        path: "/admin/locations/regions",
        element: <Regions />,
      },
      {
        path: "/admin/locations/districts",
        element: <Districts />,
      },
      {
        path: "/admin/locations/wards",
        element: <Wards />,
      },
      {
        path: "/admin/locations/Streets",
        element: <Streets />,
      },

      /* Reports */
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },

      /* System */
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/logs",
        element: <SystemLogs />,
      },
    ],
  },

  /* fallback */
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;