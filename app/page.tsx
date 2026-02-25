import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import SimplePricing from "@/components/pricing";
import FeaturesSection from "@/components/features";
import HowItWorksSection from "@/components/how-it-works";
import FAQSection from "@/components/faq";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SimplePricing />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
