import { getComputedColor } from "@/lib/colors";

type HexWrapperProps =
  {
    children: React.ReactNode;
    cornerLength?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    direction?: "horizontal" | "vertical";
  };

export function HexWrapper({
  children,
  cornerLength = 12,
  backgroundColor = "muted",
  borderColor = "border",
  borderWidth = 1,
  direction = "vertical",
}: HexWrapperProps) {
  const bg = getComputedColor(backgroundColor);
  const border = getComputedColor(borderColor);

  if (direction === "horizontal") {
    return (
      <div className="inline-flex flex-row w-fit">
        {/* left */}
        <div style={{ width: cornerLength }} className="relative z-1">
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="100,0 0,50 100,100" style={{ fill: bg }} />
            <path
              d="M100 0 L0 50 L100 100"
              fill="none"
              stroke={border}
              strokeWidth={borderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* middle */}
        <div className="relative flex items-center justify-center">
          <div
            className="relative"
            style={{
              paddingTop: borderWidth,
              paddingBottom: borderWidth,
              backgroundColor: bg,
            }}
          >
            {children}
          </div>

          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* top + bottom borders */}
            <path
              d="M0 0 L100 0 M0 100 L100 100"
              stroke={border}
              strokeWidth={borderWidth}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* right */}
        <div style={{ width: cornerLength }} className="relative">
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 100,50 0,100" style={{ fill: bg }} />
            <path
              d="M0 0 L100 50 L0 100"
              fill="none"
              stroke={border}
              strokeWidth={borderWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
    );
  }

  // existing vertical version unchanged
  return (
    <div className="inline-flex flex-col w-fit">
      {/* top */}
      <div style={{ height: cornerLength }} className="relative z-1">
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="0,100 50,0 100,100" style={{ fill: bg }} />
          <path
            d="M0 100 L50 0 L100 100"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: border, strokeWidth: borderWidth }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* middle */}
      <div className="relative flex items-center justify-center">
        <div className="relative" style={{ paddingLeft: borderWidth, paddingRight: borderWidth, backgroundColor: bg }}>
          {children}
        </div>

        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* left + right borders */}
          <path
            d="M0 0 L0 100 M100 0 L100 100"
            style={{
              stroke: border,
              strokeWidth: borderWidth,
            }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* bottom */}
      <div style={{ height: cornerLength }} className="relative">
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon points="0,0 50,100 100,0" style={{ fill: bg }} />
          <path
            d="M0 0 L50 100 L100 0"
            fill="none"
            style={{ stroke: border, strokeWidth: borderWidth }}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}