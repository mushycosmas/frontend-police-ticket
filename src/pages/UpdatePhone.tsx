import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { isValidTanzaniaPhone } from "../utils/phoneUtils";
import { updatePhone } from "../api/userApi";

export const UpdatePhone = () => {
  const navigate = useNavigate();
  const { user, setNeedsPhoneUpdate, refreshUser } = useAuth();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Set initial phone value from user
  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Remove whitespace
    const normalizedPhone = phone.replace(/\s+/g, "");

    // Validate phone number
    if (!normalizedPhone) {
      setError("Phone number is required");
      return;
    }

    if (!isValidTanzaniaPhone(normalizedPhone)) {
      setError("Please enter a valid Tanzania phone number. Example: 255767059735");
      return;
    }

    setLoading(true);

    try {
      // ✅ Using the API function from userApi.ts
      const response = await updatePhone(normalizedPhone);
      
      console.log("✅ Phone updated successfully:", response.data);

      // Update user in context and localStorage
      if (user) {
        const updatedUser = {
          ...user,
          phone: normalizedPhone,
        };
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Refresh user context
        if (refreshUser) {
          await refreshUser();
        }
        
        if (setNeedsPhoneUpdate) {
          setNeedsPhoneUpdate(false);
        }
      }

      setSuccess(true);
      
      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);

    } catch (err: any) {
      console.error("❌ Phone update error:", err);
      
      // Handle API errors
      let errorMessage = "Failed to update phone number. Please try again.";
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.phone) {
          errorMessage = errors.phone[0];
        } else {
          errorMessage = err.response.data.message || errorMessage;
        }
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-primary to-brand-light p-8 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
              <span className="text-white text-4xl">📱</span>
            </div>

            <h1 className="text-white text-2xl font-bold">
              Update Phone Number
            </h1>

            <p className="text-white/80 text-sm mt-2">
              Add your phone number to continue
            </p>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Phone Number Required
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Your phone number is required to receive SMS notifications about your tickets.
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700 font-medium">
                    Phone number updated successfully! Redirecting...
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && !success && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="255767059735"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError("");
                }}
                required
                autoComplete="tel"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">📌 Format:</span> Use Tanzania country code (255)
                  <br />
                  <span className="font-semibold">📝 Example:</span> <strong>255767059735</strong>
                  <br />
                  <span className="text-gray-400 text-[10px]">
                    (No spaces, no plus sign, starts with 255, exactly 12 digits)
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? "Updating..." : "Update Phone Number"}
                </Button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  Skip for Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};