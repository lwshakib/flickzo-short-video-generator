"use client";

import { toast } from "sonner";
import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DAILY_FREE_VIDEO_LIMIT } from "@/lib/constants";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for exploring the power of AI video.",
    features: [
      `${DAILY_FREE_VIDEO_LIMIT} AI-generated videos per day`,
      "Standard 720p resolution",
      "Access to basic AI voices",
      "Standard typography styles",
      "Flickzo watermark included",
    ],
    buttonText: "Current Plan",
    current: true,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For creators who want to scale their content.",
    features: [
      "30 AI-generated videos per month",
      "High-definition 1080p resolution",
      "Premium AI voices & styles",
      "Custom typography & branding",
      "No watermark",
      "Priority rendering queue",
    ],
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Agency",
    price: "$99",
    description: "Advanced tools for high-volume production.",
    features: [
      "Unlimited AI-generated videos",
      "Ultra-HD 4K resolution",
      "Full commercial usage rights",
      "Bulk video generation API",
      "Dedicated account manager",
      "Early access to new features",
    ],
    buttonText: "Contact Sales",
  },
];

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-6 py-12 lg:py-20">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground text-sm">
          Select the plan that best fits your creative needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col space-y-8 ${
              plan.popular ? "relative" : ""
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm font-bold tracking-wider uppercase">
                  {plan.name}
                </h3>
                {plan.popular && (
                  <Badge
                    variant="secondary"
                    className="rounded-full px-2 py-0 text-[9px] font-bold uppercase"
                  >
                    Popular
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-muted-foreground text-xs font-medium">
                  /mo
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {plan.description}
              </p>
            </div>

            <ul className="border-border/50 flex-1 space-y-3 border-t pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="text-primary mt-0.5 size-3 shrink-0" />
                  <span className="text-muted-foreground text-[11px]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.current ? "outline" : "default"}
              className="h-10 w-full rounded-xl font-bold transition-all"
              disabled={plan.current}
              onClick={() => {
                if (!plan.current) {
                  toast.info("Payments are not yet available during beta.");
                }
              }}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>

      <div className="max-w-2xl pt-12">
        <div className="border-primary/20 bg-primary/5 rounded-2xl border p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Info className="text-primary size-4" />
            <h4 className="text-sm font-bold">Payments Disabled</h4>
          </div>
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            We are currently in beta. Subscriptions are not available at this
            time. All users have access to our Starter plan features for free.
          </p>
        </div>
      </div>
    </div>
  );
}
