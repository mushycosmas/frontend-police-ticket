import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "./ConfirmModal";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  onLogout?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "", 
  children,
  onLogout 
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Clear all auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    sessionStorage.clear();
    
    // Call custom callback if provided
    if (onLogout) onLogout();
    
    // Redirect to login
    navigate("/login", { replace: true });
    
    setIsLoggingOut(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isLoggingOut}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-blue-200 hover:bg-brand-light hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoggingOut ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Signing out...
          </>
        ) : (
          children || (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </>
          )
        )}
      </button>

      <ConfirmModal
        show={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={() => {
          setShowConfirm(false);
          handleLogout();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default LogoutButton;