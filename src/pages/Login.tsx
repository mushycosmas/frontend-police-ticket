import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset error
    setError("");
    setLoading(true);

    try {
      // ======================
      // LOGIN (FROM CONTEXT)
      // ======================
      const userData = await login(form);

      console.log("LOGIN SUCCESS:", userData);
      console.log("User permissions:", userData?.permissions);
      console.log("Permissions count:", userData?.permissions?.length);

      // ======================
      // GET PERMISSIONS SAFELY
      // ======================
      const permissions: string[] = userData?.permissions ?? [];

      // ======================
      // REDIRECT LOGIC BASED ON PERMISSIONS
      // ======================
      
      // Check if user has any ticket view permissions
      const hasTicketPermission = permissions.some(p => 
        p.includes('view_ticket') || p === '*'
      );
      
      // Check if user has admin/user management permissions
      const hasUserPermission = permissions.some(p => 
        p.includes('view_user') || p === '*'
      );
      
      // Check if user has report permissions
      const hasReportPermission = permissions.some(p => 
        p.includes('view_kpireport') || p.includes('view_report') || p === '*'
      );
      
      // Check if user has dashboard permission
      const hasDashboardPermission = permissions.some(p => 
        p.includes('view_dashboard') || p === '*'
      );

      // ======================
      // REDIRECT DECISION
      // ======================
      if (hasTicketPermission) {
        // Users with ticket access go to tickets page
        navigate("/tickets", { replace: true });
      } else if (hasUserPermission) {
        // Admins go to user management
        navigate("/admin/users", { replace: true });
      } else if (hasReportPermission) {
        // Users with report access go to reports
        navigate("/reports", { replace: true });
      } else if (hasDashboardPermission) {
        // Default dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // Fallback - if no specific permissions, go to dashboard
        navigate("/dashboard", { replace: true });
      }
      
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      
      // Handle different error types
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* HEADER / BRAND SECTION */}
        {/* HEADER / BRAND SECTION */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-light rounded-2xl p-8 mb-6 text-center shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <span className="text-white font-black text-4xl">T</span>
          </div>

          <h1 className="text-white text-3xl font-bold tracking-tight">
            TSS Portal
          </h1>

          <p className="text-white/80 text-sm mt-2">
            Ticket Support System
          </p>
        </div>

        {/* LOGIN FORM CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to access your account
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm font-medium">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoComplete="username"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
              icon={
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-4"
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Ticket Support System. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
};

