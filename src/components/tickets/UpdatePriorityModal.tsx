import React, { useState } from "react";
import { updateTicketPriority } from "../../api/ticketApi";
import { Toast } from "../common/Toast";

interface PriorityOption {
  value: string;
  label: string;
  color: string;
  description: string;
}

interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  priority: string;
  status: string;
  created_at: string;
}

interface UpdatePriorityModalProps {
  show: boolean;
  ticket: Ticket | null;
  onHide: () => void;
  onSuccess: () => void;
}

interface ToastMessage {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: "CRITICAL", label: "🔴 Critical", color: "bg-red-100 text-red-800 border-red-200", description: "Immediate attention required" },
  { value: "HIGH", label: "🟠 High", color: "bg-orange-100 text-orange-800 border-orange-200", description: "Urgent, resolve quickly" },
  { value: "MEDIUM", label: "🟡 Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200", description: "Normal priority" },
  { value: "LOW", label: "🟢 Low", color: "bg-green-100 text-green-800 border-green-200", description: "Can wait, low impact" },
];

const UpdatePriorityModal: React.FC<UpdatePriorityModalProps> = ({
  show,
  ticket,
  onHide,
  onSuccess,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<string>(ticket?.priority || "MEDIUM");
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  if (!show || !ticket) return null;

  const showToast = (message: string, type: ToastMessage["type"]) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getPriorityLabel = (priority: string): string => {
    const option = PRIORITY_OPTIONS.find(p => p.value === priority);
    return option?.label || priority;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPriority === ticket.priority) {
      showToast("No changes made to priority", "info");
      return;
    }
    
    setLoading(true);

    try {
      await updateTicketPriority(ticket.id, selectedPriority);
      showToast(`✓ Priority updated to ${getPriorityLabel(selectedPriority)}`, "success");
      
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update priority:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update priority";
      showToast(`✗ ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const currentPriorityOption = PRIORITY_OPTIONS.find(p => p.value === ticket.priority) || PRIORITY_OPTIONS[2];

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onHide}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Update Priority</h2>
              <button 
                onClick={onHide} 
                className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Ticket #{ticket.ticket_number}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Current Priority */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Current Priority</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentPriorityOption.color}`}>
                  {currentPriorityOption.label}
                </div>
              </div>

              {/* New Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Priority
                </label>
                <div className="space-y-2">
                  {PRIORITY_OPTIONS.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPriority === option.value
                          ? `${option.color} border-2`
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={option.value}
                        checked={selectedPriority === option.value}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="w-4 h-4 mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{option.description}</div>
                      </div>
                      {selectedPriority === option.value && (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Ticket Preview */}
              <div className="text-sm bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-700 mb-1">Ticket Information:</p>
                <p className="text-gray-600">{ticket.title}</p>
                <p className="text-xs text-gray-400 mt-1">Status: {ticket.status}</p>
                <p className="text-xs text-gray-400">Created: {new Date(ticket.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                type="button"
                onClick={onHide}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedPriority === ticket.priority}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Update Priority
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePriorityModal;