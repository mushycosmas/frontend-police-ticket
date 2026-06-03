import React from "react";

type Props = {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  message?: string;
};

const ConfirmDeleteModal: React.FC<Props> = ({
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

        <h2 className="text-lg font-semibold mb-3">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-5">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;