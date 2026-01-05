import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  CATEGORIES_UI,
  WALLET_TEMPLATES,
} from "@/pages/message/message.constant";
import { formatCurrency } from "@/lib/currency.lib";

export default function InputBarCapy({
  // Data Props
  inputValue,
  setInputValue,
  selectedWallet,
  isSmartMode,
  isAnalyzing,
  capyMood = "sleepy", // 'sleepy' | 'excited' | 'happy' | 'angry'
  // Handler Props
  onSend,
  onFocus,
  onBlur,
  onWalletClick,
  onCategoryClick,
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("food");

  // --- 1. LOGIC: Tự động chớp mắt ---
  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextBlink = Math.random() * 3000 + 3000;
        setTimeout(blinkLoop, nextBlink);
      }, 150);
    };
    const initialTimeout = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(initialTimeout);
  }, []);

  // --- 2. LOGIC: Liếc mắt khi rảnh (Idle) ---
  useEffect(() => {
    let idleInterval;
    if (capyMood === "sleepy") {
      const gazeLoop = () => {
        const randomX = (Math.random() - 0.5) * 6;
        const randomY = (Math.random() - 0.5) * 4;
        setEyePosition({ x: randomX, y: randomY });
        const nextGaze = Math.random() * 2000 + 1500;
        idleInterval = setTimeout(gazeLoop, nextGaze);
      };
      gazeLoop();
    } else if (isAnalyzing) {
      setEyePosition({ x: 0, y: -4 }); // Nhìn lên khi đang suy nghĩ
    } else {
      if (idleInterval) clearTimeout(idleInterval);
    }
    return () => clearTimeout(idleInterval);
  }, [capyMood, isAnalyzing]);

  // --- 3. LOGIC: Mắt nhìn theo chuột (Mouse Tracking) ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (capyMood !== "sleepy" && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        // Giới hạn khoảng cách con ngươi
        const distance = Math.min(
          3.5,
          Math.hypot(e.clientX - centerX, e.clientY - centerY) / 15
        );
        setEyePosition({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [capyMood]);

  // --- HELPER: Styles ---
  const getThemeColor = () => {
    if (capyMood === "angry")
      return "bg-rose-600 text-white shadow-rose-300 ring-2 ring-rose-300";
    if (capyMood === "happy")
      return "bg-emerald-500 text-white shadow-emerald-300 ring-2 ring-emerald-300";
    if (isSmartMode)
      return "bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-purple-200";
    // Mặc định expense (đỏ) hoặc income (xanh) - ở đây tôi để mặc định đỏ cho expense, bạn có thể truyền thêm prop type nếu muốn
    return "bg-rose-500 text-white shadow-rose-200";
  };

  const getEyeColor = () => {
    if (capyMood === "angry") return "#EF4444";
    if (capyMood === "happy") return "#10B981";
    if (isSmartMode) return "#4C1D95";
    return "#374151";
  };

  const getEyebrowPath = (side) => {
    if (capyMood === "angry") return `M ${side * -6} -6 L ${side * 6} 0`;
    if (capyMood === "happy") return `M ${side * -6} -4 Q 0 -10 ${side * 6} -4`;
    if (capyMood === "excited") return `M ${side * -6} -8 L ${side * 6} -8`;
    return `M ${side * -6} -4 L ${side * 6} -4`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-100 lg:p-4 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] relative">
      <div className="w-full max-w-4xl mx-auto">
        {/* Category Toggle (Chỉ hiện khi không phải Smart Mode) */}
        {!isSmartMode && (
          <div className="absolute -top-12 left-0 right-0 h-10 px-4 flex gap-2 overflow-x-auto no-scrollbar items-center">
            {CATEGORIES_UI.expense.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm border
                  ${
                    selectedCategoryId === cat.id
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "bg-white/90 backdrop-blur text-gray-600 border-gray-100 hover:bg-gray-50"
                  }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
            <button
              onClick={onCategoryClick}
              className="flex-shrink-0 bg-white/90 backdrop-blur shadow-sm border border-gray-100 px-3 py-1.5 rounded-full text-xs text-gray-500 hover:bg-gray-200"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        )}

        {/* Wallet Selector & Indicator */}
        <div
          className={`flex justify-between items-center mb-2 lg:mb-3 px-1 transition-all ${
            isAnalyzing ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <button
            onClick={onWalletClick}
            className="flex items-center gap-2 px-2 py-1 lg:px-3 lg:py-1.5 rounded-2xl transition-colors hover:bg-gray-50 border border-transparent hover:border-gray-100 group"
          >
            <img
              src={
                WALLET_TEMPLATES.find((t) => t.code === selectedWallet?.icon)
                  ?.img
              }
              alt={selectedWallet?.name}
              className="w-5 h-5 object-contain"
            />
            <div className="text-left">
              <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                Ví nguồn
              </div>
              <div className="text-[11px] lg:text-xs font-bold flex items-center gap-1.5">
                <span style={{ color: selectedWallet?.color || "#374151" }}>
                  {selectedWallet?.name || "Tạo ví"}
                </span>
                {selectedWallet && (
                  <span className="text-gray-400 font-medium">
                    •
                  </span>
                )}
                {selectedWallet && (
                  <span className="text-indigo-500 font-extrabold tracking-tight">
                    {formatCurrency(selectedWallet.balance || 0)}
                  </span>
                )}
              </div>
            </div>
          </button>
          {isSmartMode && (
            <div className="text-[9px] lg:text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 animate-pulse uppercase tracking-widest">
              Smart Extract Active
            </div>
          )}
        </div>

        {/* Input & Button Area */}
        <div className="relative flex items-center gap-2 lg:gap-3">
          <div
            className={`flex-1 bg-gray-50 rounded-xl lg:rounded-2xl flex items-center px-3 lg:px-4 transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-offset-0 ${
              isSmartMode
                ? "focus-within:ring-purple-100"
                : "focus-within:ring-emerald-100"
            }`}
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={handleKeyDown}
              placeholder={isSmartMode ? "Nhập chi tiêu..." : "Nhập số tiền..."}
              className="w-full py-3 lg:py-4 bg-transparent outline-none text-sm lg:text-base font-medium text-gray-800 placeholder:text-gray-400"
              disabled={isAnalyzing}
            />
          </div>

          {/* NÚT CAPYBARA */}
          <button
            ref={buttonRef}
            onClick={onSend}
            disabled={!inputValue.trim() || isAnalyzing}
            className={`
              w-11 h-11 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex-shrink-0 flex items-center justify-center transition-all active:scale-95 relative overflow-hidden shadow-lg duration-500
              ${getThemeColor()}
              ${!inputValue.trim() ? "opacity-80 grayscale" : ""}
            `}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              className="absolute inset-0"
            >
              {isSmartMode && (
                <defs>
                  <linearGradient
                    id="proGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
              )}
              <rect
                width="100"
                height="100"
                fill={isSmartMode ? "url(#proGrad)" : "none"}
              />

              <rect
                x="25"
                y="45"
                width="50"
                height="35"
                rx="12"
                fill="rgba(255,255,255,0.25)"
              />
              <path
                d="M45 55 L55 55"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M50 55 L50 62"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* CON MẮT TRÁI */}
              <g transform="translate(35, 35)">
                <circle r="6" fill="white" />
                {capyMood === "sleepy" && (
                  <path
                    d="M -6 -6 L 6 -6 L 6 0 Q 0 2 -6 0 Z"
                    fill="rgba(0,0,0,0.2)"
                  />
                )}
                <g
                  transform={`translate(${eyePosition.x}, ${eyePosition.y})`}
                  style={{
                    transition:
                      capyMood === "sleepy"
                        ? "transform 0.4s ease-in-out"
                        : "transform 0.1s ease-out",
                  }}
                >
                  {isBlinking ? (
                    <path
                      d="M -4 0 L 4 0"
                      stroke={getEyeColor()}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ) : (
                    <circle r="2.5" fill={getEyeColor()} />
                  )}
                </g>
                <path
                  d={getEyebrowPath(-1)}
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* CON MẮT PHẢI */}
              <g transform="translate(65, 35)">
                <circle r="6" fill="white" />
                {capyMood === "sleepy" && (
                  <path
                    d="M -6 -6 L 6 -6 L 6 0 Q 0 2 -6 0 Z"
                    fill="rgba(0,0,0,0.2)"
                  />
                )}
                <g
                  transform={`translate(${eyePosition.x}, ${eyePosition.y})`}
                  style={{
                    transition:
                      capyMood === "sleepy"
                        ? "transform 0.4s ease-in-out"
                        : "transform 0.1s ease-out",
                  }}
                >
                  {isBlinking ? (
                    <path
                      d="M -4 0 L 4 0"
                      stroke={getEyeColor()}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ) : (
                    <circle r="2.5" fill={getEyeColor()} />
                  )}
                </g>
                <path
                  d={getEyebrowPath(1)}
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
