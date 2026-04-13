import { mutedColors } from "@/lib/colors";

export interface HoneyCombProps {
  combSize?: number;
  combMatrix: number[][];
  edgeColor?: string;
  fillColor?: string;
}

function Hexagon({ size = 64, fillColor = "currentColor", strokeColor = "currentColor" }) {
  const w = size;
  const h = size * 0.866;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 86.6"
    >
      <polygon
        points="25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
      />
    </svg>
  );
}

export function HoneycombGroup({ combSize = 64,
    combMatrix,
    edgeColor = mutedColors.honeyBrown,
    fillColor = mutedColors.honeyBrown + "40" }: HoneyCombProps) {
  const hexWidth = combSize;
  const hexHeight = combSize * 0.866;
  const xStep = hexWidth * 0.75;
  const yStep = hexHeight;

  const cells = [];
  for (let row = 0; row < combMatrix.length; row++) {
    for (let col = 0; col < combMatrix[row].length; col++) {
      if (!combMatrix[row][col])
        continue;

      const x = col * xStep;
      const y = row * yStep + (col % 2 ? hexHeight / 2 : 0);
      cells.push({ x, y, key: `${row}-${col}` });
    }
  }

  const width = (combMatrix.reduce((max, row) => Math.max(max, row.length), 0) - 1) * xStep + hexWidth;
  const height = combMatrix.length * yStep + hexHeight / 2;

  return (
    <div
      className="relative"
      style={{ width, height }}
    >
      {cells.map((cell) => (
        <div
          key={cell.key}
          className="absolute"
          style={{ left: cell.x, top: cell.y }}
        >
          <Hexagon size={combSize} fillColor={fillColor} strokeColor={edgeColor} />
        </div>
      ))}
    </div>
  );
}