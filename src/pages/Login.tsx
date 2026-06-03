import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

export  const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setError("");
  setLoading(true);

  try {
      const response = await loginUser(form);

      const { access, user } = response.data;

      localStorage.setItem("token", access);
      localStorage.setItem("user", JSON.stringify(user));

           if (user.role === "ADMIN") {
           console.log("Login Successful", user.role);
           navigate("/dashboard", { replace: true });
      }

else if (user.role === "MANAGER") {
                navigate("/dashboard", { replace: true });

            } else if (user.role === "TEAM_LEAD") {
                navigate("/tickets", { replace: true });

            } else if (user.role === "AGENT") {
                navigate("/tickets", { replace: true });

            } else if (user.role === "CUSTOMER") {
                navigate("/tickets", { replace: true });

            } else {
                navigate("/dashboard", { replace: true });
            }
  } catch (err) {
    setError("Invalid username or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="bg-brand-primary rounded-2xl p-8 mb-4 text-center shadow-xl">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-brand-primary font-black text-3xl">T</span>
          </div>

          <h1 className="text-white text-2xl font-bold">
            TSS Portal
          </h1>

          <p className="text-blue-300 text-sm mt-1">
            Ticket Support System
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="card shadow-xl rounded-2xl p-6">

          <h2 className="text-xl font-bold text-brand-primary mb-1">
            Sign In
          </h2>

          <p className="text-brand-muted text-sm mb-6">
            Enter your credentials to access the portal.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* USERNAME */}
            <Input
              label="Username"
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              required
              icon={<span>👤</span>}
            />

            {/* PASSWORD */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              icon={<span>🔒</span>}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full mt-2"
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

          </form>

          <p className="text-center text-xs text-brand-muted mt-6">
            © 2026 Ticket Support System · All rights reserved
          </p>

        </div>
      </div>
    </div>
  );
};