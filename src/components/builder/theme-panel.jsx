"use client";

import { useState } from "react";
import { Check, ImageIcon, LayoutList, Palette, Rows3, Type } from "lucide-react";

import { getTemplate } from "@/components/builder/templates";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PHOTO_SHAPES, RESUME_FONTS, THEME_LIMITS, THEME_PALETTE } from "@/constants/builder";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "@/store/builderStore";

const FONT_ITEMS = RESUME_FONTS.map((font) => ({ value: font.id, label: font.label }));
const HEX_RE = /^#[0-9a-f]{6}$/i;

export default function ThemePanel() {
  const theme = useBuilderStore((state) => state.theme);
  const templateId = useBuilderStore((state) => state.templateId);
  const updateTheme = useBuilderStore((state) => state.updateTheme);
  const template = getTemplate(templateId);
  const { supportsPhoto } = template;
  const showContactIcons = theme.showContactIcons ?? template.contactIcons;

  const slider = (key, label) => (
    <SliderField label={label} value={theme[key]} limits={THEME_LIMITS[key]} onChange={(v) => updateTheme(key, v)} />
  );

  // Keep the photo border in step with the accent unless the user picked a separate border colour.
  function setAccent(color) {
    if (theme.photoBorderColor === theme.accent) updateTheme("photoBorderColor", color);
    updateTheme("accent", color);
  }

  return (
    // @container: paired rows sit side by side when the panel is wide enough (desktop) and stack in the
    // narrower panel on small screens.
    <div className="@container divide-y divide-border">
      <PanelSection icon={Type} title="Typography">
        {slider("nameSize", "Name")}
        <div className="grid items-end gap-4 @xs:grid-cols-[1fr_150px]">
          {slider("headingSize", "Headings")}
          <FontSelect label="Heading font" value={theme.headingFont} onChange={(v) => updateTheme("headingFont", v)} />
        </div>
        <div className="grid items-end gap-4 @xs:grid-cols-[1fr_150px]">
          {slider("bodySize", "Body")}
          <FontSelect label="Body font" value={theme.bodyFont} onChange={(v) => updateTheme("bodyFont", v)} />
        </div>
        {slider("lineHeight", "Line spacing")}
      </PanelSection>

      <PanelSection icon={LayoutList} title="Display">
        <CheckboxField
          id="theme-contact-icons"
          label="Include contact icons"
          checked={showContactIcons}
          onChange={(checked) => updateTheme("showContactIcons", checked)}
        >
          Shows icons next to email, phone, location and links. {template.name} has them{" "}
          {template.contactIcons ? "on" : "off"} by default.
        </CheckboxField>
        <CheckboxField
          id="theme-dividers"
          label="Show dividers"
          checked={theme.showDividers}
          onChange={(checked) => updateTheme("showDividers", checked)}
        >
          Lines between sections, under headings and between columns, wherever the template uses them.
        </CheckboxField>
      </PanelSection>

      <PanelSection icon={Rows3} title="Spacing">
        {slider("sectionSpacing", "Space between sections")}
        {slider("pageMargin", "Page margins")}
      </PanelSection>

      {supportsPhoto && (
        <PanelSection icon={ImageIcon} title="Photo">
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Shape</p>
            <div role="radiogroup" aria-label="Photo shape" className="grid grid-cols-3 gap-2">
              {PHOTO_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  type="button"
                  role="radio"
                  aria-checked={theme.photoShape === shape.id}
                  onClick={() => updateTheme("photoShape", shape.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border py-2.5 text-xs transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/40",
                    theme.photoShape === shape.id
                      ? "border-brand bg-brand-glow text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="size-6 bg-muted-foreground/40" style={{ borderRadius: shape.radius }} />
                  {shape.label}
                </button>
              ))}
            </div>
          </div>
          {slider("photoBorderWidth", "Border width")}
          <ColorField
            label="Border colour"
            value={theme.photoBorderColor}
            onChange={(v) => updateTheme("photoBorderColor", v)}
          />
        </PanelSection>
      )}

      <PanelSection icon={Palette} title="Colours">
        <div role="group" aria-label="Accent colour presets" className="grid grid-cols-8 gap-2.5">
          {THEME_PALETTE.map((color) => {
            const isSelected = theme.accent.toLowerCase() === color;
            return (
              <button
                key={color}
                type="button"
                aria-label={color}
                aria-pressed={isSelected}
                onClick={() => setAccent(color)}
                style={{ backgroundColor: color }}
                className={cn(
                  "flex aspect-square items-center justify-center rounded-full text-white ring-offset-2 ring-offset-background transition-transform outline-none hover:scale-110 focus-visible:ring-3 focus-visible:ring-brand/50",
                  isSelected && "ring-2 ring-foreground"
                )}
              >
                {isSelected && <Check className="size-3.5" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
        <ColorField label="Primary" value={theme.accent} onChange={setAccent} />
        <div className="grid gap-3 @xs:grid-cols-2">
          <ColorField label="Background" value={theme.background} onChange={(v) => updateTheme("background", v)} />
          <ColorField label="Text" value={theme.text} onChange={(v) => updateTheme("text", v)} />
        </div>
      </PanelSection>
    </div>
  );
}

function CheckboxField({ id, label, checked, onChange, children }) {
  return (
    <div className="flex items-start gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="mt-0.5 data-checked:border-brand data-checked:bg-brand data-checked:text-brand-foreground"
      />
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="mt-1 text-xs text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

function PanelSection({ icon: Icon, title, children }) {
  return (
    <section className="space-y-5 px-5 py-6">
      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function formatValue(value, step) {
  return step < 1 ? Number(value).toFixed(step < 0.1 ? 2 : 1) : value;
}

function SliderField({ label, value, limits, onChange }) {
  const { min, max, step, unit } = limits;
  const id = `theme-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatValue(value, step)}
          {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-(--brand-blue)"
      />
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

function FontSelect({ label, value, onChange }) {
  return (
    <div className="mb-[18px]">
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange} items={FONT_ITEMS}>
        <SelectTrigger aria-label={label} className="h-10 w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {RESUME_FONTS.map((font) => (
            <SelectItem key={font.id} value={font.id} style={{ fontFamily: `var(${font.variable}), ${font.fallback}` }}>
              {font.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Swatch (opens the native picker) plus an editable hex field; the store only updates on a valid hex.
function ColorField({ label, value, onChange }) {
  const [draft, setDraft] = useState(value);
  const [synced, setSynced] = useState(value);
  if (value !== synced) {
    setSynced(value);
    setDraft(value);
  }

  return (
    <div className="relative flex h-11 items-center gap-3 rounded-lg border border-input px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <span className="absolute -top-2 left-2 bg-background px-1 text-[11px] text-muted-foreground">{label}</span>
      <span
        className="relative size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-border"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} colour picker`}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </span>
      <input
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          if (HEX_RE.test(e.target.value)) onChange(e.target.value.toLowerCase());
        }}
        onBlur={() => setDraft(value)}
        aria-label={`${label} hex value`}
        spellCheck={false}
        className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none"
      />
    </div>
  );
}
