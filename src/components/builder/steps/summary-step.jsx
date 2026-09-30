"use client";

import { Lightbulb } from "lucide-react";

import RichTextarea from "@/components/builder/rich-textarea";
import { FieldError } from "@/components/builder/steps/personal-step";
import { Label } from "@/components/ui/label";
import { SUMMARY_CONFIG } from "@/constants/builder";
import { stripRichText } from "@/lib/rich-text";
import { useStepValidation } from "@/hooks/use-step-validation";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function SummaryStep() {
  const summary = useBuilderStore((state) => state.summary);
  const setSummary = useBuilderStore((state) => state.setSummary);

  const { errors, visited } = useStepValidation("summary");
  const error = visited && errors.summary;
  const { recommendedMin, recommendedMax } = SUMMARY_CONFIG;
  const length = stripRichText(summary).trim().length;
  const inRange = length >= recommendedMin && length <= recommendedMax;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="summary">
          Summary<span className="text-destructive">*</span>
        </Label>
        <RichTextarea
          id="summary"
          value={summary}
          onChange={setSummary}
          placeholder={SUMMARY_CONFIG.placeholder}
          className="min-h-44 leading-relaxed"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "summary-error summary-count" : "summary-count"}
        />
        {error && <FieldError id="summary-error">{error}</FieldError>}
        <p
          id="summary-count"
          className={cn("text-right text-xs", inRange ? "text-brand" : "text-muted-foreground")}
        >
          {length} characters · recommended {recommendedMin}–{recommendedMax}
        </p>
        <p className="text-xs text-muted-foreground">
          Select text and press <kbd className="font-sans font-medium">Ctrl/⌘ + B</kbd> for bold or{" "}
          <kbd className="font-sans font-medium">Ctrl/⌘ + I</kbd> for italic, or use the toolbar.
        </p>
      </div>

      <div className="rounded-xl border border-brand/20 bg-brand-glow p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Lightbulb className="size-4 text-brand" />
          Tips for a strong summary
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
          {SUMMARY_CONFIG.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
