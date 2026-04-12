import { mutedColors } from "@/lib/colors";
import { motion } from "framer-motion";


export interface AnimatedBackgroundProps {
    percentage: number;
    delay?: number;
    colorStart?: string;
    colorEnd?: string;
}

export function AnimatedBackground({ percentage, delay = 0, colorStart = mutedColors.honeyBrown + "77", colorEnd = mutedColors.honeyBrown + "20" }: AnimatedBackgroundProps) {
    return (
        <motion.div
            className="absolute inset-0 rounded-md"
            initial={{ 
                background: `linear-gradient(to right, ${colorStart} 0%, ${colorEnd} 0%, transparent 0%, transparent 100%)`
            }}
            animate={{ 
                background: `linear-gradient(to right, ${colorStart} 0%, ${colorEnd} ${percentage}%, transparent 0%, transparent 100%)`
            }}
            transition={{
                duration: 1.0,
                delay: delay,
                ease: "easeOut",
            }}
        />
    );
}