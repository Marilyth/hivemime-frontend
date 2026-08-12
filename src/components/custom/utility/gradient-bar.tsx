import { cn } from "@/lib/utils";
import { mutedColors } from "@/lib/colors";
import { motion } from "framer-motion";
import { useRef } from "react";

const DEFAULT_START_COLOR = mutedColors.gray + "BB";
const DEFAULT_END_COLOR = mutedColors.red + "BB";

type GradientBarProps = {
  min: number;
  max: number;
  current: number | null;
  startColor?: string;
  endColor?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const GradientBar = ({ min, max, current, startColor = DEFAULT_START_COLOR, endColor = DEFAULT_END_COLOR, className, ...props }: GradientBarProps) => {
  const lastRatioRef = useRef<number | null>(null);
  const span = max - min;
  const ratio = current != null
    ? span === 0
      ? 1
      : Math.max(0, Math.min(1, (current - min) / span))
    : null;

  const previousRatio = lastRatioRef.current;
  if (ratio != null)
    lastRatioRef.current = ratio;

  return (
    <div
      className={cn("relative h-3 w-full shrink-0 rounded-sm", className)}
      style={{ background: `linear-gradient(to right, ${startColor}, ${endColor})` }}
      {...props}
    >
      {ratio != null && (
        <motion.div
          className="absolute inset-0"
          initial={{ left: previousRatio != null ? `${previousRatio * 100}%` : `${ratio * 100}%` }}
          animate={{ left: `${ratio * 100}%` }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        >
          <div className="absolute top-0 h-full w-0.5 -translate-x-1/2 bg-foreground" />
        </motion.div>
      )}
    </div>
  );
};
