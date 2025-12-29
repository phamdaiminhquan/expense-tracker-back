import React from 'react';

/**
 * RainbowSpinner
 * Hiệu ứng loading vòng tròn 3 màu (Indigo - Purple - Pink)
 * Sử dụng cho trạng thái "AI đang phân tích..."
 */
interface RainbowSpinnerProps {
  size?: string;
  className?: string;
}

export const RainbowSpinner: React.FC<RainbowSpinnerProps> = ({ 
  size = "w-4 h-4",
  className = ""
}) => {
  return (
    <div className={`relative ${size} ${className}`}>
      {/* Lớp nền mờ nhẹ */}
      <div className="absolute inset-0 rounded-full border-2 border-gray-100 opacity-20"></div>
      {/* Vòng xoay gradient 3 màu */}
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-purple-500 border-b-pink-500 animate-spin"></div>
    </div>
  );
};

export default RainbowSpinner;

