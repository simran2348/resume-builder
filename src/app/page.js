import Footer from "@/components/footer";
import DetailsSection from "@/components/home/details-section";
import FaqSection from "@/components/home/faq-section";
import Hero from "@/components/home/hero";
import Background from "@/components/ui/background";
import Header from "@/components/ui/header";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Background />
      <Header />
      <Hero />
      <DetailsSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
