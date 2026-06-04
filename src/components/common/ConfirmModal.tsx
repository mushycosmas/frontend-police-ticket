import React from "react";

type Props = {
  show: boolean;
  onHide: () => void;
  title?: string;
  message?: string;
  onConfirm: () => void;
};

const ConfirmModal: React.FC<Props> = ({
  show,
  onHide,
  title,
  message,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-semibold">
            {title || "Confirm Action"}
          </h2>

          <button
            onClick={onHide}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="py-5 text-gray-700">
          {message || "Are you sure you want to continue?"}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t pt-3">

          <button
            onClick={onHide}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onHide();
            }}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;