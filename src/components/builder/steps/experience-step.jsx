"use client";

import { useState } from "react";
import { BriefcaseBusiness, ChevronDown, Plus, Trash2 } from "lucide-react";

import MonthYearPicker from "@/components/builder/month-year-picker";
import SortableBullets from "@/components/builder/sortable-bullets";
import { FieldError } from "@/components/builder/steps/personal-step";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EXPERIENCE_CONFIG, EXPERIENCE_FIELDS } from "@/constants/builder";
import { useStepValidation } from "@/hooks/use-step-validation";
import { formatMonthYear } from "@/lib/resume-data";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

export default function ExperienceStep() {
  const experience = useBuilderStore((state) => state.experience);
  const addExperience = useBuilderStore((state) => state.addExperience);
  const { errors, visited } = useStepValidation("experience");
  // Which roles are expanded; the first one starts open.
  const [openIds, setOpenIds] = useState(() => new Set(experience[0] ? [experience[0].id] : []));

  function toggle(id) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const id = addExperience();
    setOpenIds((current) => new Set(current).add(id));
    requestAnimationFrame(() => {
      document.getElementById(`experience-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById(`experience-${id}-role`)?.focus({ preventScroll: true });
    });
  }

  if (!experience.length) {
    return (
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border border-dashed px-6 py-12 text-center",
          visited && errors.experience ? "border-red-400 bg-red-50/50 dark:bg-red-500/5" : "border-border"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-glow text-brand">
          <BriefcaseBusiness className="size-6" />
        </div>
        <p className="mt-3 font-medium text-foreground">No experience added yet</p>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Add your most recent role first. Internships and freelance work count too.
        </p>
        <Button onClick={handleAdd} className="mt-5 h-10 bg-brand px-4 text-brand-foreground hover:bg-brand/90">
          <Plus />
          Add role
        </Button>
        {visited && errors.experience && (
          <p role="alert" className="mt-3 text-xs text-destructive">
            {errors.experience}. At least one is required.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {experience.map((job, index) => (
        <ExperienceItem
          key={job.id}
          job={job}
          index={index}
          isOpen={openIds.has(job.id)}
          onToggle={() => toggle(job.id)}
          roleError={visited ? errors[`role-${job.id}`] : undefined}
        />
      ))}

      <Button
        variant="outline"
        onClick={handleAdd}
        className="h-11 w-full border-dashed text-muted-foreground hover:border-brand/50 hover:text-brand"
      >
        <Plus />
        Add another role
      </Button>
    </div>
  );
}

function ExperienceItem({ job, index, isOpen, onToggle, roleError }) {
  const updateExperience = useBuilderStore((state) => state.updateExperience);
  const removeExperience = useBuilderStore((state) => state.removeExperience);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const fieldId = (name) => `experience-${job.id}-${name}`;
  const update = (field) => (value) => updateExperience(job.id, field, value);
  const dates = [formatMonthYear(job.startDate), job.current ? "Present" : formatMonthYear(job.endDate)]
    .filter(Boolean)
    .join(" – ");
  const subtitle = [job.company, dates].filter(Boolean).join(" · ");

  return (
    <div
      id={`experience-${job.id}`}
      className={cn(
        "scroll-mt-4 rounded-xl border bg-card transition-colors",
        roleError ? "border-red-400" : isOpen ? "border-brand/40 shadow-sm" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 py-2 pr-2 pl-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`${fieldId("panel")}`}
          className="flex min-w-0 flex-1 items-center gap-3 py-1 text-left outline-none focus-visible:underline"
        >
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm font-medium", job.role ? "text-foreground" : "text-muted-foreground")}>
              {job.role || `Role ${index + 1}`}
            </p>
            {roleError ? (
              <p className="truncate text-xs text-destructive">{roleError}</p>
            ) : (
              subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </button>

        {confirmRemove ? (
          <div className="flex items-center gap-1">
            <Button variant="destructive" size="sm" onClick={() => removeExperience(job.id)}>
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
            aria-label={`Remove ${job.role || `role ${index + 1}`}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        )}
      </div>

      {isOpen && (
        <div id={fieldId("panel")} className="space-y-5 border-t border-border px-4 pt-4 pb-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {EXPERIENCE_FIELDS.map((field) => (
              <div key={field.name} className={cn("space-y-2", field.name === "location" && "sm:col-span-2")}>
                <Label htmlFor={fieldId(field.name)}>
                  {field.label}
                  {field.required && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id={fieldId(field.name)}
                  value={job[field.name]}
                  onChange={(e) => update(field.name)(e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  aria-invalid={field.name === "role" && Boolean(roleError)}
                  aria-describedby={field.name === "role" && roleError ? fieldId("role-error") : undefined}
                  className="h-10"
                />
                {field.name === "role" && roleError && <FieldError id={fieldId("role-error")}>{roleError}</FieldError>}
              </div>
            ))}

            <div className="space-y-2">
              <Label>Start date</Label>
              <MonthYearPicker label="Start date" value={job.startDate} onChange={update("startDate")} />
            </div>
            <div className="space-y-2">
              <Label className={cn(job.current && "opacity-50")}>End date</Label>
              <MonthYearPicker label="End date" value={job.endDate} onChange={update("endDate")} disabled={job.current} />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id={fieldId("current")}
                checked={job.current}
                onCheckedChange={update("current")}
                className="data-checked:border-brand data-checked:bg-brand data-checked:text-brand-foreground"
              />
              <Label htmlFor={fieldId("current")} className="font-normal">
                I currently work here
              </Label>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">Responsibilities &amp; achievements</p>
            <p className="mt-1 mb-3 text-xs text-muted-foreground">{EXPERIENCE_CONFIG.bulletTip}</p>
            <SortableBullets jobId={job.id} bullets={job.bullets} />
          </div>
        </div>
      )}
    </div>
  );
}
