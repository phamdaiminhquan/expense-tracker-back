import { useState, useEffect, RefObject } from 'react';
import { useIsMobile } from './use-mobile.hook';

/**
 * Hook chuyên dụng để xử lý việc liếc mắt của Capybara theo con trỏ chuột
 * @param ref Ref của container chứa Capybara để tính toán tâm điểm
 * @param enabled Cho phép hoặc tạm dừng việc theo dõi (ví dụ: khi đang focus input)
 * @param onInteraction Callback khi có tương tác chuột (để reset idle timer)
 */
export function useCapyEyeTracking(
  ref: RefObject<HTMLElement | null>, 
  enabled: boolean = true,
  onInteraction?: () => void
) {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    // Không track trên mobile hoặc khi bị disable
    if (!enabled || isMobile) return;

    let rafId: number | null = null;
    let lastPos = { x: 0, y: 0 };

    const calculateEyePosition = (clientX: number, clientY: number) => {
      if (!ref.current) return { x: 0, y: 0 };

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Tính toán hướng từ Capybara đến con trỏ
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Giới hạn trong phạm vi 2 đơn vị (phù hợp với pupil bounds của CapyFace)
      const maxRange = 2;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normalizedDistance = Math.min(distance / 200, 1); // 200px là khoảng cách tối đa để đạt biên độ mắt

      const x = (deltaX / (distance || 1)) * maxRange * normalizedDistance;
      const y = (deltaY / (distance || 1)) * maxRange * normalizedDistance;

      return { x, y };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (onInteraction) onInteraction();

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          const pos = calculateEyePosition(e.clientX, e.clientY);
          
          // Chỉ cập nhật nếu vị trí thay đổi đáng kể để tránh re-render thừa
          const deltaX = Math.abs(pos.x - lastPos.x);
          const deltaY = Math.abs(pos.y - lastPos.y);
          
          if (deltaX > 0.1 || deltaY > 0.1) {
            setEyePosition(pos);
            lastPos = pos;
          }
          rafId = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [ref, enabled, isMobile, onInteraction]);

  return { eyePosition, setEyePosition };
}
