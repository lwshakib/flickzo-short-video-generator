import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import SimplePricing from "@/components/pricing";
import FeaturesSection from "@/components/features";
import HowItWorksSection from "@/components/how-it-works";
import FAQSection from "@/components/faq";

/**
 * Landing Page (Root).
 * Composes the primary sections of the Flickzo website, including
 * high-impact hero, features overview, pricing, and FAQ.
 */
export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* 1. Hero: Main visual and Call to Action */}
      <HeroSection />
      {/* 2. Features: Core capabilities of Flickzo */}
      <FeaturesSection />
      {/* 3. Workflow: Steps to generate a video */}
      <HowItWorksSection />
      {/* 4. Pricing: Subscription plans and credits */}
      <SimplePricing />
      {/* 5. FAQ: Frequently asked questions */}
      <FAQSection />
      {/* 6. Footer: Navigation links and branding */}
      <FooterSection />
    </div>
  );
}
