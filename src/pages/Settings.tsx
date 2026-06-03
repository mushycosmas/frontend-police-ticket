import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { getRoleLabel } from '../utils/helpers';
export const Settings: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName ?? '',
    email:    user?.email ?? '',
    currentPassword: '',
    newPassword:     '',
  });
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-brand-muted text-sm mt-1">
          Manage your account and system preferences.
        </p>
      </div>
      {saved && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✅ Settings saved successfully.
          </p>
        </div>
      )}
      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center shadow-md">
            <span className="text-white text-2xl font-bold">
              {user?.fullName?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-lg font-bold text-brand-primary">{user?.fullName}</p>
            <p className="text-sm text-brand-muted">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-gray text-brand-primary
                             text-xs font-semibold rounded-full border border-brand-border">
              {getRoleLabel(user?.role ?? '')}
            </span>
          </div>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
            />
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <hr className="border-brand-border" />
          <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
            Change Password
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, currentPassword: e.target.value }))
              }
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, newPassword: e.target.value }))
              }
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      {/* System Preferences */}
      <div className="card space-y-4">
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
          System Preferences
        </h2>
        {[
          { label: 'Email notifications on ticket assignment', defaultChecked: true  },
          { label: 'Email notifications on SLA breach',        defaultChecked: true  },
          { label: 'Email notifications on ticket closure',    defaultChecked: false },
          { label: 'Show CSAT prompt after ticket closure',    defaultChecked: true  },
        ].map((pref) => (
          <label
            key={pref.label}
            className="flex items-center justify-between py-2
                       border-b border-brand-border last:border-0 cursor-pointer group"
          >
            <span className="text-sm text-brand-primary group-hover:text-brand-light transition-colors">
              {pref.label}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                defaultChecked={pref.defaultChecked}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-brand-border rounded-full peer
                              peer-checked:bg-brand-primary transition-colors duration-200" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                              shadow transition-transform duration-200
                              peer-checked:translate-x-5" />
            </div>
          </label>
        ))}
      </div>
      {/* SLA Policy Display */}
      <div className="card space-y-3">
        <h2 className="text-sm font-bold text-brand-primary uppercase tracking-wider">
          Active SLA Policy
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-brand-gray">
              <tr>
                {['Priority', 'First Response', 'Resolution Time'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-2 text-xs font-semibold
                               text-brand-muted uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {[
                { p: 'P1 — Critical', fr: '15 mins',  rt: '1 hour'   },
                { p: 'P2 — High',     fr: '30 mins',  rt: '4 hours'  },
                { p: 'P3 — Medium',   fr: '1 hour',   rt: '8 hours'  },
                { p: 'P4 — Low',      fr: '4 hours',  rt: '24 hours' },
              ].map((row) => (
                <tr key={row.p} className="hover:bg-brand-gray">
                  <td className="px-4 py-2.5 font-medium text-brand-primary">{row.p}</td>
                  <td className="px-4 py-2.5 text-brand-muted">{row.fr}</td>
                  <td className="px-4 py-2.5 text-brand-muted">{row.rt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
