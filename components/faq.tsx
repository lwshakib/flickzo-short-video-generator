"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "How does the AI video generation work?",
        answer:
            "Flickzo uses a pipeline of AI models. First, an LLM generates a script based on your topic. Then, we generate search queries to find relevant stock footage from premium libraries. Finally, a Text-to-Speech model creates a voiceover, and we assemble everything into a perfectly timed video.",
    },
    {
        question: "Can I edit the generated video?",
        answer:
            "Yes! After generation, you can edit the script, change the selected video clips, choose a different voice, or update the background music before finalizing the export.",
    },
    {
        question: "Do I own the rights to the videos?",
        answer:
            "Yes. If you are on a paid plan (Producer or Studio), you have full commercial rights to the videos you create. Free plan videos are for personal use and include a watermark.",
    },
    {
        question: "What languages are supported?",
        answer:
            "Currently, we support English scripts and voiceovers. We are actively working on adding multi-language support (Spanish, French, German) in the next major update.",
    },
    {
        question: "Can I upload my own footage?",
        answer:
            "Self-upload is coming soon! For now, we provide access to a massive library of high-quality stock videos and images to ensure your videos look professional.",
    },
]

export default function FAQSection() {
    return (
        <div id="faq" className="bg-muted/30 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary uppercase tracking-wide">
                        Support
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Frequently asked questions
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        Have a different question and can't find the answer you're looking for? Reach out to our support team.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl px-4 sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent>{faq.answer}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}
