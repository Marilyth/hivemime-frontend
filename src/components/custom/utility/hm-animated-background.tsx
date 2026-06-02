import { motion } from "framer-motion";


export interface AnimatedBackgroundProps {
    delay?: number;
    colorSegments: ColorSegment[];
}

export interface ColorSegment {
    color: string;
    startAt: number;
    tickProps?: TickProperties;
}

export interface TickProperties {
    width?: number;
    height?: number;
}

export function AnimatedBackground({ delay = 0.25, colorSegments }: AnimatedBackgroundProps) {
    const gradientDirection = "to right";
    const lineSegments = colorSegments.filter(segment => segment.tickProps);
    const gradientSegments = colorSegments.filter(segment => !segment.tickProps);
    
    function getGradientString(): string {
        return gradientSegments.map(segment => `${segment.color} ${segment.startAt * 100}%`).join(', ');
    }

    return (
        <motion.div
            className="absolute inset-0"
            style={{
                background: `linear-gradient(${gradientDirection}, ${getGradientString()})`
            }}
            initial={{
                opacity: 0,
            }}
            animate={{ 
                opacity: 1,
            }}
            transition={{
                duration: 0.5,
                delay: delay,
                ease: "easeOut",
            }}
        >
            {lineSegments.map((segment, index) => {
                const effectiveHeight = segment.tickProps?.height ?? 1;
                const effectiveWidth = segment.tickProps?.width ?? 0.01;

                return (
                    <div
                        key={index}
                        className="absolute inset-0"
                        style={{
                            left: `${segment.startAt * 100}%`,
                            top: `${(1 - effectiveHeight) * 100}%`,
                            background: segment.color,
                            width: `${effectiveWidth * 100}%`,
                            height: `${effectiveHeight * 100}%`,
                        }}
                    />
                );
            })}
        </motion.div>
    );
}