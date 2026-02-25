"use client";
import { Zap, Sparkles, Wand2, Share2, Video, Lock } from "lucide-react";

const features = [
  {
    name: "AI Script Architect",
    description:
      "Generate compelling video scripts from a simple topic or URL. Our AI models analyze trends to create engaging narratives.",
    icon: Wand2,
  },
  {
    name: "Cinematic Visuals",
    description:
      "Access a library of millions of stock assets, intelligently matched to your script's context and emotional tone.",
    icon: Video,
  },
  {
    name: "Neural Voiceovers",
    description:
      "Choose from a wide range of ultra-realistic AI voices. From energetic narrators to calm storytellers, find the perfect match.",
    icon: Sparkles,
  },
  {
    name: "Instant Synthesis",
    description:
      "Render high-definition videos in minutes, not hours. Our cloud-based rendering engine handles the heavy lifting.",
    icon: Zap,
  },
  {
    name: "Multi-Platform Export",
    description:
      "Optimized for TikTok, Instagram Reels, and YouTube Shorts. Download in 1080p, ready to viral.",
    icon: Share2,
  },
  {
    name: "Secure & Private",
    description:
      "Your projects are private by default. We use enterprise-grade encryption to protect your intellectual property.",
    icon: Lock,
  },
];

export default function FeaturesSection() {
  return (
    <div id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-primary text-base leading-7 font-semibold tracking-wide uppercase">
            Faster Production
          </h2>
          <p className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to create viral shorts
          </p>
          <p className="text-muted-foreground mt-6 text-lg leading-8">
            Flickzo combines the power of LLMs, image generation, and audio
            synthesis into a cohesive studio workflow. Stop editing, start
            creating.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-foreground text-base leading-7 font-semibold">
                  <div className="bg-primary absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg">
                    <feature.icon
                      className="text-primary-foreground h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="text-muted-foreground mt-2 text-base leading-7">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
