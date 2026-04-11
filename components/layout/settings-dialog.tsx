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
    { name: "Light", value: "light", icon: IconSun },
    { name: "Dark", value: "dark", icon: IconMoon },
    { name: "System", value: "system", icon: IconDeviceDesktop },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-xl sm:max-w-xs">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold">Settings</DialogTitle>
          <DialogDescription className="text-xs">
            Personalize your interface.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <h4 className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
              Appearance
            </h4>
            <div className="flex flex-col gap-1">
              {themes.map((t) => {
                const isActive = theme === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <t.icon className="size-4" />
                    <span>{t.name}</span>
                    {isActive && <IconCheck className="ml-auto size-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
