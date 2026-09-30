"use client";

import Link from "next/link";
import { Check, FileUser, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BUILDER_STEPS } from "@/constants/builder";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function BuilderSidebar() {
  const { theme, toggleTheme } = useTheme();
  const currentStep = useBuilderStore((state) => state.currentStep);
  const setStep = useBuilderStore((state) => state.setStep);
  const currentIndex = BUILDER_STEPS.findIndex((step) => step.id === currentStep);

  return (
    <aside className="flex items-center gap-3 border-b border-border bg-background px-3 py-2 lg:h-full lg:flex-col lg:border-r lg:border-b-0 lg:px-0 lg:py-4">
      <Link
        href="/"
        aria-label="Back to home"
        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-foreground"
      >
        <FileUser className="size-5" />
      </Link>

      <nav aria-label="Resume steps" className="flex flex-1 justify-center lg:mt-6 lg:justify-start">
        <ol className="flex items-center lg:flex-col">
          {BUILDER_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentIndex;
            const isDone = index < currentIndex;

            return (
              <li key={step.id} className="flex items-center lg:flex-col">
                {index > 0 && (
                  <span
                    aria-hidden
                    className={cn(
                      "h-0.5 w-5 sm:w-8 lg:h-6 lg:w-0.5",
                      isDone || isActive ? "bg-brand" : "bg-border"
                    )}
                  />
                )}
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => setStep(step.id)}
                    aria-label={`Step ${index + 1}: ${step.label}`}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "relative flex size-10 items-center justify-center rounded-xl border transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
                      isActive && "border-brand bg-brand text-brand-foreground shadow-sm",
                      isDone && "border-brand/30 bg-brand-glow text-brand hover:border-brand/60",
                      !isActive && !isDone && "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="size-5" />
                    {isDone && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-brand text-brand-foreground ring-2 ring-background">
                        <Check className="size-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="right">{step.label}</TooltipContent>
                </Tooltip>
              </li>
            );
          })}
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
