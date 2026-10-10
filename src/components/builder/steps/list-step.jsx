"use client";

import { useState } from "react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Plus, Trash2, X } from "lucide-react";

import MonthYearPicker from "@/components/builder/month-year-picker";
import RichTextarea from "@/components/builder/rich-textarea";
import { FieldError } from "@/components/builder/steps/personal-step";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LIST_SECTIONS } from "@/constants/builder";
import { useStepValidation } from "@/hooks/use-step-validation";
import { formatMonthYear } from "@/lib/resume-data";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

// Generic editor for list sections defined in LIST_SECTIONS (education, projects, languages, ...).
// Items can be added, removed and dragged to reorder; `compact` sections render as single rows.
export default function ListStep({ section }) {
  const config = LIST_SECTIONS[section];
  const items = useBuilderStore((state) => state[section]);
  const addItem = useBuilderStore((state) => state.addItem);
  const moveItem = useBuilderStore((state) => state.moveItem);
  const { errors, visited } = useStepValidation(section);
  const [openIds, setOpenIds] = useState(() => new Set(items[0] ? [items[0].id] : []));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function toggle(id) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const id = addItem(section);
    setOpenIds((current) => new Set(current).add(id));
    requestAnimationFrame(() => {
      document.getElementById(`${section}-${id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      document.getElementById(`${section}-${id}-${config.fields[0].name}`)?.focus({ preventScroll: true });
    });
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    moveItem(
      section,
      items.findIndex((item) => item.id === active.id),
      items.findIndex((item) => item.id === over.id)
    );
  }

  const sectionError = visited && errors[section];

  if (!items.length) {
    return (
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border border-dashed px-6 py-10 text-center",
          sectionError ? "border-red-400 bg-red-50/50 dark:bg-red-500/5" : "border-border"
        )}
      >
        <p className="font-medium text-foreground">{config.emptyTitle}</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{config.emptyText}</p>
        <Button onClick={handleAdd} className="mt-5 h-10 bg-brand px-4 text-brand-foreground hover:bg-brand/90">
          <Plus />
          {config.addLabel}
        </Button>
        {sectionError && (
          <p role="alert" className="mt-3 text-xs text-destructive">
            {sectionError}. At least one is required.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <ul className={config.compact ? "space-y-2" : "space-y-3"}>
            {items.map((item, index) =>
              config.compact ? (
                <CompactRow key={item.id} section={section} item={item} index={index} />
              ) : (
                <ItemCard
                  key={item.id}
                  section={section}
                  item={item}
                  index={index}
                  isOpen={openIds.has(item.id)}
                  onToggle={() => toggle(item.id)}
                  errors={visited ? errors : {}}
                />
              )
            )}
          </ul>
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        onClick={handleAdd}
        className="h-11 w-full border-dashed text-muted-foreground hover:border-brand/50 hover:text-brand"
      >
        <Plus />
        {config.addLabel}
      </Button>
    </div>
  );
}

function useSortableItem(id) {
  const sortable = useSortable({ id });
  return {
    ...sortable,
    style: { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition },
  };
}

function DragHandle({ sortable, label }) {
  return (
    <button
      ref={sortable.setActivatorNodeRef}
      type="button"
      aria-label={label}
      className="flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/60 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50 active:cursor-grabbing"
      {...sortable.attributes}
      {...sortable.listeners}
    >
      <GripVertical className="size-4" />
    </button>
  );
}

function ItemCard({ section, item, index, isOpen, onToggle, errors }) {
  const config = LIST_SECTIONS[section];
  const removeItem = useBuilderStore((state) => state.removeItem);
  const sortable = useSortableItem(item.id);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const itemErrors = config.fields.map((f) => errors[`${f.name}-${item.id}`]).filter(Boolean);
  const dates = item.startDate
    ? [formatMonthYear(item.startDate), item.current ? "Present" : formatMonthYear(item.endDate)].filter(Boolean).join(" – ")
    : formatMonthYear(item.date);
  const title = item[config.titleField];
  const subtitle = [item[config.subtitleField], dates].filter(Boolean).join(" · ");
  const fallbackTitle = `${config.itemLabel[0].toUpperCase()}${config.itemLabel.slice(1)} ${index + 1}`;

  return (
    <li
      ref={sortable.setNodeRef}
      style={sortable.style}
      id={`${section}-${item.id}`}
      className={cn(
        "scroll-mt-4 rounded-xl border bg-card transition-colors",
        itemErrors.length ? "border-red-400" : isOpen ? "border-brand/40 shadow-sm" : "border-border",
        sortable.isDragging && "relative z-10 shadow-lg"
      )}
    >
      <div className="flex items-center gap-1 py-2 pr-2 pl-2">
        <DragHandle sortable={sortable} label={`Reorder ${title || fallbackTitle}`} />
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center gap-3 py-1 pl-1 text-left outline-none focus-visible:underline"
        >
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm font-medium", title ? "text-foreground" : "text-muted-foreground")}>
              {title || fallbackTitle}
            </p>
            {itemErrors.length ? (
              <p className="truncate text-xs text-destructive">{itemErrors.join(" · ")}</p>
            ) : (
              subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>

        {confirmRemove ? (
          <div className="flex items-center gap-1">
            <Button variant="destructive" size="sm" onClick={() => removeItem(section, item.id)}>
              Remove
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setConfirmRemove(true)}
            aria-label={`Remove ${title || fallbackTitle}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="grid gap-4 border-t border-border px-4 pt-4 pb-5 sm:grid-cols-2">
          {config.fields.map((field) => (
            <Field key={field.name} section={section} item={item} field={field} error={errors[`${field.name}-${item.id}`]} />
          ))}
        </div>
      )}
    </li>
  );
}

function CompactRow({ section, item, index }) {
  const config = LIST_SECTIONS[section];
  const removeItem = useBuilderStore((state) => state.removeItem);
  const sortable = useSortableItem(item.id);

  return (
    <li
      ref={sortable.setNodeRef}
      style={sortable.style}
      id={`${section}-${item.id}`}
      className={cn("flex items-center gap-2", sortable.isDragging && "relative z-10 opacity-90")}
    >
      <DragHandle sortable={sortable} label={`Reorder ${item.name || `${config.itemLabel} ${index + 1}`}`} />
      <div className="grid min-w-0 flex-1 grid-cols-[1fr_150px] gap-2">
        {config.fields.map((field) => (
          <Field key={field.name} section={section} item={item} field={field} hideLabel />
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => removeItem(section, item.id)}
        aria-label={`Remove ${item.name || `${config.itemLabel} ${index + 1}`}`}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <X />
      </Button>
    </li>
  );
}

// Renders one configured field (text, url, month, checkbox, textarea or select).
function Field({ section, item, field, error, hideLabel = false }) {
  const updateItem = useBuilderStore((state) => state.updateItem);
  const id = `${section}-${item.id}-${field.name}`;
  const update = (value) => updateItem(section, item.id, field.name, value);
  const disabled = field.disabledBy ? Boolean(item[field.disabledBy]) : false;
  const wrapper = cn("space-y-2", field.span === 2 && "sm:col-span-2");
  const label = (
    <Label htmlFor={id} className={cn(hideLabel && "sr-only", disabled && "opacity-50")}>
      {field.label}
      {field.required && <span className="text-destructive">*</span>}
    </Label>
  );

  if (field.type === "checkbox") {
    return (
      <div className={cn("flex items-center gap-2", field.span === 2 && "sm:col-span-2")}>
        <Checkbox
          id={id}
          checked={Boolean(item[field.name])}
          onCheckedChange={update}
          className="data-checked:border-brand data-checked:bg-brand data-checked:text-brand-foreground"
        />
        <Label htmlFor={id} className="font-normal">
          {field.label}
        </Label>
      </div>
    );
  }

  let control;
  if (field.type === "month") {
    control = <MonthYearPicker label={field.label} value={item[field.name]} onChange={update} disabled={disabled} />;
  } else if (field.type === "textarea") {
    control = (
      <RichTextarea
        id={id}
        value={item[field.name]}
        onChange={update}
        placeholder={field.placeholder}
        bullets={field.bullets}
        className="min-h-20 bg-background leading-relaxed"
      />
    );
  } else if (field.type === "select") {
    control = (
      <Select value={item[field.name] || null} onValueChange={update} items={field.options}>
        <SelectTrigger id={id} aria-label={field.label} className="h-10 w-full">
          <SelectValue placeholder={field.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } else {
    control = (
      <Input
        id={id}
        type={field.type === "url" ? "url" : "text"}
        value={item[field.name]}
        onChange={(e) => update(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-10"
      />
    );
  }

  return (
    <div className={wrapper}>
      {label}
      {control}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}
