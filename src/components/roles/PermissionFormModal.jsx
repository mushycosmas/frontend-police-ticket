import React, { useEffect, useState } from "react";
import { createPermission, updatePermission } from "../../api/roleApi";

const PermissionFormModal = ({ show, onHide, editData, onSuccess }) => {
  const isEdit = Boolean(editData);

  const [form, setForm] = useState({
    name: "",
    codename: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit && editData) {
      setForm({
        name: editData.name || "",
        codename: editData.codename || "",
      });
    } else {
      setForm({ 
        name: "", 
        codename: "",
      });
    }
    setError(null);
  }, [editData, isEdit, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Always use content_type_id: 1 for new permissions
      // For updates, don't send content_type_id (or send the existing one)
      const submitData = {
        name: form.name.trim(),
        codename: form.codename.trim(),
      };

      // Only add content_type_id when creating new permission
      if (!isEdit) {
        submitData.content_type_id = 1;
      }

      console.log("Submitting data:", submitData);

      let response;
      if (isEdit) {
        response = await updatePermission(editData.id, submitData);
      } else {
        response = await createPermission(submitData);
      }

      console.log("Success response:", response);
      
      onSuccess?.();
      onHide();
    } catch (err) {
      console.error("Submission error:", err);
      setError(err.response?.data?.detail || err.message || "Failed to save permission");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Edit Permission" : "Create Permission"}
          </h2>
          <button onClick={onHide} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Can create users"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Codename <span className="text-red-500">*</span>
            </label>
            <input
              name="codename"
              value={form.codename}
              onChange={handleChange}
              placeholder="e.g., add_user"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onHide}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                isEdit ? "Update" : "Create"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PermissionFormModal;