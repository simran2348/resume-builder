"use client";

import { useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X } from "lucide-react";

import { FieldError } from "@/components/builder/steps/personal-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHIP_SECTIONS } from "@/constants/builder";
import { useStepValidation } from "@/hooks/use-step-validation";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

// Chip list editor for short-name sections (skills, hobbies): add, delete and drag to reorder.
export default function ChipsStep({ section }) {
  const config = CHIP_SECTIONS[section];
  const items = useBuilderStore((state) => state[section]);
  const addItem = useBuilderStore((state) => state.addItem);
  const removeItem = useBuilderStore((state) => state.removeItem);
  const moveItem = useBuilderStore((state) => state.moveItem);
  const { errors, visited } = useStepValidation(section);
  const error = visited && errors[section];
  const inputId = `${section}-input`;

  return (
    <div className="space-y-5">
      <ChipInput
        id={inputId}
        label={config.inputLabel}
        placeholder={config.placeholder}
        hint={config.hint}
        existingNames={items.map((item) => item.name)}
        onAdd={(name) => addItem(section, { name })}
        onRemoveLast={() => items.length && removeItem(section, items[items.length - 1].id)}
        error={error}
      />

      {items.length > 0 ? (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">
            {items.length} added · drag to reorder, most important first
          </p>
          <SortableChips
            items={items}
            label={`${section} list`}
            onRemove={(id) => removeItem(section, id)}
            onMove={(activeId, overId) =>
              moveItem(
                section,
                items.findIndex((item) => item.id === activeId),
                items.findIndex((item) => item.id === overId)
              )
            }
          />
        </div>
      ) : (
        <p
          className={cn(
            "rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground",
            error ? "border-red-400 bg-red-50/50 dark:bg-red-500/5" : "border-border"
          )}
        >
          {config.emptyText}
        </p>
      )}
    </div>
  );
}

// Text input that adds one or more comma-separated names on Enter, comma, paste or the Add button,
// skipping duplicates of `existingNames` (case-insensitive). Backspace in the empty input calls `onRemoveLast`.
export function ChipInput({ id, label, hideLabel, placeholder, hint, existingNames, onAdd, onRemoveLast, error }) {
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");

  function add(text) {
    const existing = new Set(existingNames.map((name) => name.toLowerCase()));
    const names = text
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    const duplicates = [];
    for (const name of names) {
      if (existing.has(name.toLowerCase())) duplicates.push(name);
      else {
        existing.add(name.toLowerCase());
        onAdd(name);
      }
    }
    setNotice(duplicates.length ? `Already added: ${duplicates.join(", ")}` : "");
    setDraft("");
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === ",") && draft.trim()) {
      e.preventDefault();
      add(draft);
    }
    if (e.key === "Backspace" && !draft) onRemoveLast?.();
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={cn(hideLabel && "sr-only")}>
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (text.includes(",")) {
              e.preventDefault();
              add(draft + text);
            }
          }}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-10"
        />
        <Button
          onClick={() => add(draft)}
          disabled={!draft.trim()}
          className="h-10 shrink-0 bg-brand px-4 text-brand-foreground hover:bg-brand/90"
        >
          <Plus />
          Add
        </Button>
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {notice && (
        <p role="status" className="text-xs text-amber-600 dark:text-amber-400">
          {notice}
        </p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

// Wrapping row of removable chips, reordered by drag (or keyboard). `onMove(activeId, overId)`.
export function SortableChips({ items, label, onRemove, onMove }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => over && active.id !== over.id && onMove(active.id, over.id)}
    >
      <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
        <ul className="flex flex-wrap gap-2" aria-label={label}>
          {items.map((item, index) => (
            <Chip key={item.id} item={item} index={index} onRemove={() => onRemove(item.id)} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function Chip({ item, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center rounded-full border border-brand/25 bg-brand-glow text-sm text-foreground",
        isDragging && "relative z-10 shadow-lg ring-2 ring-brand/40"
      )}
    >
      <span
        {...attributes}
        {...listeners}
        aria-label={`${item.name}, position ${index + 1}. Press space to reorder.`}
        className="flex cursor-grab touch-none items-center gap-1 rounded-full py-1.5 pl-2 outline-none focus-visible:ring-2 focus-visible:ring-brand/50 active:cursor-grabbing"
      >
        <GripVertical className="size-3.5 text-muted-foreground" />
        {item.name}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${item.name}`}
        className="mr-1 ml-0.5 flex size-6 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50"
      >
        <X className="size-3.5" />
      </button>
    </li>
  );
}
