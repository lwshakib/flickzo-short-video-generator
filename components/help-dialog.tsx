"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconMail } from "@tabler/icons-react";

interface HelpDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function HelpDialog({ open, setOpen }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Get Help</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            Everything you need to know about Flickzo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Flickzo</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Flickzo is an advanced AI-powered short video generator. We
              leverage cutting-edge LLMs for scripting, high-fidelity
              text-to-speech models for voiceovers, and the latest image
              generation models to create stunning visual content for your
              social media platforms.
            </p>
          </div>

          <div className="bg-primary/5 space-y-3 rounded-lg p-4">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <IconMail className="text-primary size-4" />
              Contact Support
            </h4>
            <p className="text-muted-foreground text-sm">
              Have questions or facing issues? Reach out to us directly:
            </p>
            <a
              href="mailto:leadwithshakib@gmail.com"
              className="text-primary block truncate font-medium hover:underline"
            >
              leadwithshakib@gmail.com
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
