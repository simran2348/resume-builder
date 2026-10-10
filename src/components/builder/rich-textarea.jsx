"use client";

import { useRef, useState } from "react";
import { Bold, Italic, List } from "lucide-react";

import AutoTextarea from "@/components/builder/auto-textarea";
import { BOLD, ITALIC, continueBulletList, toggleBulletLines, toggleMarker } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

const FORMATS = [
  { marker: BOLD, key: "b", label: "Bold", icon: Bold },
  { marker: ITALIC, key: "i", label: "Italic", icon: Italic },
];

// Auto-growing textarea with bold / italic: a small toolbar shows while focused, and ⌘/Ctrl+B / ⌘/Ctrl+I
// toggle formatting on the selection. Formatting is stored as **bold** / *italic* markers (see rich-text.js).
// With `bullets`, a list button (⌘/Ctrl+Shift+8) turns the selected lines into "- " bullet points and Enter
// continues the list; the field can then hold paragraphs, bullet points or both.
export default function RichTextarea({ value, onChange, onKeyDown, onFocus, onBlur, className, bullets = false, ...props }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  function apply(marker) {
    const el = ref.current;
    const next = toggleMarker(value, el.selectionStart, el.selectionEnd, marker);
    onChange(next.text);
    // Restore the selection after React re-renders the new value.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(next.start, next.end);
    });
  }

  // Applies an edit that returns new text and a selection, then restores the selection after re-render.
  function applyEdit(next, start, end = start) {
    const el = ref.current;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start, end);
    });
  }

  function toggleBullets() {
    const el = ref.current;
    const next = toggleBulletLines(value, el.selectionStart, el.selectionEnd);
    applyEdit(next.text, next.start, next.end);
  }

  function handleKeyDown(e) {
    if (bullets) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "8" || e.key === "*")) {
        e.preventDefault();
        toggleBullets();
        return;
      }
      const el = ref.current;
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && el.selectionStart === el.selectionEnd) {
        const next = continueBulletList(value, el.selectionStart);
        if (next) {
          e.preventDefault();
          applyEdit(next.text, next.caret);
          return;
        }
      }
    }
    const format = (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && FORMATS.find((f) => f.key === e.key.toLowerCase());
    if (format) {
      e.preventDefault();
      apply(format.marker);
      return;
    }
    onKeyDown?.(e);
  }

  return (
    <div className="relative min-w-0 flex-1">
      <AutoTextarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        className={className}
        {...props}
      />
      <div
        role="toolbar"
        aria-label="Text formatting"
        className={cn(
          "absolute -top-3 right-2 z-10 flex items-center gap-0.5 rounded-md border border-border bg-popover p-0.5 shadow-sm transition-opacity",
          focused ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {FORMATS.map(({ marker, key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            tabIndex={-1}
            // Keep focus (and the selection) in the textarea.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => apply(marker)}
            aria-label={`${label} (Ctrl/⌘+${key.toUpperCase()})`}
            title={`${label} (Ctrl/⌘+${key.toUpperCase()})`}
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-3.5" strokeWidth={2.5} />
          </button>
        ))}
        {bullets && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleBullets}
            aria-label="Bullet list (Ctrl/⌘+Shift+8)"
            title="Bullet list (Ctrl/⌘+Shift+8)"
            className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <List className="size-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
