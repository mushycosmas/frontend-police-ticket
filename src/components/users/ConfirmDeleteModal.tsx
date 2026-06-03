import React from "react";

type ConfirmDeleteModalProps = {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  message?: string;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  onHide,
  onConfirm,
  message = "Are you sure you want to delete this item?",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onHide}
      />

      {/* MODAL */}
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-lg p-6 z-10">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Delete
        </h2>

        {/* BODY */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* FOOTER */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onHide}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;