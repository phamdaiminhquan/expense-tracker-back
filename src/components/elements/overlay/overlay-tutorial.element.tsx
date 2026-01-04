import React, { useState, useEffect } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const OverlayTutorial: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenTutorial");
    if (!hasSeen) {
      setIsVisible(true);
    }
  }, []);

  const handleComplete = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Sparkles size={120} />
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <Sparkles size={32} />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            AI Phân tích thông minh
          </h3>

          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Chỉ cần nhập nội dung ngắn gọn, hệ thống sẽ tự động phân tích và ghi
            chép cho bạn.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 w-full mb-8">
            <div className="bg-white p-3 rounded-xl text-sm text-gray-600 italic border border-gray-100 shadow-sm mb-4 text-center">
              "cam sành 25k"
            </div>
            <div className="flex justify-center mb-4">
              <ArrowRight className="text-gray-300 rotate-90" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <span className="text-xs font-medium text-gray-500">
                  Danh mục
                </span>
                <span className="text-sm font-bold text-indigo-700">
                  Ăn uống
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-xs font-medium text-gray-500">
                  Số tiền
                </span>
                <span className="text-sm font-bold text-emerald-700">
                  25.000 đ
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full group relative inline-flex items-center justify-center gap-3 bg-gray-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-500/20 overflow-hidden transition-all hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Đã hiểu, bắt đầu ngay{" "}
              <Check
                size={18}
                className="group-hover:scale-110 transition-transform"
              />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
