"use client";

import { useState, useRef, useEffect, HTMLAttributes, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";

type HiveMimeExpandableTextProps = {
  children: ReactNode;
  lines: number;
} & HTMLAttributes<HTMLDivElement>;

export function HiveMimeExpandableText({ children, lines, className, ...props }: HiveMimeExpandableTextProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setNeedsClamp(el.scrollHeight > el.clientHeight);
  }, [children, lines]);

  return (
    <div {...props} className={`${className} flex flex-col items-start gap-1`}>
      <span
        ref={ref}
        style={!expanded ? { WebkitLineClamp: lines, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" } : {}}

      >
        {children}
      </span>

      {needsClamp && (
        <Button variant="link" size="sm" className="p-0 h-auto"
          onClick={() => setExpanded(x => !x)}
        >
          {expanded ? t("common:showLess") : t("common:readMore")}
        </Button>
      )}
    </div>
  );
}