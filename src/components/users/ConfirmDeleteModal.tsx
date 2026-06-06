import React from "react";

interface ConfirmDeleteModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  userName?: string;  // Add this prop as optional
  userEmail?: string;  // Add this prop as optional
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ 
  show, 
  onHide, 
  onConfirm,
  userName,
  userEmail
}) => {
  if (!show) return null;

  const displayName = userName || userEmail || "this user";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onHide}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">
            Delete User
          </h3>
          
          <p className="text-center text-gray-600 mb-6">
            Are you sure you want to delete <span className="font-semibold">{displayName}</span>? 
            This action cannot be undone.
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onHide}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;