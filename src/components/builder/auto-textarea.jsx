"use client";

import { useLayoutEffect, useRef } from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Textarea that grows with its content (JS fallback for browsers without `field-sizing: content`).
// Accepts a `ref` so callers can read the selection.
export default function AutoTextarea({ value, className, ref, ...props }) {
  const innerRef = useRef(null);

  useLayoutEffect(() => {
    const el = innerRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);

  function setRefs(node) {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }

  return <Textarea ref={setRefs} value={value} rows={1} className={cn("resize-none overflow-hidden", className)} {...props} />;
}
