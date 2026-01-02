import React, { useState, useEffect, useMemo, memo } from 'react';

// ==========================================
// 1. TYPE DEFINITIONS (Định nghĩa kiểu dữ liệu)
// ==========================================

export type CapyMood = 
  | 'scanner'      // Đang quét/kiểm tra
  | 'simp'         // Mê tít / Thấy tiền
  | 'disappointed' // Thất vọng / Chê
  | 'angry'        // Quạu
  | 'happy'        // Vui vẻ
  | 'sleepy'       // Buồn ngủ
  | 'shy'          // Ngại ngùng
  | 'neutral'      // Bình thường (Mới thêm để fallback)
  | 'focused'      // Tập trung (Giữ lại cho tương thích)
  | 'surprised'    // Ngạc nhiên (Giữ lại cho tương thích)
  | 'excited';     // Phấn khích (Giữ lại cho tương thích)

// Props cho Component chính
export interface CapybaraProps {
  mood?: CapyMood;           // Trạng thái cảm xúc (Mặc định: scanner)
  eyePos?: { x: number; y: number }; // Vị trí con ngươi (Mặc định: {0,0})
  className?: string;        // Class tùy chỉnh thêm
  scale?: number;            // Tỉ lệ thu phóng (Mặc định: 1)
}

// ==========================================
// 2. CONFIGURATION & STYLES (Cấu hình & CSS)
// ==========================================

const EYES_CONFIG = {
  LEFT_CENTER: { x: 25, y: 29 },
  RIGHT_CENTER: { x: 65, y: 29 },
  BASE_RADIUS: 5,
};

// CSS được tối ưu hóa, gộp gọn
const capybaraGlobalStyles = `
  :root {
    --capy-fur: #8D6E63;
    --capy-dark: #5D4037;
    --capy-vest: #1e1e2e;
    --shirt-white: #ffffff;
    --gold: #fbbf24;     
    --orange-skin: #FB8C00;
    --leaf-green: #43A047;
  }

  /* --- Keyframes Animations --- */
  /* Scanner: liếc nhẹ nhàng trong phạm vi nhỏ */
  @keyframes scanEyes { 0%, 100% { transform: translate(-1px, 0); } 50% { transform: translate(1px, 0); } }
  /* Eye roll: đảo mắt nhẹ, không vượt ra ngoài */
  @keyframes eyeRoll { 0%, 100% { transform: translateY(-0.5px); } 25% { transform: translate(0.5px, -0.5px); } 50% { transform: translateY(-0.5px); } 75% { transform: translate(-0.5px, -0.5px); } }
  @keyframes faceShake { 0%, 100% { transform: translateX(0) rotate(0deg); } 20% { transform: translateX(-1.5px) rotate(-0.5deg); } 40% { transform: translateX(1.5px) rotate(0.5deg); } 60% { transform: translateX(-1px) rotate(-0.3deg); } 80% { transform: translateX(1px) rotate(0.3deg); } }
  @keyframes simpPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }
  /* Sleep: chỉ drift nhẹ */
  @keyframes sleepDrift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(0, 0.5px); } }
  @keyframes sparkleTwinkle { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1); } }
  @keyframes balance { 0%, 100% { transform: translate(-50%, 0) rotate(0deg); } 25% { transform: translate(-50%, 1px) rotate(-3deg); } 75% { transform: translate(-50%, 1px) rotate(3deg); } }
  @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }

  /* --- Utility Classes --- */
  .anim-scan { animation: scanEyes 1s ease-in-out infinite; }
  .anim-roll { animation: eyeRoll 1.5s ease-in-out infinite; }
  .anim-shake { animation: faceShake 0.6s ease-in-out; }
  .anim-simp { animation: simpPulse 2s ease-in-out infinite; }
  .anim-sleep { animation: sleepDrift 3s ease-in-out infinite; }
  .anim-sparkle { animation: sparkleTwinkle 2s ease-in-out infinite; }
  
  /* Smooth transitions cho tất cả thay đổi */
  .capy-transition { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); }
  .capy-path-transition { transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .capy-pupil-transition { transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), fill 0.5s ease; }
  .capy-color-transition { transition: fill 0.5s ease, stroke 0.5s ease, opacity 0.5s ease; }
  .capy-size-transition { transition: r 0.4s ease, transform 0.4s ease; }
  .capy-fade { transition: opacity 0.5s ease-in-out; }

  /* --- Layout Classes --- */
  .capy-wrapper { position: relative; width: 160px; height: 150px; display: flex; justify-content: center; animation: breathe 4s ease-in-out infinite; }
  .capy-body { position: absolute; bottom: 0; width: 110px; height: 75px; background-color: var(--capy-fur); border-radius: 45px 45px 25px 25px; box-shadow: 0 10px 30px 8px rgba(0,0,0,0.25); z-index: 1; overflow: hidden; }
  .capy-vest-layer { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background-color: var(--capy-vest); clip-path: polygon(0% 0%, 25% 0%, 50% 45%, 75% 0%, 100% 0%, 100% 100%, 0% 100%); z-index: 2; }
  .capy-vest-layer::after { content: ''; position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%); width: 5px; height: 5px; border-radius: 50%; background: var(--gold); box-shadow: 0 -10px 0 var(--gold); }
  .capy-shirt-layer { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; background: var(--shirt-white); clip-path: polygon(0 0, 100% 0, 50% 80%); z-index: 1; }
  
  .capy-head { position: absolute; top: 20px; width: 90px; height: 80px; background-color: var(--capy-fur); border-radius: 45% 45% 40% 40%; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 5; }
  .capy-face-layer { position: relative; width: 100%; height: 100%; }
  .capy-ear { position: absolute; top: 20px; width: 16px; height: 16px; background-color: var(--capy-dark); border-radius: 50%; z-index: 0; }
  .ear-L { left: 35px; } .ear-R { right: 35px; }
  .capy-nose { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); width: 40px; height: 46px; background-color: #5c442c; border-radius: 50% 50% 35% 35%; z-index: 5; }
  .capy-mouth { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 2px; height: 10px; background-color: #000; z-index: 6; }
  
  .capy-fruit { position: absolute; top: -6px; left: 50%; transform: translateX(-50%); width: 32px; height: 28px; background: radial-gradient(circle at 30% 30%, #FFB74D, var(--orange-skin)); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); z-index: 10; animation: balance 3s ease-in-out infinite; }
  .capy-fruit::before { content: ''; position: absolute; top: -4px; left: 50%; width: 12px; height: 6px; background-color: var(--leaf-green); border-radius: 10px 0px 10px 0px; transform: rotate(-10deg); }
  .capy-fruit::after { content: ''; position: absolute; top: 0; left: 50%; width: 2px; height: 3px; background-color: #3e2723; transform: translateX(-50%); }
`;

// ==========================================
// 3. LOGIC HELPERS (Hàm tính toán)
// ==========================================

// Giới hạn con ngươi trong lòng đen
const clampPupilPosition = (
  offsetX: number, 
  offsetY: number, 
  eyeRadius: number, 
  pupilRadius: number
): { x: number; y: number } => {
  // Khoảng cách tối đa con ngươi có thể di chuyển (để không vượt ra ngoài)
  const maxOffset = eyeRadius - pupilRadius - 0.5; // -0.5 để có margin nhỏ
  
  // Tính khoảng cách từ tâm
  const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  
  // Nếu vượt quá giới hạn, scale lại
  if (distance > maxOffset && distance > 0) {
    const scale = maxOffset / distance;
    return {
      x: offsetX * scale,
      y: offsetY * scale
    };
  }
  
  return { x: offsetX, y: offsetY };
};

// Tính toán màu mắt dựa trên mood
const getEyeColor = (mood: CapyMood) => {
  switch (mood) {
    case 'scanner': return '#F59E0B'; // Vàng cam
    case 'disappointed': return '#6B7280'; // Xám
    case 'simp': return '#EC4899'; // Hồng
    case 'angry': return '#EF4444'; // Đỏ
    case 'happy': 
    case 'excited': return '#10B981'; // Xanh lá
    case 'shy': return '#A78BFA'; // Tím nhạt - ngại ngùng
    default: return '#FFFFFF'; // TRẮNG - để nhìn rõ trên lòng đen
  }
};

// Tính toán kích thước con ngươi
const getPupilRadius = (mood: CapyMood) => {
  switch (mood) {
    case 'simp': return 3.2; 
    case 'scanner': return 2.5;
    case 'disappointed': return 1.5;
    case 'surprised': return 2;
    default: return 2;
  }
};

// Tính toán đường cong lông mày (Core Logic)
const getEyebrowPath = (centerX: number, centerY: number, side: -1 | 1, mood: CapyMood) => {
  const baseY = centerY - 8;
  const w = 6; 

  switch (mood) {
    case 'scanner': // Nhíu mày tập trung
      return `M ${centerX - w} ${baseY + 1} L ${centerX + w} ${baseY + 3}`;
    
    case 'angry': // Chéo ngược hướng nhau (Left: \ Right: /)
      const yOffset = side === -1 ? 0 : 4;
      const yEnd = side === -1 ? 4 : 0;
      return `M ${centerX - w} ${baseY + yOffset} L ${centerX + w} ${baseY + yEnd}`;

    case 'simp': // Cong vòng cung hạnh phúc
      return `M ${centerX - w} ${baseY - 2} Q ${centerX} ${baseY - 6} ${centerX + w} ${baseY - 2}`;

    case 'disappointed': // Nghiêng buồn (Left: / Right: \)
      const yD1 = side === -1 ? 0 : -3;
      const yD2 = side === -1 ? -3 : 0;
      return `M ${centerX - w} ${baseY + yD1} L ${centerX + w} ${baseY + yD2}`;
    
    case 'sleepy': // Phẳng lì
      return `M ${centerX - w} ${baseY} L ${centerX + w} ${baseY}`;

    case 'surprised': // Bay vút lên cao
      return `M ${centerX - w} ${baseY - 6} Q ${centerX} ${baseY - 10} ${centerX + w} ${baseY - 6}`;

    case 'happy':
    case 'shy': // Cong nhẹ
      return `M ${centerX - w} ${baseY - 1} Q ${centerX} ${baseY - 4} ${centerX + w} ${baseY - 1}`;
    
    default: // Ngang mặc định
      return `M ${centerX - w} ${baseY} L ${centerX + w} ${baseY}`;
  }
};

// Tính toán mí mắt (cho sleepy/scanner)
const getEyelidPath = (cx: number, cy: number, mood: CapyMood) => {
  if (mood === 'scanner') return `M ${cx-6} ${cy-6} L ${cx+6} ${cy-6} L ${cx+6} ${cy} Q ${cx} ${cy+1} ${cx-6} ${cy} Z`;
  if (mood === 'sleepy') return `M ${cx-6} ${cy-6} L ${cx+6} ${cy-6} L ${cx+6} ${cy} L ${cx-6} ${cy} Z`;
  return null;
};

// ==========================================
// 4. SUB-COMPONENTS (Thành phần con)
// ==========================================

// SVG Eyes Layer - Được Memoized để tối ưu hiệu năng
const CapyFaceLayer = memo(({ mood, eyePos, isBlinking }: { mood: CapyMood, eyePos: {x:number, y:number}, isBlinking: boolean }) => {
  
  // Tính toán trước các giá trị (Optimization)
  const eyeColor = useMemo(() => getEyeColor(mood), [mood]);
  const pupilRadius = useMemo(() => getPupilRadius(mood), [mood]);
  
  // Config các flag hiển thị
  const showSparkle = ['happy', 'shy', 'simp'].includes(mood);
  const showBlush = ['shy', 'happy', 'simp'].includes(mood);
  const blushOpacity = mood === 'shy' ? 0.4 : 0.2;

  // Animation Classes
  const pupilClass = 
    mood === 'scanner' ? 'anim-scan' : 
    mood === 'simp' ? 'anim-simp' : 
    mood === 'disappointed' ? 'anim-roll' : 
    mood === 'sleepy' ? 'anim-sleep' : '';
  
  const faceClass = mood === 'disappointed' ? 'anim-shake' : '';

  // Tính toán vị trí con ngươi (giới hạn biên độ để không vượt ra ngoài lòng đen)
  const getPupilOffset = () => {
    let offX = eyePos.x;
    let offY = eyePos.y;
    
    // Override cứng cho các mood đặc biệt
    if (mood === 'scanner') { offX = 0; offY = 0.8; }
    if (mood === 'disappointed') { offX = 0; offY = -1; }
    
    // Giới hạn con ngươi trong lòng đen
    return clampPupilPosition(offX, offY, EYES_CONFIG.BASE_RADIUS, pupilRadius);
  };

  const pupilOffset = getPupilOffset();

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 90 80" 
      className={`overflow-visible ${faceClass}`} 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        zIndex: 10,
        transition: 'transform 0.3s ease'
      }}
    >
        
        {/* Lớp Má Hồng - luôn render, chỉ thay đổi opacity */}
        <g style={{ opacity: showBlush ? blushOpacity : 0, transition: 'opacity 0.6s ease-in-out' }}>
           <ellipse cx={EYES_CONFIG.LEFT_CENTER.x - 5} cy={EYES_CONFIG.LEFT_CENTER.y + 12} rx="6" ry="3" fill="#FF8A80" />
           <ellipse cx={EYES_CONFIG.RIGHT_CENTER.x + 5} cy={EYES_CONFIG.RIGHT_CENTER.y + 12} rx="6" ry="3" fill="#FF8A80" />
        </g>

        {/* --- MẮT TRÁI --- */}
        <g className="capy-transition">
           {/* Lòng đen (tròng mắt) */}
           <circle 
             cx={EYES_CONFIG.LEFT_CENTER.x} 
             cy={EYES_CONFIG.LEFT_CENTER.y} 
             r={EYES_CONFIG.BASE_RADIUS} 
             fill={mood === 'scanner' || mood === 'simp' ? '#fff' : '#000'} 
             stroke="#fff" 
             strokeWidth={mood === 'scanner' || mood === 'simp' ? 0 : 2}
             className="capy-color-transition"
           />
           
           {/* Con ngươi - giới hạn trong lòng đen */}
           <g 
             style={{ 
               transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
               transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
             }} 
             className={pupilClass}
           >
               <circle 
                 cx={EYES_CONFIG.LEFT_CENTER.x} 
                 cy={EYES_CONFIG.LEFT_CENTER.y} 
                 r={pupilRadius} 
                 fill={eyeColor}
                 style={{ transition: 'fill 0.5s ease, r 0.4s ease' }}
               />
               <circle 
                 cx={EYES_CONFIG.LEFT_CENTER.x + 1} 
                 cy={EYES_CONFIG.LEFT_CENTER.y - 1} 
                 r="0.6" 
                 fill="white" 
                 className="anim-sparkle"
                 style={{ opacity: showSparkle ? 1 : 0, transition: 'opacity 0.5s ease' }}
               />
           </g>

           {/* Mí mắt & Lông mày */}
           {getEyelidPath(EYES_CONFIG.LEFT_CENTER.x, EYES_CONFIG.LEFT_CENTER.y, mood) && (
               <path d={getEyelidPath(EYES_CONFIG.LEFT_CENTER.x, EYES_CONFIG.LEFT_CENTER.y, mood)!} fill="var(--capy-fur)" className="capy-transition" />
           )}
           <path d={getEyebrowPath(EYES_CONFIG.LEFT_CENTER.x, EYES_CONFIG.LEFT_CENTER.y, -1, mood)} stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" className="capy-path-transition" />
        </g>

        {/* --- MẮT PHẢI --- */}
        <g className="capy-transition">
           {/* Lòng đen (tròng mắt) */}
           <circle 
             cx={EYES_CONFIG.RIGHT_CENTER.x} 
             cy={EYES_CONFIG.RIGHT_CENTER.y} 
             r={EYES_CONFIG.BASE_RADIUS} 
             fill={mood === 'scanner' || mood === 'simp' ? '#fff' : '#000'} 
             stroke="#fff" 
             strokeWidth={mood === 'scanner' || mood === 'simp' ? 0 : 2}
             className="capy-color-transition"
           />
           
           {/* Con ngươi - giới hạn trong lòng đen */}
           <g 
             style={{ 
               transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
               transition: 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)'
             }} 
             className={pupilClass}
           >
               <circle 
                 cx={EYES_CONFIG.RIGHT_CENTER.x} 
                 cy={EYES_CONFIG.RIGHT_CENTER.y} 
                 r={pupilRadius} 
                 fill={eyeColor}
                 style={{ transition: 'fill 0.5s ease, r 0.4s ease' }}
               />
               <circle 
                 cx={EYES_CONFIG.RIGHT_CENTER.x + 1} 
                 cy={EYES_CONFIG.RIGHT_CENTER.y - 1} 
                 r="0.6" 
                 fill="white" 
                 className="anim-sparkle"
                 style={{ opacity: showSparkle ? 1 : 0, transition: 'opacity 0.5s ease' }}
               />
           </g>

           {/* Mí mắt & Lông mày */}
           {getEyelidPath(EYES_CONFIG.RIGHT_CENTER.x, EYES_CONFIG.RIGHT_CENTER.y, mood) && (
               <path d={getEyelidPath(EYES_CONFIG.RIGHT_CENTER.x, EYES_CONFIG.RIGHT_CENTER.y, mood)!} fill="var(--capy-fur)" className="capy-transition" />
           )}
           <path d={getEyebrowPath(EYES_CONFIG.RIGHT_CENTER.x, EYES_CONFIG.RIGHT_CENTER.y, 1, mood)} stroke="#3E2723" strokeWidth="2" strokeLinecap="round" fill="none" className="capy-path-transition" />
        </g>

        {/* --- HIỆU ỨNG CHỚP MẮT --- */}
        {isBlinking && (
            <>
               <path d={`M ${EYES_CONFIG.LEFT_CENTER.x-5} ${EYES_CONFIG.LEFT_CENTER.y} L ${EYES_CONFIG.LEFT_CENTER.x+5} ${EYES_CONFIG.LEFT_CENTER.y}`} stroke="var(--capy-fur)" strokeWidth="6" />
               <path d={`M ${EYES_CONFIG.LEFT_CENTER.x-5} ${EYES_CONFIG.LEFT_CENTER.y} L ${EYES_CONFIG.LEFT_CENTER.x+5} ${EYES_CONFIG.LEFT_CENTER.y}`} stroke="#000" strokeWidth="2" />
               <path d={`M ${EYES_CONFIG.RIGHT_CENTER.x-5} ${EYES_CONFIG.RIGHT_CENTER.y} L ${EYES_CONFIG.RIGHT_CENTER.x+5} ${EYES_CONFIG.RIGHT_CENTER.y}`} stroke="var(--capy-fur)" strokeWidth="6" />
               <path d={`M ${EYES_CONFIG.RIGHT_CENTER.x-5} ${EYES_CONFIG.RIGHT_CENTER.y} L ${EYES_CONFIG.RIGHT_CENTER.x+5} ${EYES_CONFIG.RIGHT_CENTER.y}`} stroke="#000" strokeWidth="2" />
            </>
        )}
    </svg>
  );
});

// ==========================================
// 5. MAIN COMPONENT (Component Chính)
// ==========================================

export const Capybara: React.FC<CapybaraProps> = ({ 
  mood = 'scanner', 
  eyePos = { x: 0, y: 0 }, 
  className = '',
  scale = 1 
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  // Logic tự động chớp mắt
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 2000); // Ngẫu nhiên từ 4-6 giây
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <>
      <style>{capybaraGlobalStyles}</style>
      <div 
        className={`capy-wrapper ${className}`} 
        style={{ transform: `scale(${scale})` }}
        role="img" 
        aria-label={`Capybara feeling ${mood}`}
      >
        <div className="capy-ear ear-L"></div>
        <div className="capy-ear ear-R"></div>
        
        <div className="capy-body">
            <div className="capy-shirt-layer"></div>
            <div className="capy-vest-layer"></div>
        </div>
        
        <div className="capy-head">
            <div className="capy-face-layer">
                {/* Layer Mắt/Mày/Cảm xúc - Được tách riêng để tối ưu */}
                <CapyFaceLayer mood={mood} eyePos={eyePos} isBlinking={isBlinking} />
                
                {/* Mũi & Miệng (Tĩnh) */}
                <div className="capy-nose"></div>
                <div className="capy-mouth"></div>
            </div>
        </div>
        
        <div className="capy-fruit"></div>
      </div>
    </>
  );
};

// Export mặc định và alias cho tương thích ngược
export default Capybara;

// Alias để tương thích với code cũ (CapyFace)
export { Capybara as CapyFace };
