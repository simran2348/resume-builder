import BannerTemplate from "@/components/builder/templates/banner-template";
import CenteredTemplate from "@/components/builder/templates/centered-template";
import ClassicTemplate from "@/components/builder/templates/classic-template";
import ElegantTemplate from "@/components/builder/templates/elegant-template";
import MinimalTemplate from "@/components/builder/templates/minimal-template";
import ProfileTemplate from "@/components/builder/templates/profile-template";
import SideHeadingsTemplate from "@/components/builder/templates/side-headings-template";
import SidebarTemplate from "@/components/builder/templates/sidebar-template";
import SplitTemplate from "@/components/builder/templates/split-template";
import TimelineTemplate from "@/components/builder/templates/timeline-template";
import { ACCENT_COLORS, DEFAULT_THEME, RESUME_TEMPLATES } from "@/constants/builder";

function ClassicPhotoTemplate(props) {
  return <ClassicTemplate {...props} showPhoto />;
}

// Maps a template id (from RESUME_TEMPLATES) to the component that renders it. Add new templates here.
// Every template takes `{ resume, theme }`.
const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  centered: CenteredTemplate,
  "classic-photo": ClassicPhotoTemplate,
  elegant: ElegantTemplate,
  "side-headings": SideHeadingsTemplate,
  banner: BannerTemplate,
  minimal: MinimalTemplate,
  timeline: TimelineTemplate,
  sidebar: SidebarTemplate,
  split: SplitTemplate,
  profile: ProfileTemplate,
};

// Fills in theme defaults and resolves per-template ones (contact icons) before rendering.
// Built once per template so component identity stays stable across renders.
const RESOLVED_COMPONENTS = Object.fromEntries(
  RESUME_TEMPLATES.map((meta) => {
    const Template = TEMPLATE_COMPONENTS[meta.id];
    function ResolvedTemplate({ theme, ...props }) {
      const resolved = { ...DEFAULT_THEME, ...theme };
      resolved.showContactIcons = resolved.showContactIcons ?? meta.contactIcons;
      return <Template {...props} theme={resolved} />;
    }
    return [meta.id, ResolvedTemplate];
  })
);

export function getColor(colorId) {
  return ACCENT_COLORS.find((color) => color.id === colorId) ?? ACCENT_COLORS[0];
}

export function getTemplate(templateId) {
  const meta = RESUME_TEMPLATES.find((t) => t.id === templateId) ?? RESUME_TEMPLATES[0];
  return { ...meta, Component: RESOLVED_COMPONENTS[meta.id] };
}

export const ALL_TEMPLATES = RESUME_TEMPLATES.map((t) => getTemplate(t.id));
