import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleLabel } from '../../utils/helpers';
const navItems = [
  { to: '/admin/dashboard', icon: '⊞', label: 'Dashboard',  roles: ['ADMIN','MANAGER','TEAM_LEAD','AGENT','QA_ANALYST'] },
  { to: '/admin/tickets',   icon: '🎫', label: 'Tickets',    roles: ['ADMIN','MANAGER','TEAM_LEAD','AGENT','QA_ANALYST'] },
  { to: '/admin/create',    icon: '✚',  label: 'New Ticket', roles: ['ADMIN','MANAGER','TEAM_LEAD','AGENT'] },
  { to: '/admin/qa',        icon: '🔍', label: 'QA Review',  roles: ['ADMIN','MANAGER','QA_ANALYST'] },
  { to: '/admin/reports',   icon: '📈', label: 'Reports',    roles: ['ADMIN','MANAGER'] },
  { to: '/admin/settings',  icon: '⚙️', label: 'Settings',   roles: ['ADMIN','MANAGER'] },
];
export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const allowed = navItems.filter(n => user && n.roles.includes(user.role));
  return (
    <aside className="w-64 min-h-screen bg-brand-primary flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-brand-light">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-brand-primary font-bold text-lg">T</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">TSS Portal</p>
            <p className="text-brand-muted text-xs">Support System</p>
          </div>
        </div>
      </div>
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {allowed.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               transition-all duration-150
               ${isActive
                 ? 'bg-white text-brand-primary shadow-sm'
                 : 'text-blue-200 hover:bg-brand-light hover:text-white'
               }`
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      {/* User Footer */}
      <div className="px-4 py-4 border-t border-brand-light">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-brand-lighter flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-blue-300 text-xs">{getRoleLabel(user?.role ?? '')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                     text-blue-200 hover:bg-brand-light hover:text-white
                     text-sm transition-all duration-150"
        >
          <span>↩</span> Sign Out
        </button>
      </div>
    </aside>
  );
};
