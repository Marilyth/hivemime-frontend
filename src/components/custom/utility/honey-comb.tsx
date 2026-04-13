import { mutedColors } from "@/lib/colors";
import { ParallaxContainer } from "./parallax-container";
import { useEffect, useState } from "react";

interface HoneyCombProps {
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

function HoneycombGroup({ combSize = 64,
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

interface GeneratorCombs {
  distance: number;
  combs: { x: number, y: number, props: HoneyCombProps }[];
}

export interface CombGeneratorProps {
  distances: number[];
}

export function CombGenerator({ distances }: CombGeneratorProps) {
  const [combs, setCombs] = useState<GeneratorCombs[]>(distances.map((distance) => ({ distance, combs: [] })));

  function generateCombs() {
    const height = document.body.scrollHeight;

    for (const gen of combs) {
      const effectiveHeight = window.innerHeight + height / gen.distance;
      const lastY = gen.combs.length > 0 ? gen.combs[gen.combs.length - 1].y : 0;
      const step = 800 / gen.distance;
      const combSize = 128 / gen.distance;
      const matrixDimension = 3;

      console.log(`Generating combs for distance ${gen.distance}... (effective height: ${effectiveHeight}, lastY: ${lastY})`);

      // Don't render more than visible.
      for (let y = lastY + step; y < effectiveHeight + 100; y += step) {
        let x = Math.random() * window.innerWidth / 2;
        if (gen.combs.length % 2 == 0)
          x += window.innerWidth / 2;

        const combMatrix = Array.from({ length: matrixDimension }, () =>
          Array.from({ length: matrixDimension }, () => Math.random() < 0.85 ? 1 : 0)
        );

        gen.combs.push({ x, y, props: { combSize, combMatrix } });
      }
    }

    setCombs([...combs]);
  }

  useEffect(() => {
    const el = document.body;

    const ro = new ResizeObserver(() => {
      console.log("Generating combs...");
      generateCombs();
    });

    ro.observe(el);
    generateCombs();

    return () => ro.disconnect();
  }, []);

  return (
    <div>
      {combs.map((gen) => (
        <ParallaxContainer key={gen.distance} distance={gen.distance} style={{filter: `blur(${gen.distance / 2}px)`}}>
          <div className="relative">
            {gen.combs.map((comb, idx) => (
              <div
                key={idx}
                className="absolute"
                style={{ left: comb.x, top: comb.y }}
              >
                <HoneycombGroup {...comb.props} />
              </div>
            ))}
          </div>
        </ParallaxContainer>
      ))}
    </div>
  )
}