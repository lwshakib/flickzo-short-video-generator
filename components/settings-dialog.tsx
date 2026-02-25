"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  IconSun,
  IconMoon,
  IconDeviceDesktop,
  IconCheck,
} from "@tabler/icons-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SettingsDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      name: "Light",
      value: "light",
      icon: IconSun,
    },
    {
      name: "Dark",
      value: "dark",
      icon: IconMoon,
    },
    {
      name: "System",
      value: "system",
      icon: IconDeviceDesktop,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-[32px] border-none shadow-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter uppercase">
            Settings
          </DialogTitle>
          <DialogDescription className="font-medium">
            Customize your Flickzo experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <h4 className="text-muted-foreground px-1 text-xs font-black tracking-widest uppercase">
              Interface Theme
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => {
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300",
                      isActive
                        ? "border-primary bg-primary/5 text-primary shadow-primary/10 shadow-lg"
                        : "border-border bg-muted/20 text-muted-foreground hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <t.icon
                      className={cn(
                        "size-6",
                        isActive ? "animate-in zoom-in-50" : ""
                      )}
                    />
                    <span className="text-[10px] font-black tracking-tight uppercase">
                      {t.name}
                    </span>
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <IconCheck className="size-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-border/50 border-t pt-4">
            <p className="text-muted-foreground text-center text-[10px] font-medium tracking-tighter uppercase opacity-50">
              v1.0.0 • AI-Powered Cinematic Synthesis
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
