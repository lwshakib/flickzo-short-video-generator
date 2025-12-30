"use client";

import { useState, useMemo } from "react";
import { Sparkles, Video, Mic2, Type, Palette, Search, ChevronRight, Play, CheckCircle2, Info } from "lucide-react";
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

export default function CreateVideoPage() {
    // Topic selection state
    const [selectedTab, setSelectedTab] = useState("suggestions");
    const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);
    const [customTopic, setCustomTopic] = useState("");
    const [scriptLoading, setScriptLoading] = useState(false);
    const [generatedScripts, setGeneratedScripts] = useState<Array<{ content: string }>>([]);
    const [selectedScriptIdx, setSelectedScriptIdx] = useState<number | null>(null);

    // Customization state
    const [selectedStyle, setSelectedStyle] = useState<string>("Anime");
    const [selectedVoice, setSelectedVoice] = useState<string>("Thalia");
    const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<any>(captionStyles[0]);

    const audioRef = useState<HTMLAudioElement | null>(null)[0]; // We'll manage this via a ref technically but let's use a standard audio tag approach or JS Audio.

    // Using a ref for the audio instance to ensure we can stop/start reliably
    const playerRef = useState(() => typeof Audio !== "undefined" ? new Audio() : null)[0];

    const selectedTopic = selectedSuggestion || customTopic;

    const handleVoicePlay = (voiceId: string, model: string) => {
        setSelectedVoice(voiceId);

        if (playerRef) {
            if (playerRef.src.includes(`${model}.wav`)) {
                playerRef.currentTime = 0;
            } else {
                playerRef.src = `/audio/${model}.wav`;
            }
            playerRef.play().catch(e => console.error("Audio playback failed:", e));
        }
    };

    const handleGenerateScript = () => {
        setScriptLoading(true);
        setTimeout(() => {
            setGeneratedScripts([
                { content: "This is a placeholder for a generated script about " + selectedTopic + ". In a world where AI creates everything, one video stands alone..." },
                { content: "Another script option: Discover the secrets of " + selectedTopic + " in this cinematic journey through time and space." }
            ]);
            setScriptLoading(false);
        }, 1500);
    };

    const currentStyleData = useMemo(() => {
        return videoStyles.find(s => s.label === selectedStyle);
    }, [selectedStyle]);

    const currentVoiceData = useMemo(() => {
        return videoVoices.find(v => v.Id === selectedVoice);
    }, [selectedVoice]);

    return (
        <div className="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden bg-background">
            {/* Left Column (Inputs) - Scrollable on desktop, part of flow on mobile */}
            <div className="flex-1 lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-border/50 custom-scrollbar">
                <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-12 pb-32">
                    {/* Header */}
                    <div className="flex flex-col gap-3">
                        <Badge variant="outline" className="w-fit border-primary/20 text-primary py-1 px-3 bg-primary/5 uppercase tracking-widest text-[10px] font-black">
                            Creation Studio
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                            Craft Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/50">Masterpiece</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                            Flickzo AI transforms your ideas into cinematic short-form videos in seconds.
                        </p>
                    </div>

                    <div className="flex flex-col gap-16">
                        {/* Step 1: Topic */}
                        <StepWrapper index={1} title="The Vision" description="Define the core idea of your video.">
                            <Card className="p-6 border-none bg-muted/30 shadow-none ring-1 ring-border/50">
                                <Tabs defaultValue="suggestions" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                                    <TabsList className="bg-muted/50 p-1 mb-6">
                                        <TabsTrigger value="suggestions" className="flex items-center gap-2 px-6">
                                            <Sparkles className="size-3.5" /> Suggestions
                                        </TabsTrigger>
                                        <TabsTrigger value="your-topic" className="flex items-center gap-2 px-6">
                                            <Type className="size-3.5" /> Custom
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="suggestions">
                                        <div className="flex gap-2 flex-wrap">
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    className={cn(
                                                        "px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border-2",
                                                        selectedSuggestion === s
                                                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
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
                                            className="h-14 text-xl font-bold bg-background border-2 border-border focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl"
                                            onChange={(e) => {
                                                setCustomTopic(e.target.value);
                                                setSelectedSuggestion(null);
                                            }}
                                        />
                                    </TabsContent>
                                </Tabs>

                                <Button
                                    className="mt-8 h-12 px-8 font-black uppercase tracking-wider text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    onClick={handleGenerateScript}
                                    disabled={!selectedTopic || scriptLoading}
                                >
                                    {scriptLoading ? "Generating..." : "Generate Scripts"}
                                    {!scriptLoading && <ChevronRight className="ml-2 size-4" />}
                                </Button>

                                {(scriptLoading || generatedScripts.length > 0) && (
                                    <div className="mt-10 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
                                        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                                            Available Narratives
                                        </h4>
                                        {scriptLoading ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Skeleton className="h-40 w-full rounded-2xl bg-muted" />
                                                <Skeleton className="h-40 w-full rounded-2xl bg-muted" />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                                {generatedScripts.map((script, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={cn(
                                                            "p-6 cursor-pointer transition-all duration-300 border-2 rounded-2xl relative",
                                                            selectedScriptIdx === idx
                                                                ? "border-primary bg-primary/5 shadow-inner"
                                                                : "border-border hover:border-primary/40 bg-background"
                                                        )}
                                                        onClick={() => setSelectedScriptIdx(idx)}
                                                    >
                                                        <p className="text-sm leading-relaxed font-medium opacity-80 italic italic">
                                                            "{script.content}"
                                                        </p>
                                                        {selectedScriptIdx === idx && (
                                                            <CheckCircle2 className="absolute top-3 right-3 size-5 text-primary fill-background" />
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
                        <StepWrapper index={2} title="Visual Aesthetic" description="The art style defines the mood.">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {videoStyles.map((style) => (
                                    <div
                                        key={style.label}
                                        className={cn(
                                            "group cursor-pointer rounded-3xl overflow-hidden transition-all duration-500 bg-muted/20 border-4",
                                            selectedStyle === style.label
                                                ? "border-primary scale-105 shadow-2xl shadow-primary/20"
                                                : "border-transparent hover:border-primary/30"
                                        )}
                                        onClick={() => setSelectedStyle(style.label)}
                                    >
                                        <div className="relative aspect-[3/4] overflow-hidden">
                                            <img
                                                src={style.src}
                                                alt={style.label}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                                                <span className="text-white font-black tracking-tight uppercase text-xs">
                                                    {style.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </StepWrapper>

                        {/* Step 3: The Voice */}
                        <StepWrapper index={3} title="The Voice" description="Professional narration for your story.">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {videoVoices.map((voice) => (
                                    <button
                                        key={voice.Id}
                                        className={cn(
                                            "p-5 rounded-2xl text-left transition-all duration-300 border-2 flex items-center gap-4 group",
                                            selectedVoice === voice.Id
                                                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                                                : "border-border bg-background hover:border-primary/30"
                                        )}
                                        onClick={() => handleVoicePlay(voice.Id, voice.Model)}
                                    >
                                        <div className={cn(
                                            "size-12 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                                            selectedVoice === voice.Id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                                        )}>
                                            <Mic2 className="size-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black tracking-tight text-lg leading-none mb-1">{voice.Name}</h4>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase">
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
                        <StepWrapper index={4} title="Typography" description="How the message appears on screen.">
                            <div className="grid grid-cols-2 gap-4">
                                {captionStyles.map((style) => (
                                    <button
                                        key={style.label}
                                        className={cn(
                                            "p-8 rounded-3xl transition-all duration-500 border-4 h-32 flex items-center justify-center relative overflow-hidden group",
                                            selectedCaptionStyle?.label === style.label
                                                ? "border-primary shadow-2xl shadow-primary/10 bg-[#0a0a0a]"
                                                : "border-border bg-[#0a0a0a] hover:border-primary/30"
                                        )}
                                        onClick={() => setSelectedCaptionStyle(style)}
                                    >
                                        <div className={cn("text-2xl text-center leading-tight transition-transform duration-500 group-hover:scale-110", style.className)}>
                                            {style.label}
                                        </div>
                                        {selectedCaptionStyle?.label === style.label && (
                                            <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1 rounded-full">
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
            <div className="w-full lg:w-[520px] bg-muted/10 lg:h-full lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-border/50 custom-scrollbar flex flex-col items-center">
                <div className="w-full max-w-[360px] py-12 px-6 space-y-10 pb-24 lg:pb-12">

                    {/* Phone Mockup */}
                    <div className="relative aspect-[9/16] w-full rounded-[48px] border-[10px] border-[#151515] bg-[#000] shadow-2xl ring-4 ring-muted/50 overflow-hidden group">
                        {/* Dynamic Content */}
                        <div className="absolute inset-0 animate-in fade-in duration-1000">
                            <img
                                src={currentStyleData?.src || "/placeholder.png"}
                                className="w-full h-full object-cover opacity-80 brightness-75 scale-110 group-hover:scale-100 transition-transform duration-[10s] linear animate-pulse"
                                alt="Style Preview"
                            />
                        </div>

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                        {/* Watermark */}
                        <div className="absolute top-8 left-8 flex items-center gap-2 opacity-50 select-none">
                            <Video className="size-4 text-white" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Flickzo</span>
                        </div>

                        {/* Mock Caption */}
                        <div className="absolute inset-0 flex items-end justify-center pb-28 p-8 text-center pointer-events-none">
                            <div className={cn("animate-in zoom-in-50 duration-500 text-3xl", selectedCaptionStyle?.className)}>
                                {selectedTopic || "YOUR STORY"}
                            </div>
                        </div>

                        {/* Simplified Audio Visualizer Mock */}
                        <div className="absolute bottom-10 left-0 right-0 px-8 flex justify-center">
                            <div className="flex gap-1 items-end h-3 group-hover:h-4 transition-all duration-500">
                                {[...Array(12)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-0.5 bg-primary/40 rounded-full animate-pulse"
                                        style={{
                                            height: `${20 + Math.random() * 80}%`,
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary Tooltip */}
                    <div className="bg-background/80 p-4 rounded-2xl border border-border shadow-md backdrop-blur-sm space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">
                            <Info className="size-3 text-primary" /> Configuration Summary
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            <SummaryItem label="Aesthetic" value={selectedStyle} />
                            <SummaryItem label="Narration" value={currentVoiceData?.Name || "---"} />
                            <SummaryItem label="Captions" value={selectedCaptionStyle?.label} />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 w-full">
                        <Button
                            className="w-full h-14 font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 rounded-2xl hover:translate-y-[-2px] active:translate-y-[1px] transition-all group overflow-hidden relative bg-primary text-primary-foreground border-none"
                            disabled={selectedScriptIdx === null}
                            onClick={() => console.log("Generating...")}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-foreground/10 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Animated Shine Effect */}
                            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-shine" />

                            <span className="relative flex items-center justify-center gap-2.5">
                                <Video className="size-5 group-hover:scale-110 transition-transform duration-300" />
                                <span>Generate Cinematic Video</span>
                            </span>
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium opacity-50 uppercase tracking-tighter">
                            Estimated generation time: ~60 seconds
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepWrapper({ index, title, description, children }: { index: number, title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="space-y-6">
            <div className="flex items-start gap-5">
                <div className="shrink-0 size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black text-[10px]">
                    {index}
                </div>
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight uppercase leading-none">{title}</h2>
                    <p className="text-muted-foreground text-sm font-medium">{description}</p>
                </div>
            </div>
            <div className="pl-0 lg:pl-12">
                {children}
            </div>
        </div>
    );
}

function SummaryItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase opacity-50">{label}</span>
            <span className="text-xs font-bold truncate max-w-[80px]">{value || "---"}</span>
        </div>
    );
}
