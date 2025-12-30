import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import SimplePricing from "@/components/pricing";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection />
      <SimplePricing />
      <FooterSection />
    </div>
  );
}
