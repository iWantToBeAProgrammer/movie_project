"use client";

import { HiExclamation } from "react-icons/hi";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  isLoading = false,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDanger = true, // Kalau true tombol jadi merah
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop Gelap */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-sm scale-100 transform overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] p-6 text-left shadow-xl transition-all">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${isDanger ? "bg-red-100 sm:mx-0 sm:h-10 sm:w-10" : "bg-blue-100"}`}
          >
            <HiExclamation
              className={`h-6 w-6 ${isDanger ? "text-red-600" : "text-blue-600"}`}
            />
          </div>
          <h3 className="text-lg leading-6 font-medium text-white">{title}</h3>
        </div>

        <div className="mt-2">
          <p className="text-sm text-gray-400">{message}</p>
        </div>

        <div className="mt-6 flex flex-row-reverse gap-3">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-lg px-4 py-2 text-base font-medium text-white shadow-sm sm:w-auto sm:text-sm ${
              isDanger
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            } focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-base font-medium text-gray-300 shadow-sm hover:bg-white/5 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
