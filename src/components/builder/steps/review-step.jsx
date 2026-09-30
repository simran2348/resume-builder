"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArchiveRestore,
  Check,
  CircleAlert,
  ClipboardCopy,
  FileDown,
  FileText,
  GripVertical,
  Lock,
  Pencil,
  Printer,
  Save,
  Trash2,
  Undo2,
} from "lucide-react";

import { getDefaultSectionTitle, getTemplate } from "@/components/builder/templates";
import { Button } from "@/components/ui/button";
import { useResumeContent } from "@/hooks/use-resume-content";
import { createBackup, parseBackup, toPlainText } from "@/lib/resume-data";
import { resumeFontVariables } from "@/lib/resume-fonts";
import { getStep } from "@/lib/steps";
import { cn } from "@/lib/utils";
import { getStepErrors } from "@/lib/validation";
import { useBuilderStore } from "@/store/builderStore";

// A4 page, no browser headers/footers; later pages get a top margin since only page 1 has the template's padding.
const PRINT_PAGE_STYLE = `
  @page { size: A4; margin: 12mm 0; }
  @page :first { margin-top: 0; }
  html, body { margin: 0; background: #fff; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
`;

const COUNT_LABELS = {
  experience: ["role", "roles"],
  skills: ["skill", "skills"],
  education: ["entry", "entries"],
  projects: ["project", "projects"],
  hobbies: ["hobby", "hobbies"],
  languages: ["language", "languages"],
  achievements: ["achievement", "achievements"],
  certifications: ["certification", "certifications"],
};

function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReviewStep() {
  const { data, resume } = useResumeContent();
  const templateId = useBuilderStore((state) => state.templateId);
  const theme = useBuilderStore((state) => state.theme);
  const setStep = useBuilderStore((state) => state.setStep);
  const { Component } = getTemplate(templateId);
  const printRef = useRef(null);

  const fileBase = (data.personal.fullName.trim() || "Resume").replace(/\s+/g, "_");
  const print = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${fileBase}_Resume`,
    pageStyle: PRINT_PAGE_STYLE,
    bodyClass: resumeFontVariables,
  });

  // Required steps that still have missing fields.
  const incomplete = ["personal", "summary", ...data.sectionOrder]
    .map(getStep)
    .filter((step) => step?.required && Object.keys(getStepErrors(step.id, data)).length > 0);

  return (
    <div className="space-y-8">
      {incomplete.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
        >
          <p className="flex items-center gap-2 font-medium">
            <CircleAlert className="size-4 shrink-0" />
            Some required sections are incomplete
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {incomplete.map((step) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => setStep(step.id)}
                  className="rounded-full border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:border-red-500/40 dark:bg-transparent dark:text-red-300"
                >
                  Complete {step.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <SectionsManager data={data} />

      <section>
        <h2 className="text-sm font-semibold text-foreground">Download & share</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Your resume is saved automatically in this browser as you type.
        </p>

        <Button onClick={print} className="mt-4 h-11 w-full bg-brand text-base text-brand-foreground hover:bg-brand/90">
          <FileDown />
          Download PDF
        </Button>
        <p className="mt-1.5 text-center text-xs text-muted-foreground">
          Opens the print dialog. Choose &ldquo;Save as PDF&rdquo; as the destination. The PDF keeps real text, so ATS
          scanners can read it.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <ActionButton icon={Printer} label="Print" description="Send it straight to a printer" onClick={print} />
          <CopyTextButton resume={resume} />
          <ActionButton
            icon={FileText}
            label="Download as text"
            description="Plain .txt for pasting into forms"
            onClick={() => downloadFile(`${fileBase}_Resume.txt`, toPlainText(resume), "text/plain")}
          />
          <BackupButtons fileBase={fileBase} />
        </div>
      </section>

      {/* Full-size, unscaled copy used for printing / PDF (hidden on screen). */}
      <div className="hidden">
        <div ref={printRef} style={{ width: "210mm" }}>
          <Component resume={resume} theme={theme} />
        </div>
      </div>
    </div>
  );
}

// ---------- Section order / edit / remove ----------

function SectionsManager({ data }) {
  const templateId = useBuilderStore((state) => state.templateId);
  const setStep = useBuilderStore((state) => state.setStep);
  const moveSection = useBuilderStore((state) => state.moveSection);
  const hideSection = useBuilderStore((state) => state.hideSection);
  const restoreSection = useBuilderStore((state) => state.restoreSection);

  const visible = data.sectionOrder.filter((key) => !data.hiddenSections.includes(key));
  const titleOf = (key) => data.sectionTitles[key]?.trim() || getDefaultSectionTitle(templateId, key);
  const hasErrors = (key) => Boolean(getStep(key).required) && Object.keys(getStepErrors(key, data)).length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd({ active, over }) {
    if (over && active.id !== over.id) moveSection(active.id, over.id);
  }

  return (
    <section>
      <h2 className="text-sm font-semibold text-foreground">Resume sections</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Drag to reorder. Your details and summary always stay at the top. Optional sections can be removed.
      </p>

      <ul className="mt-3 space-y-2">
        <SectionRow
          stepId="personal"
          title="Personal details"
          meta={[data.personal.fullName, data.personal.email].filter(Boolean).join(" · ") || "Name and contact"}
          pinned
          hasErrors={hasErrors("personal")}
          onEdit={() => setStep("personal")}
        />
        <SectionRow
          stepId="summary"
          title={titleOf("summary")}
          meta={data.summary.trim() ? `${data.summary.trim().length} characters` : "Not written yet"}
          pinned
          hasErrors={hasErrors("summary")}
          onEdit={() => setStep("summary")}
        />
      </ul>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visible} strategy={verticalListSortingStrategy}>
          <ul className="mt-2 space-y-2">
            {visible.map((key) => {
              const count = data[key].length;
              const [one, many] = COUNT_LABELS[key];
              return (
                <SortableSectionRow
                  key={key}
                  stepId={key}
                  title={titleOf(key)}
                  meta={count ? `${count} ${count === 1 ? one : many}` : "Empty · won't appear on the resume"}
                  hasErrors={hasErrors(key)}
                  onEdit={() => setStep(key)}
                  onRemove={() => hideSection(key)}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>

      {data.hiddenSections.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">Removed sections</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {data.hiddenSections.map((key) => (
              <li key={key}>
                <Button variant="outline" size="sm" onClick={() => restoreSection(key)}>
                  <Undo2 />
                  Restore {titleOf(key)}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function SortableSectionRow(props) {
  const sortable = useSortable({ id: props.stepId });
  return <SectionRow {...props} sortable={sortable} />;
}

function SectionRow({ stepId, title, meta, pinned = false, hasErrors, sortable, onEdit, onRemove }) {
  const step = getStep(stepId);
  const Icon = step.icon;

  return (
    <li
      ref={sortable?.setNodeRef}
      style={sortable && { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition }}
      className={cn(
        "flex items-center gap-2 rounded-xl border bg-card py-2 pr-2 pl-2",
        hasErrors ? "border-red-300 dark:border-red-500/40" : "border-border",
        sortable?.isDragging && "relative z-10 shadow-lg ring-2 ring-brand/30"
      )}
    >
      {pinned ? (
        <span className="flex h-8 w-5 shrink-0 items-center justify-center text-muted-foreground/60" title="Always at the top">
          <Lock className="size-3.5" />
        </span>
      ) : (
        <button
          ref={sortable.setActivatorNodeRef}
          type="button"
          aria-label={`Reorder ${title}`}
          className="flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/60 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50 active:cursor-grabbing"
          {...sortable.attributes}
          {...sortable.listeners}
        >
          <GripVertical className="size-4" />
        </button>
      )}

      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          hasErrors ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" : "bg-brand-glow text-brand"
        )}
      >
        <Icon className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
          {title}
          {!step.required && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Optional
            </span>
          )}
        </p>
        <p className={cn("truncate text-xs", hasErrors ? "text-destructive" : "text-muted-foreground")}>
          {hasErrors ? "Missing required fields" : meta}
        </p>
      </div>

      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit ${title}`} title="Edit">
        <Pencil />
      </Button>
      {!pinned &&
        (step.required ? (
          <span
            className="flex size-7 items-center justify-center text-muted-foreground/40"
            title="Required sections can't be removed"
            aria-label={`${title} is required and can't be removed`}
          >
            <Trash2 className="size-4" />
          </span>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Remove ${title} from resume`}
            title="Remove section"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        ))}
    </li>
  );
}

// ---------- Actions ----------

function ActionButton({ icon: Icon, label, description, onClick, done }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors outline-none hover:border-brand/40 hover:bg-brand-glow focus-visible:ring-3 focus-visible:ring-brand/40"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
        {done ? <Check className="size-4 text-brand" /> : <Icon className="size-4" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

// Clipboard API first; falls back to a hidden textarea where the API is blocked (e.g. insecure origins).
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    textarea.remove();
    return ok;
  }
}

function CopyTextButton({ resume }) {
  const [status, setStatus] = useState("idle"); // idle | copied | failed

  async function copy() {
    setStatus((await copyText(toPlainText(resume))) ? "copied" : "failed");
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <ActionButton
      icon={ClipboardCopy}
      label={{ idle: "Copy as text", copied: "Copied!", failed: "Couldn't copy" }[status]}
      description={status === "failed" ? "Use “Download as text” instead" : "Plain text for job application forms"}
      onClick={copy}
      done={status === "copied"}
    />
  );
}

function BackupButtons({ fileBase }) {
  const loadBackup = useBuilderStore((state) => state.loadBackup);
  const inputRef = useRef(null);
  const [pending, setPending] = useState(null); // parsed backup awaiting confirmation
  const [message, setMessage] = useState(null); // { type: "error" | "success", text }

  function save() {
    const backup = createBackup(useBuilderStore.getState());
    downloadFile(`${fileBase}_resume-backup.json`, JSON.stringify(backup, null, 2), "application/json");
  }

  async function handleFile(file) {
    if (!file) return;
    inputRef.current.value = "";
    try {
      setPending(parseBackup(await file.text()));
      setMessage(null);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  }

  return (
    <>
      <ActionButton icon={Save} label="Save backup" description="Download a .json copy to restore later" onClick={save} />
      <ActionButton
        icon={ArchiveRestore}
        label="Restore backup"
        description="Load a previously saved .json file"
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {pending && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 sm:col-span-2 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          <p>
            Replace your current resume with the backup from{" "}
            <span className="font-medium">{new Date(pending.savedAt).toLocaleString()}</span>? This can&apos;t be undone.
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                loadBackup(pending.data);
                setPending(null);
                setMessage({ type: "success", text: "Backup restored." });
              }}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Replace
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      {message && (
        <p
          role={message.type === "error" ? "alert" : "status"}
          className={cn("text-xs sm:col-span-2", message.type === "error" ? "text-destructive" : "text-brand")}
        >
          {message.text}
        </p>
      )}
    </>
  );
}
