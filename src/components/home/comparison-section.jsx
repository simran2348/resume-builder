import { Check, Minus } from "lucide-react";

import SectionHeading from "@/components/home/section-heading";
import { COMPARISON_SECTION } from "@/constants/home";

const [OURS, THEIRS] = COMPARISON_SECTION.columns;

// A table from sm up; stacked cards on phones so nothing scrolls sideways.
export default function ComparisonSection() {
  return (
    <section id="compare" aria-labelledby="compare-title" className="scroll-mt-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="reveal mx-auto max-w-4xl">
        <SectionHeading
          id="compare-title"
          eyebrow={COMPARISON_SECTION.eyebrow}
          title={COMPARISON_SECTION.title}
          subtitle={COMPARISON_SECTION.intro}
        />

        <div className="hidden overflow-hidden rounded-3xl border border-border bg-card shadow-sm sm:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              {OURS} compared with {THEIRS.toLowerCase()}
            </caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="px-6 py-4 font-medium text-muted-foreground">
                  <span className="sr-only">Feature</span>
                </th>
                <th scope="col" className="w-40 bg-brand-soft px-6 py-4 text-center text-base font-semibold text-brand">
                  {OURS}
                </th>
                <th scope="col" className="w-56 px-6 py-4 text-center font-medium text-muted-foreground">
                  {THEIRS}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_SECTION.rows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <th scope="row" className="px-6 py-4 font-medium text-heading">
                    {row.label}
                  </th>
                  <td className="bg-brand-soft px-6 py-4 text-center">
                    <Answer value={row.value} />
                  </td>
                  <td className="px-6 py-4 text-center text-muted-foreground">{row.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-3 sm:hidden">
          {COMPARISON_SECTION.rows.map((row) => (
            <li key={row.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="font-medium text-heading">{row.label}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-brand-soft px-3 py-2">
                  <dt className="text-xs font-semibold text-brand">{OURS}</dt>
                  <dd className="mt-1">
                    <Answer value={row.value} />
                  </dd>
                </div>
                <div className="rounded-xl bg-muted/60 px-3 py-2">
                  <dt className="text-xs font-medium text-muted-foreground">{THEIRS}</dt>
                  <dd className="mt-1 font-medium text-muted-foreground">{row.other}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Answer({ value }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
      {value ? (
        <Check className="size-4 text-brand" strokeWidth={3} aria-hidden />
      ) : (
        <Minus className="size-4 text-brand" strokeWidth={3} aria-hidden />
      )}
      {value ? "Yes" : "No"}
    </span>
  );
}
