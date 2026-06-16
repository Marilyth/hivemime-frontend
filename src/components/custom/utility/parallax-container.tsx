import React from "react";

export type ParallaxContainerProps = {
  children: React.ReactNode;
  distance: number;
} & React.HTMLAttributes<HTMLDivElement>;

interface ParallaxLayer {
  element: HTMLElement;
  scale: number;
}

const layers: ParallaxLayer[] = [];
let scrollY = 0;
let rafId: number | null = null;
let listenerCount = 0;

function applyTransforms() {
  rafId = null;
  for (const { element, scale } of layers) {
    element.style.transform = `translateY(${-scrollY * scale}px)`;
  }
}

function onScroll() {
  scrollY = window.pageYOffset;
  if (rafId === null) {
    rafId = requestAnimationFrame(applyTransforms);
  }
}

function registerLayer(element: HTMLElement, scale: number) {
  layers.push({ element, scale });
  element.style.transform = `translateY(${-scrollY * scale}px)`;

  if (listenerCount++ === 0) {
    scrollY = window.pageYOffset;
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  return () => {
    const index = layers.findIndex((layer) => layer.element === element);
    if (index >= 0)
      layers.splice(index, 1);

    if (--listenerCount === 0) {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
}

function updateLayerHeight(element: HTMLElement) {
  element.style.height = `${document.body.scrollHeight}px`;
}

export function ParallaxContainer({ children, distance, className, style }: ParallaxContainerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const scale = 1 / distance;

  React.useEffect(() => {
    const element = ref.current;
    if (!element)
      return;

    return registerLayer(element, scale);
  }, [scale]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element)
      return;

    updateLayerHeight(element);

    const ro = new ResizeObserver(() => {
      updateLayerHeight(element);
    });

    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fixed inset-0 ${className ?? ""}`}
      style={{ willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
