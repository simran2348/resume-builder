"use client";

import { Lightbulb } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SUMMARY_CONFIG } from "@/constants/builder";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function SummaryStep() {
  const summary = useBuilderStore((state) => state.summary);
  const setSummary = useBuilderStore((state) => state.setSummary);

  const { recommendedMin, recommendedMax } = SUMMARY_CONFIG;
  const length = summary.trim().length;
  const inRange = length >= recommendedMin && length <= recommendedMax;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder={SUMMARY_CONFIG.placeholder}
          className="min-h-44 leading-relaxed"
          aria-describedby="summary-count"
        />
        <p
          id="summary-count"
          className={cn("text-right text-xs", inRange ? "text-brand" : "text-muted-foreground")}
        >
          {length} characters · recommended {recommendedMin}–{recommendedMax}
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
