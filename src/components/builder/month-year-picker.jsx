"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPERIENCE_CONFIG } from "@/constants/builder";
import { MONTH_OPTIONS } from "@/lib/resume-data";

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: EXPERIENCE_CONFIG.yearsBack + 1 }, (_, i) => {
  const year = String(CURRENT_YEAR - i);
  return { value: year, label: year };
});

// Month + year selects. Value is "YYYY-MM", "YYYY" (year only) or "".
export default function MonthYearPicker({ value, onChange, disabled, label }) {
  const [year = null, month = null] = value ? value.split("-") : [];

  return (
    <div className="grid grid-cols-[1fr_1.1fr] gap-2">
      <Select
        value={month}
        onValueChange={(m) => onChange(`${year ?? CURRENT_YEAR}-${m}`)}
        items={MONTH_OPTIONS}
        disabled={disabled}
      >
        <SelectTrigger aria-label={`${label} month`} className="h-10 w-full">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year}
        onValueChange={(y) => onChange(month ? `${y}-${month}` : y)}
        items={YEAR_OPTIONS}
        disabled={disabled}
      >
        <SelectTrigger aria-label={`${label} year`} className="h-10 w-full">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {YEAR_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
