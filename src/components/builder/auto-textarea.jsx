"use client";

import { useLayoutEffect, useRef } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Textarea that grows with its content (JS fallback for browsers without `field-sizing: content`).
export default function AutoTextarea({ value, className, ...props }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);

  return <Textarea ref={ref} value={value} rows={1} className={cn("resize-none overflow-hidden", className)} {...props} />;
}
