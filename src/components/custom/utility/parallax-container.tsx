import React from "react";

export type ParallaxContainerProps ={
  children: React.ReactNode;
  distance: number;
} & React.HTMLAttributes<HTMLDivElement>;

export function ParallaxContainer({ children, distance, className, style }: ParallaxContainerProps) {
  const [offset, setOffset] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const scale = 1 / distance;

  React.useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };

    const el = document.body;

    const ro = new ResizeObserver(() => {
      setHeight(document.body.scrollHeight);
    });

    ro.observe(el);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={`fixed inset-0 ${className}`}
      style={{ height: height, transform: `translateY(${-offset * scale}px)`, ...style }}
    >
      {children}
    </div>
  );
}