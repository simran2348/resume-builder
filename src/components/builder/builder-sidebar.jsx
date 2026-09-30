"use client";

import Link from "next/link";
import { Check, House, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BUILDER_STEPS } from "@/constants/builder";
import { useTheme } from "@/context/ThemeContext";
import { useStepValidation } from "@/hooks/use-step-validation";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function BuilderSidebar() {
  const { theme, toggleTheme } = useTheme();
  const currentStep = useBuilderStore((state) => state.currentStep);
  const setStep = useBuilderStore((state) => state.setStep);
  const currentIndex = BUILDER_STEPS.findIndex((step) => step.id === currentStep);

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

      <nav aria-label="Resume steps" className="flex flex-1 justify-center lg:mt-6 lg:justify-start">
        <ol className="flex items-center lg:flex-col">
          {BUILDER_STEPS.map((step, index) => (
            <li key={step.id} className="flex items-center lg:flex-col">
              {index > 0 && (
                <span
                  aria-hidden
                  className={cn("h-0.5 w-5 sm:w-8 lg:h-6 lg:w-0.5", index <= currentIndex ? "bg-brand" : "bg-border")}
                />
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
function StepMarker({ step, index, isActive, onSelect }) {
  const Icon = step.icon;
  const { visited, isValid } = useStepValidation(step.id);
  const status = !visited ? "untouched" : isValid ? "complete" : "error";

  const label = `Step ${index + 1}: ${step.label}${status === "error" ? " (missing required fields)" : status === "complete" ? " (complete)" : ""}`;

  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onSelect}
        aria-label={label}
        aria-current={isActive ? "step" : undefined}
        className={cn(
          "relative flex size-10 items-center justify-center rounded-xl border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
          isActive && status !== "error" && "border-brand bg-brand text-brand-foreground shadow-sm",
          isActive && status === "error" && "border-red-500 bg-red-500 text-white shadow-sm",
          !isActive && status === "complete" && "border-brand/30 bg-brand-glow text-brand hover:border-brand/60",
          !isActive &&
            status === "error" &&
            "border-red-300 bg-red-50 text-red-600 hover:border-red-400 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-400",
          !isActive && status === "untouched" && "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="size-5" />
        {status === "complete" && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-brand-foreground ring-2 ring-background">
            <Check className="size-2.5" strokeWidth={3} />
          </span>
        )}
        {status === "error" && (
          <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 ring-2 ring-background" />
        )}
      </TooltipTrigger>
      <TooltipContent side="right">
        {step.label}
        {status === "error" && " · missing required fields"}
      </TooltipContent>
    </Tooltip>
  );
}
