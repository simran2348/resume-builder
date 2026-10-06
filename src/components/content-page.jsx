import Footer from "@/components/footer";
import Background from "@/components/ui/background";
import Header from "@/components/ui/header";
import { cn } from "@/lib/utils";

// Shared layout for text pages (About, Contact, Privacy, Terms): header, a readable column and footer.
// Plain elements inside `children` (h2, h3, p, ul, a, strong) get consistent typography.
export default function ContentPage({ title, intro, meta, children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Header />
      <main className="flex-1 px-4 pt-10 pb-20 sm:px-6 md:pt-16">
        <article className="mx-auto max-w-3xl">
          <header className="mb-10 border-b border-border pb-8">
            <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h1>
            {meta && <p className="mt-3 text-sm font-medium text-muted-foreground">{meta}</p>}
            {intro && <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">{intro}</p>}
          </header>
          <div
            className={cn(
              "text-base leading-relaxed text-muted-foreground",
              "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground first:[&_h2]:mt-0",
              "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
              "[&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-foreground",
              "[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:marker:text-brand",
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
