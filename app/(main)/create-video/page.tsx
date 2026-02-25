"use client";

import { useState, useMemo } from "react";
import {
  Sparkles,
  Video,
  Mic2,
  Type,
  ChevronRight,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
        error: "Failed to start production. Please try again.",
      });
    } catch (error) {
      console.error("Error starting video production:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-background flex flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* Left Column (Inputs) - Scrollable on desktop, part of flow on mobile */}
      <div className="border-border/50 custom-scrollbar flex-1 border-b lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="mx-auto max-w-3xl space-y-12 p-6 pb-32 md:p-10">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <Badge
              variant="outline"
              className="border-primary/20 text-primary bg-primary/5 w-fit px-3 py-1 text-[10px] font-black tracking-widest uppercase"
            >
              Creation Studio
            </Badge>
            <h1 className="text-4xl font-black tracking-tighter md:text-5xl">
              Craft Your{" "}
              <span className="from-primary via-primary/80 to-primary/50 bg-gradient-to-r bg-clip-text text-transparent">
                Masterpiece
              </span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              Flickzo AI transforms your ideas into cinematic short-form videos
              in seconds.
            </p>
          </div>

          <div className="flex flex-col gap-16">
            {/* Step 1: Topic */}
            <StepWrapper
              index={1}
              title="The Vision"
              description="Define the core idea of your video."
            >
              <Card className="bg-muted/30 ring-border/50 border-none p-6 shadow-none ring-1">
                <Tabs
                  defaultValue="suggestions"
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  className="w-full"
                >
                  <TabsList className="bg-muted/50 mb-6 p-1">
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
                            "rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-300",
                            selectedSuggestion === s
                              ? "bg-primary border-primary text-primary-foreground shadow-primary/25 scale-105 shadow-lg"
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
                      className="bg-background border-border focus-visible:ring-primary focus-visible:border-primary h-14 rounded-xl border-2 text-xl font-bold transition-all"
                      onChange={(e) => {
                        setCustomTopic(e.target.value);
                        setSelectedSuggestion(null);
                      }}
                    />
                  </TabsContent>
                </Tabs>

                <Button
                  className="shadow-primary/20 mt-8 h-12 px-8 text-xs font-black tracking-wider uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                  onClick={handleGenerateScript}
                  disabled={!selectedTopic || scriptLoading}
                >
                  {scriptLoading ? "Generating..." : "Generate Scripts"}
                  {!scriptLoading && <ChevronRight className="ml-2 size-4" />}
                </Button>

                {(scriptLoading || generatedScripts.length > 0) && (
                  <div className="animate-in fade-in slide-in-from-top-4 mt-10 space-y-4 duration-700">
                    <h4 className="text-muted-foreground pl-1 text-xs font-black tracking-widest uppercase">
                      Available Narratives
                    </h4>
                    {scriptLoading ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="border-border/50 space-y-3 rounded-2xl border-2 p-6"
                          >
                            <Skeleton className="mb-4 h-4 w-1/3" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-4/5" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-2">
                        {generatedScripts.map((script, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300",
                              selectedScriptIdx === idx
                                ? "border-primary bg-primary/5 shadow-inner"
                                : "border-border hover:border-primary/40 bg-background"
                            )}
                            onClick={() => setSelectedScriptIdx(idx)}
                          >
                            <h5 className="mb-2 text-sm font-bold tracking-tight uppercase">
                              {script.title}
                            </h5>
                            <p className="text-xs leading-relaxed font-medium italic opacity-80">
                              &ldquo;{script.content}&rdquo;
                            </p>
                            {selectedScriptIdx === idx && (
                              <CheckCircle2 className="text-primary fill-background absolute top-3 right-3 size-5" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </StepWrapper>

            {/* Step 2: Visual Aesthetic */}
            <StepWrapper
              index={2}
              title="Visual Aesthetic"
              description="The art style defines the mood."
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {videoStyles.map((style) => (
                  <div
                    key={style.label}
                    className={cn(
                      "group bg-muted/20 cursor-pointer overflow-hidden rounded-3xl border-4 transition-all duration-500",
                      selectedStyle === style.label
                        ? "border-primary shadow-primary/20 scale-105 shadow-2xl"
                        : "hover:border-primary/30 border-transparent"
                    )}
                    onClick={() => setSelectedStyle(style.label)}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={style.src}
                        alt={style.label}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-125"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                        <span className="text-xs font-black tracking-tight text-white uppercase">
                          {style.label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </StepWrapper>

            {/* Step 3: The Voice */}
            <StepWrapper
              index={3}
              title="The Voice"
              description="Professional narration for your story."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {videoVoices.map((voice) => (
                  <button
                    key={voice.Id}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-300",
                      selectedVoice === voice.Id
                        ? "border-primary bg-primary/5 shadow-primary/5 shadow-lg"
                        : "border-border bg-background hover:border-primary/30"
                    )}
                    onClick={() => handleVoicePlay(voice.Id, voice.Model)}
                  >
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl shadow-sm transition-colors",
                        selectedVoice === voice.Id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      )}
                    >
                      <Mic2 className="size-5" />
                    </div>
                    <div>
                      <h4 className="mb-1 text-lg leading-none font-black tracking-tight">
                        {voice.Name}
                      </h4>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold uppercase">
                        <span>{voice.Gender}</span>
                        <span className="opacity-30">•</span>
                        <span>{voice.LanguageName}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </StepWrapper>

            {/* Step 4: Typography */}
            <StepWrapper
              index={4}
              title="Typography"
              description="How the message appears on screen."
            >
              <div className="grid grid-cols-2 gap-4">
                {captionStyles.map((style) => (
                  <button
                    key={style.label}
                    className={cn(
                      "group relative flex h-32 items-center justify-center overflow-hidden rounded-3xl border-4 p-8 transition-all duration-500",
                      selectedCaptionStyle?.label === style.label
                        ? "border-primary shadow-primary/10 bg-[#0a0a0a] shadow-2xl"
                        : "border-border hover:border-primary/30 bg-[#0a0a0a]"
                    )}
                    onClick={() => setSelectedCaptionStyle(style)}
                  >
                    <div
                      className={cn(
                        "text-center text-2xl leading-tight transition-transform duration-500 group-hover:scale-110",
                        style.className
                      )}
                    >
                      {style.label}
                    </div>
                    {selectedCaptionStyle?.label === style.label && (
                      <div className="bg-primary text-primary-foreground absolute top-3 right-3 rounded-full p-1">
                        <CheckCircle2 className="size-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </StepWrapper>
          </div>
        </div>
      </div>

      {/* Right Column (Preview) - Independently Scrollable on Desktop, stacked below on Mobile */}
      <div className="bg-muted/10 border-border/50 custom-scrollbar flex w-full flex-col items-center border-t lg:h-full lg:w-[520px] lg:overflow-y-auto lg:border-t-0 lg:border-l">
        <div className="w-full max-w-[360px] space-y-10 px-6 py-12 pb-24 lg:pb-12">
          {/* Phone Mockup */}
          <div className="ring-muted/50 group relative aspect-[9/16] w-full overflow-hidden rounded-[48px] border-[10px] border-[#151515] bg-[#000] shadow-2xl ring-4">
            {/* Dynamic Content */}
            <div className="animate-in fade-in absolute inset-0 duration-1000">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentStyleData?.src || "/placeholder.png"}
                className="linear h-full w-full scale-110 animate-pulse object-cover opacity-80 brightness-75 transition-transform duration-[10s] group-hover:scale-100"
                alt="Style Preview"
              />
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Watermark */}
            <div className="absolute top-8 left-8 flex items-center gap-2 opacity-50 select-none">
              <Video className="size-4 text-white" />
              <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase">
                Flickzo
              </span>
            </div>

            {/* Mock Caption */}
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-8 pb-28 text-center">
              <div
                className={cn(
                  "animate-in zoom-in-50 text-3xl duration-500",
                  selectedCaptionStyle?.className
                )}
              >
                {selectedTopic || "YOUR STORY"}
              </div>
            </div>

            {/* Simplified Audio Visualizer Mock */}
            <div className="absolute right-0 bottom-10 left-0 flex justify-center px-8">
              <div className="flex h-3 items-end gap-1 transition-all duration-500 group-hover:h-4">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-primary/40 w-0.5 animate-pulse rounded-full"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Summary Tooltip */}
          <div className="bg-background/80 border-border space-y-3 rounded-2xl border p-4 shadow-md backdrop-blur-sm">
            <div className="text-muted-foreground flex items-center gap-2 text-xs leading-none font-bold tracking-widest uppercase">
              <Info className="text-primary size-3" /> Configuration Summary
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="col-span-2">
                <SummaryItem
                  label="Video Title"
                  value={
                    selectedScriptIdx !== null
                      ? generatedScripts[selectedScriptIdx].title
                      : "---"
                  }
                />
              </div>
              <SummaryItem label="Aesthetic" value={selectedStyle} />
              <SummaryItem
                label="Narration"
                value={currentVoiceData?.Name || "---"}
              />
              <SummaryItem
                label="Captions"
                value={selectedCaptionStyle?.label}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="w-full pt-4">
            <Button
              className="shadow-primary/20 group bg-primary text-primary-foreground relative h-14 w-full overflow-hidden rounded-2xl border-none text-sm font-bold tracking-widest uppercase shadow-xl transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
              disabled={selectedScriptIdx === null}
              onClick={handleCreateVideo}
            >
              <div className="from-primary via-primary-foreground/10 to-primary absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Animated Shine Effect */}
              <div className="group-hover:animate-shine absolute inset-0 h-full w-1/2 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <span className="relative flex items-center justify-center gap-2.5">
                <Video className="size-5 transition-transform duration-300 group-hover:scale-110" />
                <span>Generate Cinematic Video</span>
              </span>
            </Button>
            <p className="text-muted-foreground mt-4 text-center text-[10px] font-medium tracking-tighter uppercase opacity-50">
              Estimated generation time: ~60 seconds
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepWrapper({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-5">
        <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-black">
          {index}
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl leading-none font-black tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm font-medium">
            {description}
          </p>
        </div>
      </div>
      <div className="pl-0 lg:pl-12">{children}</div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-[9px] font-black uppercase opacity-50">
        {label}
      </span>
      <span className="max-w-[80px] truncate text-xs font-bold">
        {value || "---"}
      </span>
    </div>
  );
}
