import ClassicTemplate from "@/components/builder/templates/classic-template";
import { RESUME_TEMPLATES } from "@/constants/builder";

// Maps a template id to the component that renders it. Add new templates here.
const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  "classic-photo": ClassicTemplate,
};

export function getTemplate(templateId) {
  const meta = RESUME_TEMPLATES.find((t) => t.id === templateId) ?? RESUME_TEMPLATES[0];
  return { ...meta, Component: TEMPLATE_COMPONENTS[meta.id] };
}
