"use client";

import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X } from "lucide-react";

import RichTextarea from "@/components/builder/rich-textarea";
import { Button } from "@/components/ui/button";
import { EXPERIENCE_CONFIG } from "@/constants/builder";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

const bulletInputId = (bulletId) => `bullet-${bulletId}`;

// Wait for the new/remaining bullet to render before focusing it.
function focusBullet(bulletId, atEnd = false) {
  requestAnimationFrame(() => {
    const el = document.getElementById(bulletInputId(bulletId));
    if (!el) return;
    el.focus();
    if (atEnd) el.setSelectionRange(el.value.length, el.value.length);
  });
}

// Bullet points for one experience entry: auto-growing textareas, reorderable by drag (or keyboard via the handle).
export default function SortableBullets({ jobId, bullets }) {
  const addBullet = useBuilderStore((state) => state.addBullet);
  const updateBullet = useBuilderStore((state) => state.updateBullet);
  const removeBullet = useBuilderStore((state) => state.removeBullet);
  const moveBullet = useBuilderStore((state) => state.moveBullet);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const from = bullets.findIndex((b) => b.id === active.id);
    const to = bullets.findIndex((b) => b.id === over.id);
    moveBullet(jobId, from, to);
  }

  function handleKeyDown(e, index, bullet) {
    // Enter starts a new point (Shift+Enter still inserts a line break).
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      focusBullet(addBullet(jobId, index + 1));
    }
    // Backspace on an empty point removes it and jumps to the previous one.
    if (e.key === "Backspace" && !bullet.text && bullets.length > 1) {
      e.preventDefault();
      removeBullet(jobId, bullet.id);
      focusBullet(bullets[index - 1]?.id ?? bullets[index + 1].id, true);
    }
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={bullets.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {bullets.map((bullet, index) => (
              <BulletRow
                key={bullet.id}
                bullet={bullet}
                index={index}
                canRemove={bullets.length > 1}
                onChange={(text) => updateBullet(jobId, bullet.id, text)}
                onRemove={() => removeBullet(jobId, bullet.id)}
                onKeyDown={(e) => handleKeyDown(e, index, bullet)}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => focusBullet(addBullet(jobId))}
        className="mt-2 text-brand hover:bg-brand-glow hover:text-brand"
      >
        <Plus />
        Add bullet point
      </Button>
    </div>
  );
}

function BulletRow({ bullet, index, canRemove, onChange, onRemove, onKeyDown }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: bullet.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("group/bullet flex items-start gap-1", isDragging && "relative z-10 opacity-90")}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`Reorder bullet point ${index + 1}`}
        className="mt-1.5 flex h-7 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/60 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <RichTextarea
        id={bulletInputId(bullet.id)}
        value={bullet.text}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={index === 0 ? EXPERIENCE_CONFIG.bulletPlaceholder : "Another achievement or responsibility"}
        aria-label={`Bullet point ${index + 1}`}
        className={cn("min-h-10 bg-background py-2 leading-relaxed", isDragging && "shadow-lg")}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={`Remove bullet point ${index + 1}`}
        className="mt-1.5 shrink-0 text-muted-foreground hover:text-destructive"
      >
        <X />
      </Button>
    </li>
  );
}
