import Footer from "@/components/footer";
import TemplateGallery from "@/components/templates/template-gallery";
import Background from "@/components/ui/background";
import Header from "@/components/ui/header";

export const metadata = {
  title: "Choose a template",
};

export default function TemplatesPage() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Background />
      <Header />
      <TemplateGallery />
      <Footer />
    </main>
  );
}
