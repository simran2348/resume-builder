"use client";

import Link from "next/link";
import { Check, House, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/context/ThemeContext";
import { useBuilderSteps } from "@/hooks/use-builder-steps";
import { useStepValidation } from "@/hooks/use-step-validation";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function BuilderSidebar() {
  const { theme, toggleTheme } = useTheme();
  const currentStep = useBuilderStore((state) => state.currentStep);
  const setStep = useBuilderStore((state) => state.setStep);
  const steps = useBuilderSteps();
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <aside className="flex items-center gap-3 border-b border-border bg-background px-3 py-2 lg:h-full lg:flex-col lg:border-r lg:border-b-0 lg:px-0 lg:py-4">
      <Tooltip>
        <TooltipTrigger
          render={<Link href="/" />}
          aria-label="Home"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground transition-colors outline-none hover:bg-brand/90 focus-visible:ring-3 focus-visible:ring-brand/40"
        >
          <House className="size-5" />
        </TooltipTrigger>
        <TooltipContent side="right">Home</TooltipContent>
      </Tooltip>

      {/* Below lg the steps live in the Steps panel (see ResumeBuilder); the header just names the current one. */}
      <p className="min-w-0 flex-1 truncate text-center text-sm lg:hidden" aria-live="polite">
        <span className="text-muted-foreground">
          Step {currentIndex + 1} of {steps.length} ·{" "}
        </span>
        <span className="font-semibold text-foreground">{steps[currentIndex]?.label}</span>
      </p>

      {/* Scrolls when there are more steps than fit. */}
      <nav
        aria-label="Resume steps"
        className="hidden min-h-0 w-full flex-1 flex-col items-center overflow-y-auto py-1 lg:mt-4 lg:flex"
      >
        <ol className="flex flex-col items-center">
          {steps.map((step, index) => (
            <li key={step.id} className="flex flex-col items-center">
              {index > 0 && (
                <span aria-hidden className={cn("h-3 w-0.5 shrink-0", index <= currentIndex ? "bg-brand" : "bg-border")} />
              )}
              <StepMarker step={step} index={index} isActive={index === currentIndex} onSelect={() => setStep(step.id)} />
            </li>
          ))}
        </ol>
      </nav>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="size-10 shrink-0 rounded-xl"
      >
        {theme === "light" ? <Moon className="size-5" /> : <Sun className="size-5" />}
      </Button>
    </aside>
  );
}

// Once a step has been left it shows its state: blue tick when complete, red with a dot when
// required fields are missing. The active step keeps its filled style (plus the red dot if invalid).
function useStepStatus(stepId) {
  const { visited, isValid } = useStepValidation(stepId);
  return !visited ? "untouched" : isValid ? "complete" : "error";
}

function markerClassName(isActive, status) {
  return cn(
    "relative flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
    isActive && status !== "error" && "border-brand bg-brand text-brand-foreground shadow-sm",
    isActive && status === "error" && "border-red-500 bg-red-500 text-white shadow-sm",
    !isActive && status === "complete" && "border-brand/30 bg-brand-glow text-brand",
    !isActive &&
      status === "error" &&
      "border-red-300 bg-red-50 text-red-600 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-400",
    !isActive && status === "untouched" && "border-border text-muted-foreground"
  );
}

function StatusBadge({ status }) {
  if (status === "complete") {
    return (
      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-brand-foreground ring-2 ring-background">
        <Check className="size-2.5" strokeWidth={3} />
      </span>
    );
  }
  if (status === "error") {
    return <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 ring-2 ring-background" />;
  }
  return null;
}

function StepMarker({ step, index, isActive, onSelect }) {
  const Icon = step.icon;
  const status = useStepStatus(step.id);

  const label = `Step ${index + 1}: ${step.label}${step.section && !step.required ? " (optional)" : ""}${status === "error" ? " (missing required fields)" : status === "complete" ? " (complete)" : ""}`;

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onSelect}
        aria-label={label}
        aria-current={isActive ? "step" : undefined}
        className={cn(
          markerClassName(isActive, status),
          "outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
          !isActive && status === "complete" && "hover:border-brand/60",
          !isActive && status === "error" && "hover:border-red-400",
          !isActive && status === "untouched" && "hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="size-5" />
        <StatusBadge status={status} />
      </TooltipTrigger>
      <TooltipContent side="right">
        {step.label}
        {step.section && !step.required && " (optional)"}
        {status === "error" && " · missing required fields"}
      </TooltipContent>
    </Tooltip>
  );
}

// Full step list for the Steps panel on small screens. `onNavigate` runs after a step is chosen.
export function StepList({ onNavigate }) {
  const currentStep = useBuilderStore((state) => state.currentStep);
  const setStep = useBuilderStore((state) => state.setStep);
  const steps = useBuilderSteps();

  return (
    <nav aria-label="Resume steps" className="p-3">
      <ol className="space-y-1">
        {steps.map((step, index) => (
          <li key={step.id}>
            <StepRow
              step={step}
              index={index}
              isActive={step.id === currentStep}
              onSelect={() => {
                setStep(step.id);
                onNavigate?.();
              }}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}

const STATUS_TEXT = { complete: "Complete", error: "Missing required fields" };

function StepRow({ step, index, isActive, onSelect }) {
  const Icon = step.icon;
  const status = useStepStatus(step.id);
  const detail = STATUS_TEXT[status] ?? (step.section && !step.required ? "Optional" : null);

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "step" : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
        isActive ? "bg-brand-glow" : "hover:bg-muted"
      )}
    >
      <span className={markerClassName(isActive, status)}>
        <Icon className="size-5" aria-hidden />
        <StatusBadge status={status} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-foreground">
          <span className="text-muted-foreground">{index + 1}. </span>
          {step.label}
        </span>
        {detail && (
          <span className={cn("block text-xs", status === "error" ? "text-red-600 dark:text-red-400" : "text-muted-foreground")}>
            {detail}
          </span>
        )}
      </span>
    </button>
  );
}
