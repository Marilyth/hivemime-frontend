import { ParallaxContainer } from "./parallax-container";
import { useEffect, useState, useRef } from "react";

interface HoneyCombProps {
  combSize: number;
  combMatrix: number[][];
}

function Hexagon({ size }: { size: number }) {
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
        fill="color-mix(in srgb, currentColor 50%, transparent)"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function HoneycombGroup({ combSize, combMatrix }: HoneyCombProps) {
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
          <Hexagon size={combSize} />
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
  color: string;
}

export function CombGenerator({ distances, color }: CombGeneratorProps) {
  const [combs, setCombs] = useState<GeneratorCombs[]>(distances.map((distance) => ({ distance, combs: [] })));
  const lastRenderedScroll = useRef<number | null>(null);

  function generateCombs() {
    const height = window.pageYOffset;
    const stepSize = 600;

    // Don't generate new combs on every scroll event to avoid performance issues.
    if (lastRenderedScroll.current !== null && Math.abs(height - lastRenderedScroll.current) < stepSize / 2)
      return;

    lastRenderedScroll.current = height;

    for (const gen of combs) {
      const effectiveStep = stepSize / gen.distance;
      const effectiveOffset = height / gen.distance;
      const effectiveEnd = window.innerHeight + effectiveOffset + effectiveStep;
      const effectiveStart = effectiveOffset - effectiveStep;

      gen.combs = gen.combs.filter(comb => comb.y >= effectiveStart && comb.y <= effectiveEnd);

      const startY = gen.combs.length > 0 ? gen.combs[0].y - effectiveStep : 0;
      const endY = gen.combs.length > 0 ? gen.combs[gen.combs.length - 1].y + effectiveStep : 0;
      const combSize = 128 / gen.distance;
      const matrixDimension = 3;

      const generateComb = (y: number, previousCombX: number) => {
        const halfWidth = window.innerWidth / 2;
        let x = Math.random() * halfWidth;

        // Flip combs between left and right to create a more even pattern.
        if (previousCombX < halfWidth)
          x += halfWidth;

        const combMatrix = Array.from({ length: matrixDimension }, () =>
          Array.from({ length: matrixDimension }, () => Math.random() < 0.85 ? 1 : 0)
        );

        return { x, y, props: { combSize, combMatrix } };
      }

      // Add new combs after the last one.
      for (let y = endY; y <= effectiveEnd; y += effectiveStep) {
        const lastX = gen.combs.length > 0 ? gen.combs[gen.combs.length - 1].x : 0;
        gen.combs.push(generateComb(y, lastX));
      }

      // Add new combs before the first one.
      for (let y = startY; y >= effectiveStart; y -= effectiveStep) {
        const firstX = gen.combs.length > 0 ? gen.combs[0].x : 0;
        gen.combs = [generateComb(y, firstX), ...gen.combs];
      }
    }

    setCombs([...combs]);
  }

  useEffect(() => {
    window.addEventListener("scroll", generateCombs);
    generateCombs();

    return () => {
      window.removeEventListener("scroll", generateCombs);
    };
  }, []);

  return (
    <div style={{color: color}}>
      <ParallaxContainer className="blur-[4px]" distance={12} style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden'}}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
              <svg width='29' height='50.115' xmlns='http://www.w3.org/2000/svg'>
                <path fill='color-mix(in srgb, ${color} 30%, transparent)' stroke='color-mix(in srgb, ${color} 15%, transparent)' stroke-width='3.5' d='M14.498 16.858 0 8.488.002-8.257l14.5-8.374L29-8.26l-.002 16.745zm0 50.06L0 58.548l.002-16.745 14.5-8.373L29 41.8l-.002 16.744zM28.996 41.8l-14.498-8.37.002-16.744L29 8.312l14.498 8.37-.002 16.745zm-29 0-14.498-8.37.002-16.744L0 8.312l14.498 8.37-.002 16.745z'/>
              </svg>
            `)}")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </ParallaxContainer>

      {combs.map((gen) => (
        <ParallaxContainer key={gen.distance} distance={gen.distance} style={{filter: `blur(${gen.distance / 2}px)`, WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden'}}>
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