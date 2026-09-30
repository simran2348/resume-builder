"use client";

import PhotoUpload from "@/components/builder/photo-upload";
import { getTemplate } from "@/components/builder/templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PERSONAL_FIELD_GROUPS } from "@/constants/builder";
import { useStepValidation } from "@/hooks/use-step-validation";
import { useBuilderStore } from "@/store/builderStore";

export default function PersonalStep() {
  const personal = useBuilderStore((state) => state.personal);
  const templateId = useBuilderStore((state) => state.templateId);
  const updatePersonal = useBuilderStore((state) => state.updatePersonal);
  const { supportsPhoto } = getTemplate(templateId);
  const { errors, visited } = useStepValidation("personal");

  return (
    <div className="space-y-8">
      {supportsPhoto && (
        <FieldGroup title="Photo">
          <PhotoUpload />
        </FieldGroup>
      )}

      {PERSONAL_FIELD_GROUPS.map((group) => (
        <FieldGroup key={group.title} title={group.title}>
          <div className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => {
              const id = `personal-${field.name}`;
              const error = visited && errors[field.name];
              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={id}>
                    {field.label}
                    {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  <Input
                    id={id}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    value={personal[field.name]}
                    onChange={(e) => updatePersonal(field.name, e.target.value)}
                    required={field.required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className="h-10"
                  />
                  {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
                </div>
              );
            })}
          </div>
        </FieldGroup>
      ))}
    </div>
  );
}

export function FieldError({ id, children }) {
  return (
    <p id={id} className="text-xs text-destructive">
      {children}
    </p>
  );
}

function FieldGroup({ title, children }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
