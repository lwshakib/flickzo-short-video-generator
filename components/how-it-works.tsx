"use client"
import Image from "next/image"

export default function HowItWorksSection() {
    return (
        <div id="how-it-works" className="overflow-hidden bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl lg:mx-0 lg:max-w-none">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-wide">
                            Workflow
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            From idea to video in 3 steps
                        </p>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            We've simplified the video production process. You don't need to be a video editor or have a camera crew. Just bring your ideas.
                        </p>
                    </div>
                    <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        <div className="relative pl-9">
                            <dt className="inline font-semibold text-foreground">
                                <span className="absolute left-1 top-1 h-5 w-5 text-primary text-xs flex items-center justify-center border border-primary rounded-full">1</span>
                                Prompt.
                            </dt>
                            <dd className="inline"> Describe your video topic, paste a URL, or upload a document. Our AI analyzes the core message.</dd>
                        </div>
                        <div className="relative pl-9">
                            <dt className="inline font-semibold text-foreground">
                                <span className="absolute left-1 top-1 h-5 w-5 text-primary text-xs flex items-center justify-center border border-primary rounded-full">2</span>
                                Review.
                            </dt>
                            <dd className="inline"> We generate a script and storyboard. You can edit the text, swap stock footage, or change visual styles instantly.</dd>
                        </div>
                        <div className="relative pl-9">
                            <dt className="inline font-semibold text-foreground">
                                <span className="absolute left-1 top-1 h-5 w-5 text-primary text-xs flex items-center justify-center border border-primary rounded-full">3</span>
                                Publish.
                            </dt>
                            <dd className="inline"> Hit export. We render the final video with AI voiceovers, music, and subtitles. Ready to share.</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}
