import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "../context/ThemeContext";
import { SITE } from "@/constants/site";
import { resumeFontVariables } from "@/lib/resume-fonts";

export const metadata = {
  title: {
    default: SITE.title,
    // Applies to child routes (About, Privacy, Builder, ...); the home page uses the default above.
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${resumeFontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
