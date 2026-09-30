"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileText, Loader2, UploadCloud, X } from "lucide-react";

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

export default function ResumeUpload() {
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
      <label
        htmlFor="resume-upload"
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
          "group flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/70 px-6 py-10 text-center shadow-sm backdrop-blur-sm transition-colors sm:py-12",
          "hover:border-brand/60 hover:bg-brand-glow",
          "has-focus-visible:border-brand has-focus-visible:ring-3 has-focus-visible:ring-brand/30",
          isDragging && "border-brand bg-brand-glow",
          status === "error" && "border-destructive/60",
          isUploading && "pointer-events-none opacity-80"
        )}
      >
        <input
          ref={inputRef}
          id="resume-upload"
          type="file"
          accept={[...UPLOAD_CONFIG.acceptedExtensions, ...UPLOAD_CONFIG.acceptedMimeTypes].join(",")}
          className="sr-only"
          disabled={isUploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="flex size-12 items-center justify-center rounded-full bg-brand-glow text-brand">
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" />
          ) : hasImport ? (
            <CheckCircle2 className="size-6" />
          ) : (
            <UploadCloud className="size-6" />
          )}
        </div>

        {isUploading ? (
          <div>
            <p className="font-medium text-foreground">Reading your resume…</p>
            <p className="mt-1 text-sm text-muted-foreground">{file?.name}</p>
          </div>
        ) : hasImport ? (
          <div>
            <p className="font-medium text-foreground">Resume imported</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;ll use these details to auto-fill any template you pick.
            </p>
          </div>
        ) : (
          <div>
            <p className="font-medium text-foreground">
              <span className="text-brand">Click to upload</span> or drag and drop your resume
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              PDF or Word (.docx) · up to {UPLOAD_CONFIG.maxSizeMB} MB
            </p>
          </div>
        )}
      </label>

      {hasImport && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left">
          <FileText className="size-5 shrink-0 text-brand" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {file?.name ?? importedFileName}
            </p>
            {file && <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>}
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

      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
