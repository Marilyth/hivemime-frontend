import { mutedColors } from "@/lib/colors";
import { motion } from "framer-motion";


export interface AnimatedBackgroundProps {
    orientation?: "horizontal" | "vertical";
    percentage: number;
    delay?: number;
    colorStart?: string;
    colorEnd?: string;
}

export function AnimatedBackground({ orientation = "horizontal", percentage, delay = 0, colorStart = mutedColors.honeyBrown + "77", colorEnd = mutedColors.honeyBrown + "20" }: AnimatedBackgroundProps) {
    const gradientDirection = orientation === "horizontal" ? "to right" : "to top";
    return (
        <motion.div
            className="absolute inset-0 rounded-md"
            initial={{ 
                background: `linear-gradient(${gradientDirection}, ${colorStart} 0%, ${colorEnd} 0%, transparent 0%, transparent 100%)`
            }}
            animate={{ 
                background: `linear-gradient(${gradientDirection}, ${colorStart} 0%, ${colorEnd} ${percentage}%, transparent 0%, transparent 100%)`
            }}
            transition={{
                duration: 1.0,
                delay: delay,
                ease: "easeOut",
            }}
        />
    );
}