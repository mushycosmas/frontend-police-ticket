import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/common/Sidebar';
import { Login }        from './pages/Login';
import { PublicCreateTicket } from './pages/PublicCreateTicket';
import { Dashboard }    from './pages/Dashboard';
import { Tickets }      from './pages/Tickets';
import { TicketDetail } from './pages/TicketDetail';
import { CreateTicket } from './pages/CreateTicket';
import { QAReview }     from './pages/QAReview';
import { Reports }      from './pages/Reports';
import { Settings }     from './pages/Settings';
import { Home}     from './pages/Home/Home';
/* ── Protected layout wrapper ─────────────────────────── */
const AppLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent
                          rounded-full animate-spin mx-auto" />
          <p className="text-brand-muted text-sm">Loading TSS Portal…</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return (
    <div className="flex min-h-screen bg-brand-gray">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
/* ── Public route guard ────────────────────────────────── */
const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Outlet />;
};
/* ── Root App ──────────────────────────────────────────── */
const routes = [
  {
    element: <PublicRoute />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/report', element: <PublicCreateTicket /> },
    ],
  },
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'tickets', element: <Tickets /> },
      { path: 'tickets/:id', element: <TicketDetail /> },
      { path: 'create', element: <CreateTicket /> },
      { path: 'qa', element: <QAReview /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to='/' replace /> },
];

const router = createBrowserRouter(routes, {
  future: { v7_relativeSplatPath: true },
});

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
