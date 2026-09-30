"use client";

import PhotoUpload from "@/components/builder/photo-upload";
import { getTemplate } from "@/components/builder/templates";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PERSONAL_FIELD_GROUPS } from "@/constants/builder";
import { useBuilderStore } from "@/store/builderStore";

export default function PersonalStep() {
  const personal = useBuilderStore((state) => state.personal);
  const templateId = useBuilderStore((state) => state.templateId);
  const updatePersonal = useBuilderStore((state) => state.updatePersonal);
  const { supportsPhoto } = getTemplate(templateId);

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
            {group.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`personal-${field.name}`}>{field.label}</Label>
                <Input
                  id={`personal-${field.name}`}
                  type={field.type ?? "text"}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  value={personal[field.name]}
                  onChange={(e) => updatePersonal(field.name, e.target.value)}
                  className="h-10"
                />
              </div>
            ))}
          </div>
        </FieldGroup>
      ))}
    </div>
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
