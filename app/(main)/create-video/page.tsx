"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  Video,
  Mic2,
  Type,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  captionStyles,
  suggestions,
  videoStyles,
  videoVoices,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

/**
 * CreateVideoPage component.
 * The primary interface for users to configure and trigger cinematic video generation.
 */
export default function CreateVideoPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession(); // Client-side session hook

  // 1. TOPIC SELECTION STATE
  const [selectedTab, setSelectedTab] = useState("suggestions");
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [customTopic, setCustomTopic] = useState("");
  const [scriptLoading, setScriptLoading] = useState(false);
  const [generatedScripts, setGeneratedScripts] = useState<
    Array<{ title: string; content: string }>
  >([]);
  const [selectedScriptIdx, setSelectedScriptIdx] = useState<number | null>(
    null
  );

  // 2. VISUAL & AUDIO CUSTOMIZATION STATE
  const [selectedStyle, setSelectedStyle] = useState<string>("Anime");
  const [selectedVoice, setSelectedVoice] = useState<string>("Thalia");
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<
    (typeof captionStyles)[number]
  >(captionStyles[0]);

  // Audio preview instance for voice selection
  const playerRef = useState(() =>
    typeof Audio !== "undefined" ? new Audio() : null
  )[0];

  const selectedTopic = selectedSuggestion || customTopic;

  /**
   * Plays a voice sample when a narrator is selected.
   */
  const handleVoicePlay = (voiceId: string, model: string) => {
    setSelectedVoice(voiceId);

    if (playerRef) {
      if (playerRef.src.includes(`${model}.wav`)) {
        playerRef.currentTime = 0;
      } else {
        playerRef.src = `/audio/${model}.wav`;
      }
      playerRef.play().catch((e) => console.error("Audio playback failed:", e));
    }
  };

  /**
   * Generates AI scripts based on the chosen topic.
   */
  const handleGenerateScript = async () => {
    if (!selectedTopic) {
      toast.error("Please select or enter a topic");
      return;
    }

    setScriptLoading(true);
    try {
      const promise = axios.post("/api/scripts", { topic: selectedTopic });

      toast.promise(promise, {
        loading: "Architecting your narratives...",
        success: "Scripts generated successfully!",
        error: "Failed to generate scripts. Please try again.",
      });

      const response = await promise;
      setGeneratedScripts(response.data.data.scripts);
      setSelectedScriptIdx(0); // Select first script by default
    } catch (error) {
      console.error("Error generating scripts:", error);
    } finally {
      setScriptLoading(false);
    }
  };

  // Helper selectors for preview UI
  const currentStyleData = useMemo(() => {
    return videoStyles.find((s) => s.label === selectedStyle);
  }, [selectedStyle]);

  const currentVoiceData = useMemo(() => {
    return videoVoices.find((v) => v.Id === selectedVoice);
  }, [selectedVoice]);

  /**
   * Final step: Triggers the Inngest workflow to create the video.
   */
  const handleCreateVideo = async () => {
    if (!session?.user) {
      toast.error("Please sign in to create videos");
      return;
    }

    if (
      selectedScriptIdx === null ||
      !selectedStyle ||
      !selectedVoice ||
      !selectedCaptionStyle
    ) {
      toast.error("Please complete all steps before generating");
      return;
    }

    const selectedScript = generatedScripts[selectedScriptIdx];

    try {
      // POST to our API which triggers the Inngest background function
      const promise = axios.post("/api/videos/create", {
        title: selectedScript.title,
        script: selectedScript.content,
        topic: selectedTopic,
        voice: videoVoices.find((v) => v.Id === selectedVoice)?.Model,
        videoStyle: selectedStyle,
        captionStyle: selectedCaptionStyle,
      });

      toast.promise(promise, {
        loading: "Initializing production pipeline...",
        success: () => {
          router.push("/videos");
          return "Production started! You'll be notified when it's ready.";
        },
        error: (err) => {
          const message =
            err.response?.data?.error || "Failed to start production.";
          return message;
        },
      });
    } catch (error) {
      console.error("Error starting video production:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-background flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Left Column (Inputs) */}
      <div className="border-border/50 custom-scrollbar flex-1 border-b lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="mx-auto max-w-2xl space-y-10 p-4 py-8 sm:p-8 lg:p-10 lg:pb-32">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Video
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Transform your ideas into cinematic shorts.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {/* Step 1: Topic */}
            <StepWrapper
              title="The Topic"
              description="Define the vision for your narrative."
            >
              <Tabs
                defaultValue="suggestions"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="bg-muted/50 mb-6 w-full justify-start p-1 sm:w-auto">
                  <TabsTrigger
                    value="suggestions"
                    className="flex items-center gap-2 px-6"
                  >
                    <Sparkles className="size-3.5" /> Suggestions
                  </TabsTrigger>
                  <TabsTrigger
                    value="your-topic"
                    className="flex items-center gap-2 px-6"
                  >
                    <Type className="size-3.5" /> Custom
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="suggestions">
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        className={cn(
                          "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                          selectedSuggestion === s
                            ? "bg-primary border-primary text-primary-foreground shadow-sm"
                            : "bg-background border-border hover:border-primary/40 text-muted-foreground"
                        )}
                        onClick={() => {
                          setSelectedSuggestion(s);
                          setCustomTopic("");
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="your-topic">
                  <Input
                    placeholder="e.g. The history of the Samurai"
                    value={customTopic}
                    className="bg-background h-12 rounded-lg text-sm font-semibold"
                    onChange={(e) => {
                      setCustomTopic(e.target.value);
                      setSelectedSuggestion(null);
                    }}
                  />
                </TabsContent>
              </Tabs>

              <Button
                size="sm"
                className="mt-6 font-bold"
                onClick={handleGenerateScript}
                disabled={!selectedTopic || scriptLoading}
              >
                {scriptLoading ? "Generating..." : "Generate Scripts"}
                {!scriptLoading && <ChevronRight className="ml-1 size-3.5" />}
              </Button>

              {(scriptLoading || generatedScripts.length > 0) && (
                <div className="animate-in fade-in slide-in-from-top-4 mt-8 space-y-3 duration-700">
                  <h4 className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                    Select a script
                  </h4>
                  {scriptLoading ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[1, 2].map((i) => (
                        <div
                          key={i}
                          className="border-border/50 space-y-3 rounded-xl border p-4"
                        >
                          <Skeleton className="h-3 w-1/3" />
                          <Skeleton className="h-2 w-full" />
                          <Skeleton className="h-2 w-4/5" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {generatedScripts.map((script, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "relative cursor-pointer rounded-xl border p-4 transition-all duration-300",
                            selectedScriptIdx === idx
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border hover:border-primary/40 bg-background"
                          )}
                          onClick={() => setSelectedScriptIdx(idx)}
                        >
                          <h5 className="mb-1 text-xs font-bold tracking-tight uppercase">
                            {script.title}
                          </h5>
                          <p className="text-[11px] leading-relaxed font-medium italic opacity-70">
                            &ldquo;{script.content}&rdquo;
                          </p>
                          {selectedScriptIdx === idx && (
                            <CheckCircle2 className="text-primary absolute top-2 right-2 size-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </StepWrapper>

            {/* Step 2: Visual Aesthetic */}
            <StepWrapper
              title="Aesthetic"
              description="Choose the visual style for your video."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {videoStyles.map((style) => (
                  <div
                    key={style.label}
                    className={cn(
                      "group cursor-pointer overflow-hidden rounded-xl border-2 transition-all",
                      selectedStyle === style.label
                        ? "border-primary shadow-sm"
                        : "hover:border-muted border-transparent"
                    )}
                    onClick={() => setSelectedStyle(style.label)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={style.src}
                        alt={style.label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 p-2.5">
                        <span className="text-[10px] font-bold text-white uppercase">
                          {style.label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StepWrapper>

            {/* Step 3: Narration */}
            <StepWrapper
              title="Narration"
              description="Professional AI voice for your story."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {videoVoices.map((voice) => (
                  <button
                    key={voice.Id}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all",
                      selectedVoice === voice.Id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted/50"
                    )}
                    onClick={() => handleVoicePlay(voice.Id, voice.Model)}
                  >
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg shadow-sm transition-colors",
                        selectedVoice === voice.Id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Mic2 className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight">
                        {voice.Name}
                      </h4>
                      <p className="text-muted-foreground text-[10px] font-medium uppercase">
                        {voice.Gender} • {voice.LanguageName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </StepWrapper>

            {/* Step 4: Typography */}
            <StepWrapper
              title="Typography"
              description="Style the on-screen captions."
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                {captionStyles.map((style) => (
                  <button
                    key={style.label}
                    className={cn(
                      "group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 p-4 transition-all",
                      selectedCaptionStyle?.label === style.label
                        ? "border-primary bg-muted/20"
                        : "border-border hover:border-muted-foreground/20"
                    )}
                    onClick={() => setSelectedCaptionStyle(style)}
                  >
                    <div
                      className={cn(
                        "text-center text-sm font-bold uppercase transition-transform group-hover:scale-105",
                        style.className
                      )}
                    >
                      {style.label}
                    </div>
                    {selectedCaptionStyle?.label === style.label && (
                      <CheckCircle2 className="text-primary absolute top-2 right-2 size-3.5" />
                    )}
                  </button>
                ))}
              </div>
            </StepWrapper>
          </div>
        </div>
      </div>

      {/* Right Column (Preview) */}
      <div className="bg-muted/5 border-border/50 custom-scrollbar flex w-full flex-col items-center border-t lg:h-full lg:w-96 lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <div className="w-full max-w-[320px] space-y-8 px-4 py-12 pb-24 lg:pb-12">
          {/* Compact Phone Mockup */}
          <div className="border-foreground/10 relative aspect-[9/16] w-full overflow-hidden rounded-[32px] border-8 bg-black shadow-xl">
            <div className="animate-in fade-in absolute inset-0 duration-1000">
              <Image
                src={currentStyleData?.src || "/placeholder.png"}
                fill
                className="object-cover opacity-70 brightness-75 transition-all duration-[10s]"
                alt="Style Preview"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute top-6 left-6 flex items-center gap-1.5 opacity-40">
              <Video className="size-3 text-white" />
              <span className="text-[8px] font-bold tracking-widest text-white uppercase">
                Flickzo
              </span>
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-6 pb-20 text-center">
              <div
                className={cn(
                  "animate-in zoom-in-50 text-xl duration-500",
                  selectedCaptionStyle?.className
                )}
              >
                {selectedTopic || "PREVIEW"}
              </div>
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="bg-background rounded-xl border p-4 shadow-sm">
            <h4 className="mb-3 text-[10px] font-bold tracking-wider uppercase opacity-40">
              Settings
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <SummaryItem label="Style" value={selectedStyle} />
              <SummaryItem
                label="Voice"
                value={currentVoiceData?.Name || "---"}
              />
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="group bg-primary relative h-12 w-full overflow-hidden rounded-xl font-bold shadow-lg"
            disabled={selectedScriptIdx === null}
            onClick={handleCreateVideo}
          >
            <div className="flex items-center gap-2">
              <Video className="size-4" />
              <span>Generate Video</span>
            </div>
          </Button>

          <p className="text-muted-foreground text-center text-[10px] font-medium uppercase opacity-40">
            ~60s generation time
          </p>
        </div>
      </div>
    </div>
  );
}

function StepWrapper({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
          {title}
        </h2>
        <p className="text-muted-foreground text-xs font-medium">
          {description}
        </p>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-[9px] font-bold uppercase opacity-60">
        {label}
      </span>
      <span className="truncate text-[11px] font-bold">{value || "---"}</span>
    </div>
  );
}
