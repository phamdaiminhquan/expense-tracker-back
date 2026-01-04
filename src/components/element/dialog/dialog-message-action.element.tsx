import { Edit3, Trash2 } from "lucide-react";
import React from "react";

export const DialogMessageAction = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  message,
}) => {
  if (!isOpen) return null;
  return (
    <React.Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 opacity-100"
        onClick={onClose}
      />

      {/* Action Sheet Panel - Bottom sheet on mobile, centered modal on sm+ */}
      <div
        className="fixed bg-white z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transform transition-all duration-300 ease-out
          bottom-0 left-0 right-0 rounded-t-[32px] p-6
          sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[32px] sm:w-[400px] sm:max-w-[90vw]
          animate-in slide-in-from-bottom sm:fade-in sm:zoom-in-95
        "
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
        <h3 className="text-center font-bold text-gray-800 mb-6 text-lg">
          Tùy chọn tin nhắn
        </h3>

        <div className="space-y-3">
          {message.status !== "failed" && (
            <button
              onClick={onEdit}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-indigo-600">
                <Edit3 size={20} />
              </div>
              Sửa nội dung
            </button>
          )}

          <button
            onClick={() => onDelete(message)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-rose-50 text-rose-600 font-semibold hover:bg-rose-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose-500">
              <Trash2 size={20} />
            </div>
            Xóa tin nhắn
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-4 text-gray-400 font-medium text-sm hover:text-gray-600"
        >
          Hủy bỏ
        </button>
      </div>
    </React.Fragment>
  );
};
