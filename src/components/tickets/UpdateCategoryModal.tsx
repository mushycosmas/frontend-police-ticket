// src/components/modals/UpdateCategoryModal.tsx
import React, { useState, useEffect } from "react";
import { updateTicketCategory } from "../../api/ticketApi";
import { useCategories } from "../../hooks/useCategories";
import { Toast } from "../common/Toast";

interface Props {
  show: boolean;
  ticket: any;
  onHide: () => void;
  onSuccess: () => void;
}

const UpdateCategoryModal: React.FC<Props> = ({
  show,
  ticket,
  onHide,
  onSuccess,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" | "warning" } | null>(null);

  const { categories, loading: categoriesLoading } = useCategories();

  // Set current category when modal opens
  useEffect(() => {
    if (show && ticket) {
      setSelectedCategoryId(ticket.category_id ? String(ticket.category_id) : "");
    }
  }, [show, ticket]);

  const showToast = (message: string, type: "success" | "error" | "info" | "warning") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategoryId) {
      showToast("Please select a category", "error");
      return;
    }

    setLoading(true);
    try {
      await updateTicketCategory(ticket.id, parseInt(selectedCategoryId));
      showToast("✓ Category updated successfully!", "success");
      setTimeout(() => {
        onSuccess();
        onHide();
      }, 1500);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error?.message || "Failed to update category",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onHide}>
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Update Category</h3>
            <button onClick={onHide} className="text-gray-500 hover:text-black text-xl">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Category</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                disabled={categoriesLoading}
              >
                <option value="">-- Select category --</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesLoading && (
                <p className="text-xs text-gray-500 mt-1">Loading categories...</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <button
                type="button"
                onClick={onHide}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedCategoryId}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateCategoryModal;