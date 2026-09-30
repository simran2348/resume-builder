import BannerTemplate from "@/components/builder/templates/banner-template";
import ClassicTemplate from "@/components/builder/templates/classic-template";
import ElegantTemplate from "@/components/builder/templates/elegant-template";
import MinimalTemplate from "@/components/builder/templates/minimal-template";
import ProfileTemplate from "@/components/builder/templates/profile-template";
import SideHeadingsTemplate from "@/components/builder/templates/side-headings-template";
import SidebarTemplate from "@/components/builder/templates/sidebar-template";
import SplitTemplate from "@/components/builder/templates/split-template";
import TimelineTemplate from "@/components/builder/templates/timeline-template";
import { ACCENT_COLORS, RESUME_TEMPLATES } from "@/constants/builder";

function ClassicPhotoTemplate(props) {
  return <ClassicTemplate {...props} showPhoto />;
}

// Maps a template id (from RESUME_TEMPLATES) to the component that renders it. Add new templates here.
const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
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

export function getColor(colorId) {
  return ACCENT_COLORS.find((color) => color.id === colorId) ?? ACCENT_COLORS[0];
}

export function getTemplate(templateId) {
  const meta = RESUME_TEMPLATES.find((t) => t.id === templateId) ?? RESUME_TEMPLATES[0];
  return { ...meta, defaultAccent: getColor(meta.defaultColor).value, Component: TEMPLATE_COMPONENTS[meta.id] };
}
