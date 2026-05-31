import { mutedColors, mutedColorsList } from "@/lib/colors";
import { motion } from "framer-motion";


export interface AnimatedBackgroundProps {
    orientation?: "horizontal" | "vertical";
    delay?: number;
    colorSegments?: ColorSegment[];
}

export interface ColorSegment {
    color: string;
    startAtPercentage: number;
}

export function AnimatedBackground({ orientation = "horizontal", delay = 0, colorSegments }: AnimatedBackgroundProps) {
    const gradientDirection = orientation === "horizontal" ? "to right" : "to top";
    
    function getGradientString(initial: boolean): string {
        return colorSegments!.map(segment => `${segment.color} ${initial ? 0 : segment.startAtPercentage}%`).join(', ');
    }

    return (
        <motion.div
            className="absolute inset-0 rounded-md"
            initial={{ 
                background: `linear-gradient(${gradientDirection}, ${getGradientString(true)}, transparent 0%)`
            }}
            animate={{ 
                background: `linear-gradient(${gradientDirection}, ${getGradientString(false)}, transparent 0%)`
            }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: "easeOut",
            }}
        />
    );
}