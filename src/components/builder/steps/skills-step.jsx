"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Info, Plus, Trash2 } from "lucide-react";

import ChipsStep, { ChipInput, SortableChips } from "@/components/builder/steps/chips-step";
import { FieldError } from "@/components/builder/steps/personal-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CHIP_SECTIONS, RESUME_TEMPLATES } from "@/constants/builder";
import { useStepValidation } from "@/hooks/use-step-validation";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

// Skills: a simple chip list, or (switched on) named categories such as "Frontend: React, Next.js".
// Categories show on "Grouped skills" templates; every other template lists all skills together.
export default function SkillsStep() {
  const skills = useBuilderStore((state) => state.skills);
  const categories = useBuilderStore((state) => state.skillCategories);
  const enableSkillCategories = useBuilderStore((state) => state.enableSkillCategories);
  const disableSkillCategories = useBuilderStore((state) => state.disableSkillCategories);
  const addSkillCategory = useBuilderStore((state) => state.addSkillCategory);
  const { errors, visited } = useStepValidation("skills");
  // The category whose name input should take focus (a newly added one).
  const [focusId, setFocusId] = useState(null);
  const grouped = categories.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <label htmlFor="skill-categories-switch" className="cursor-pointer">
          <span className="block text-sm font-medium text-foreground">Group skills into categories</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            e.g. &ldquo;Frontend: React, Next.js&rdquo;. Category names are editable.
          </span>
        </label>
        <Switch
          id="skill-categories-switch"
          checked={grouped}
          onCheckedChange={(checked) => {
            if (checked) {
              enableSkillCategories();
              setFocusId("first");
            } else {
              disableSkillCategories();
            }
          }}
          className="mt-1 data-checked:bg-brand"
        />
      </div>

      <TemplateHint grouped={grouped} />

      {grouped ? (
        <>
          {visited && errors.skills && <FieldError id="skills-error">{errors.skills}</FieldError>}
          <ol className="space-y-4" aria-label="Skill categories">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                count={categories.length}
                skills={skills.filter((skill) => skill.categoryId === category.id)}
                allSkillNames={skills.map((skill) => skill.name)}
                error={visited && errors[`category-${category.id}`]}
                autoFocus={focusId === category.id || (focusId === "first" && index === 0)}
              />
            ))}
          </ol>
          <Button
            variant="outline"
            onClick={() => setFocusId(addSkillCategory())}
            className="h-10 w-full gap-2 rounded-xl border-dashed"
          >
            <Plus />
            Add category
          </Button>
        </>
      ) : (
        <ChipsStep section="skills" />
      )}
    </div>
  );
}

// Points out when the chosen template won't show the skills the way they're organised here.
function TemplateHint({ grouped }) {
  const templateId = useBuilderStore((state) => state.templateId);
  const setTemplate = useBuilderStore((state) => state.setTemplate);
  const template = RESUME_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  const groupedVersion = RESUME_TEMPLATES.find((t) => t.baseId === template.id);
  let message = null;
  let action = null;

  if (grouped && template.skillLayout === "list") {
    message = groupedVersion
      ? `${template.name} lists all skills together. Switch to its grouped version to show the categories.`
      : `${template.name} lists all skills together. Choose a "Grouped skills" template to show the categories.`;
    if (groupedVersion) action = { label: `Use ${groupedVersion.name}`, onClick: () => setTemplate(groupedVersion.id) };
  } else if (!grouped && template.skillLayout === "categories") {
    message = `${template.name} shows skills by category. Turn on "Group skills into categories" to organise them; until then they appear as one list.`;
  }
  if (!message) return null;

  return (
    <div role="note" className="flex gap-2.5 rounded-xl border border-brand/20 bg-brand-glow px-4 py-3 text-sm">
      <Info className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
      <div>
        <p className="text-foreground">{message}</p>
        {action && (
          <Button
            variant="link"
            onClick={action.onClick}
            className="mt-1 h-auto p-0 font-semibold text-brand"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category, index, count, skills, allSkillNames, error, autoFocus }) {
  const renameSkillCategory = useBuilderStore((state) => state.renameSkillCategory);
  const removeSkillCategory = useBuilderStore((state) => state.removeSkillCategory);
  const moveSkillCategory = useBuilderStore((state) => state.moveSkillCategory);
  const addItem = useBuilderStore((state) => state.addItem);
  const removeItem = useBuilderStore((state) => state.removeItem);
  const moveItem = useBuilderStore((state) => state.moveItem);
  const allSkills = useBuilderStore((state) => state.skills);
  // Removing a category also removes its skills, so ask first when it has any.
  const [confirmRemove, setConfirmRemove] = useState(false);

  const nameId = `category-name-${category.id}`;
  const displayName = category.name.trim() || `Category ${index + 1}`;

  return (
    <li className={cn("space-y-3 rounded-xl border bg-background p-4", error ? "border-red-400" : "border-border")}>
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <label htmlFor={nameId} className="text-xs font-medium text-muted-foreground">
            Category name
          </label>
          <Input
            id={nameId}
            value={category.name}
            onChange={(e) => renameSkillCategory(category.id, e.target.value)}
            placeholder="e.g. Frontend"
            maxLength={40}
            autoFocus={autoFocus}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${nameId}-error` : undefined}
            className="h-10 font-medium"
          />
        </div>
        <div className="flex shrink-0 gap-1 pb-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => moveSkillCategory(index, index - 1)}
            disabled={index === 0}
            aria-label={`Move ${displayName} up`}
          >
            <ArrowUp />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => moveSkillCategory(index, index + 1)}
            disabled={index === count - 1}
            aria-label={`Move ${displayName} down`}
          >
            <ArrowDown />
          </Button>
          {count > 1 && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => (skills.length ? setConfirmRemove(true) : removeSkillCategory(category.id))}
              aria-label={`Remove ${displayName}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          )}
        </div>
      </div>
      {error && <FieldError id={`${nameId}-error`}>{error}</FieldError>}

      {confirmRemove && (
        <div role="alert" className="flex flex-wrap items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm">
          <span className="flex-1 text-destructive">
            Remove {displayName} and its {skills.length} {skills.length === 1 ? "skill" : "skills"}?
          </span>
          <Button size="sm" variant="ghost" onClick={() => setConfirmRemove(false)}>
            Cancel
          </Button>
          <Button size="sm" className="bg-red-600 text-white hover:bg-red-700" onClick={() => removeSkillCategory(category.id)}>
            Remove
          </Button>
        </div>
      )}

      <ChipInput
        id={`category-skill-${category.id}`}
        label={`Add a skill to ${displayName}`}
        hideLabel
        placeholder={CHIP_SECTIONS.skills.placeholder}
        existingNames={allSkillNames}
        onAdd={(name) => addItem("skills", { name, categoryId: category.id })}
        onRemoveLast={() => skills.length && removeItem("skills", skills[skills.length - 1].id)}
      />

      {skills.length > 0 ? (
        <SortableChips
          items={skills}
          label={`${displayName} skills`}
          onRemove={(id) => removeItem("skills", id)}
          // Indices are in the full skills list; moving within one category keeps every other skill in place.
          onMove={(activeId, overId) =>
            moveItem(
              "skills",
              allSkills.findIndex((skill) => skill.id === activeId),
              allSkills.findIndex((skill) => skill.id === overId)
            )
          }
        />
      ) : (
        <p className="text-xs text-muted-foreground">No skills in this category yet.</p>
      )}
    </li>
  );
}
