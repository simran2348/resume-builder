import Footer from "@/components/footer";
import Background from "@/components/ui/background";
import { DotGrid, Ring } from "@/components/ui/decor";
import Header from "@/components/ui/header";
import { cn } from "@/lib/utils";

// Shared layout for text pages (About, Contact, Privacy, Terms): header, a title band, the content in a card
// and the footer. Plain elements inside `children` (h2, h3, p, ul, a, strong) get consistent typography.
export default function ContentPage({ eyebrow, title, intro, meta, children }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <Background />
      <Header />
      <main className="flex-1 px-4 pt-10 pb-24 sm:px-6 md:pt-16 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="relative mb-10 text-center">
            <DotGrid className="-top-6 -left-16 hidden size-36 sm:block" />
            <Ring className="-top-10 -right-20 hidden size-48 sm:block" />
            <div className="relative">
              {eyebrow && <p className="mb-3 text-sm font-semibold tracking-wide text-brand">{eyebrow}</p>}
              <h1 className="text-4xl font-bold tracking-tight text-balance text-heading sm:text-5xl">{title}</h1>
              {meta && (
                <p className="mt-4 inline-flex rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {meta}
                </p>
              )}
              {intro && (
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">
                  {intro}
                </p>
              )}
            </div>
          </header>

          <div
            className={cn(
              "relative rounded-3xl border border-border bg-card px-6 py-10 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.3)] sm:px-12 sm:py-14",
              "text-base leading-[1.75] text-muted-foreground",
              "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:border-t [&_h2]:border-border [&_h2]:pt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-heading",
              "[&>h2:first-child]:mt-0 [&>h2:first-child]:border-0 [&>h2:first-child]:pt-0",
              "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-heading",
              "[&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-heading",
              "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:marker:text-brand",
              "[&_a]:font-medium [&_a]:text-brand [&_a]:underline-offset-4 hover:[&_a]:underline"
            )}
          >
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
