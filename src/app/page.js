import Footer from "@/components/footer";
import AboutSection from "@/components/home/about-section";
import AtsSection from "@/components/home/ats-section";
import ComparisonSection from "@/components/home/comparison-section";
import DetailsSection from "@/components/home/details-section";
import FaqSection from "@/components/home/faq-section";
import Hero from "@/components/home/hero";
import Background from "@/components/ui/background";
import Header from "@/components/ui/header";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Background />
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <AtsSection />
        <DetailsSection />
        <ComparisonSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
