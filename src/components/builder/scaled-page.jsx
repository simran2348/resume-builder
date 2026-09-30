"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// A4 at 96 DPI.
export const PAGE_WIDTH = 794;
export const PAGE_HEIGHT = 1123;

// Renders children on a real-size A4 page, scaled down to fit the container width.
// `clip` crops to exactly one page (used for thumbnails).
export default function ScaledPage({ children, clip = false, className }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / PAGE_WIDTH));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("w-full", clip && "overflow-hidden", className)}>
      <div style={{ height: PAGE_HEIGHT * scale }}>
        <div
          className={cn("origin-top-left bg-white", scale === 0 && "invisible")}
          style={{
            width: PAGE_WIDTH,
            minHeight: PAGE_HEIGHT,
            height: clip ? PAGE_HEIGHT : undefined,
            overflow: clip ? "hidden" : undefined,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
