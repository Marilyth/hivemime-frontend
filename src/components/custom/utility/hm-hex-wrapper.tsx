import { getComputedColor } from "@/lib/colors";
import React from "react";

type HexWrapperProps = {
  children: React.ReactNode;
  pointRatio?: number;
  borderColor?: string;
  orientation?: 'horizontal' | 'vertical'; 
} & React.HTMLAttributes<HTMLDivElement>;

export default function HexWrapper({ 
  children, 
  pointRatio = 0.2, 
  borderColor = 'border',
  orientation = 'horizontal',
  ...props 
}: HexWrapperProps) {
  const hexRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (hexRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setDimensions({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      });
      resizeObserver.observe(hexRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  // Calculate responsive point size based on dimensions
  const cornerCut = React.useMemo(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return 0;
    return Math.round(Math.min(dimensions.width, dimensions.height) * pointRatio);
  }, [dimensions, pointRatio, orientation]);

  // Calculate clip-path and SVG coordinates based on orientation
  const getClipPath = () => {
    if (orientation === 'vertical') {
      return `polygon(
        0% ${cornerCut}px,
        50% 0%,
        100% ${cornerCut}px,
        100% calc(100% - ${cornerCut}px),
        50% 100%,
        0% calc(100% - ${cornerCut}px)
      )`;
    } else {
      return `polygon(
        ${cornerCut}px 0%, 
        calc(100% - ${cornerCut}px) 0%, 
        100% 50%, 
        calc(100% - ${cornerCut}px) 100%, 
        ${cornerCut}px 100%, 
        0% 50%
      )`;
    }
  };

  const getSVGPoints = () => {
    if (orientation === 'vertical') {
      return `0,${cornerCut} ${dimensions.width / 2},0 ${dimensions.width},${cornerCut} ${dimensions.width},${dimensions.height - cornerCut} ${dimensions.width / 2},${dimensions.height} 0,${dimensions.height - cornerCut}`;
    } else {
      return `${cornerCut},0 ${dimensions.width - cornerCut},0 ${dimensions.width},${dimensions.height / 2} ${dimensions.width - cornerCut},${dimensions.height} ${cornerCut},${dimensions.height} 0,${dimensions.height / 2}`;
    }
  };

  return (
    <div
      {...props}
      className={`relative inline-block ${props.className || ""}`}
    >
      {/* Content with hex clip-path */}
      <div
        ref={hexRef}
        style={{
          clipPath: getClipPath()
        }}
      >
        {children}
      </div>
      
      {/* SVG border overlay */}
      {dimensions.width > 0 && (
        <svg 
          className="absolute inset-0 pointer-events-none"
          width={dimensions.width}
          height={dimensions.height}
          style={{ overflow: 'visible' }}
        >
          <polygon 
            points={getSVGPoints()}
            fill="none"
            stroke={getComputedColor(borderColor)}
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
}