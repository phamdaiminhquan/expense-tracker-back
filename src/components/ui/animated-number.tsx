import { useEffect, useRef } from "react";
import { useSpring, useMotionValue, useTransform, motion } from "framer-motion";
import { formatNumber } from "@/common/utils/number.utils";

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
}

export function AnimatedNumber({ value, className, prefix = "" }: AnimatedNumberProps) {
    // Dùng useSpring để tạo hiệu ứng vật lý (stiffness, damping) giúp số chạy mượt và "ease-out" tự nhiên
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const displayValue = useTransform(spring, (current) =>
        `${prefix}${formatNumber(Math.round(current))}`
    );

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span className={className}>{displayValue}</motion.span>;
}
