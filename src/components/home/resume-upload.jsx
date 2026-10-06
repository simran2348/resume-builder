"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UPLOAD_CONFIG } from "@/constants/home";
import { cn } from "@/lib/utils";
import { useResumeStore } from "@/store/resumeStore";

const MAX_BYTES = UPLOAD_CONFIG.maxSizeMB * 1024 * 1024;

function validateFile(file) {
  const name = file.name.toLowerCase();
  const isAccepted =
    UPLOAD_CONFIG.acceptedMimeTypes.includes(file.type) ||
    UPLOAD_CONFIG.acceptedExtensions.some((ext) => name.endsWith(ext));

  if (!isAccepted) return "Please upload a PDF or Word (.docx) file.";
  if (file.size > MAX_BYTES) return `File must be ${UPLOAD_CONFIG.maxSizeMB} MB or smaller.`;
  return null;
}

function formatSize(bytes) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// "Upload existing resume" button: opens the file picker (or takes a dropped file), sends it to
// /api/resume/parse, stores the result and continues to /templates. `before` / `after` render other
// actions (e.g. "Create new resume") in the same row, at equal widths; `rowClassName` adjusts that grid.
// `inverted` adapts the status text for dark panels.
export default function ResumeUpload({ label, before, after, buttonClassName, rowClassName, inverted = false }) {
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const importedFileName = useResumeStore((state) => state.importedFileName);
  const setImportedResume = useResumeStore((state) => state.setImportedResume);
  const clearImportedResume = useResumeStore((state) => state.clearImportedResume);

  useEffect(() => {
    useResumeStore.persist.rehydrate();
  }, []);

  async function handleFile(selected) {
    if (!selected) return;

    const validationError = validateFile(selected);
    if (validationError) {
      setStatus("error");
      setError(validationError);
      return;
    }

    setFile(selected);
    setStatus("uploading");
    setError("");

    try {
      const body = new FormData();
      body.append("file", selected);
      const res = await fetch("/api/resume/parse", { method: "POST", body });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");

      setImportedResume(json.data, json.fileName);
      setStatus("success");
      router.push("/templates");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  function reset() {
    clearImportedResume();
    setFile(null);
    setStatus("idle");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const isUploading = status === "uploading";
  const hasImport = status === "success" || (status === "idle" && importedFileName);

  return (
    <div className="w-full">
      <div className={cn("grid gap-3 sm:grid-cols-2 [&>a]:w-full", rowClassName)}>
        {before}
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={[...UPLOAD_CONFIG.acceptedExtensions, ...UPLOAD_CONFIG.acceptedMimeTypes].join(",")}
          className="peer sr-only"
          disabled={isUploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-base whitespace-nowrap font-medium shadow-sm transition-all select-none",
            "bg-brand text-brand-foreground hover:-translate-y-px hover:bg-brand/90 hover:shadow-md",
            "peer-focus-visible:ring-3 peer-focus-visible:ring-brand/40 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            isDragging && "ring-3 ring-brand/40 ring-offset-2 ring-offset-background",
            isUploading && "pointer-events-none opacity-80",
            buttonClassName
          )}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Upload className="size-4" aria-hidden />
          )}
          {isUploading ? "Reading your resume…" : label}
        </label>
        {after}
      </div>

      <div aria-live="polite">
        {hasImport && (
          <div className="mt-3 flex max-w-md items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-left shadow-sm">
            <FileText className="size-5 shrink-0 text-brand" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">Imported: {file?.name ?? importedFileName}</p>
              <p className="text-xs text-muted-foreground">
                {file ? `${formatSize(file.size)} · ` : ""}Pick a template to continue.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={reset}
              aria-label="Remove uploaded resume"
              className="rounded-full"
            >
              <X />
            </Button>
          </div>
        )}
      </div>

      {status === "error" && (
        <p
          role="alert"
          className={cn(
            "mt-3 text-sm font-medium",
            inverted ? "rounded-lg bg-white px-3 py-2 text-destructive" : "text-destructive"
          )}
        >
          {error}
        </p>
      )}
    </div>
  );
}
