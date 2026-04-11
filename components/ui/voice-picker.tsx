"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Pause, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AudioPlayerProvider,
  useAudioPlayer,
} from "@/components/ui/audio-player";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type VideoVoice } from "@/lib/data";

interface VoicePickerProps {
  voices: VideoVoice[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function VoicePicker({
  voices,
  value,
  onValueChange,
  placeholder = "Select a voice...",
  className,
  open,
  onOpenChange,
}: VoicePickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  const selectedVoice = voices.find((v) => v.id === value);

  return (
    <AudioPlayerProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "border-border/50 h-12 w-full justify-between rounded-xl",
              className
            )}
          >
            {selectedVoice ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="truncate font-bold">{selectedVoice.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground font-medium">
                {placeholder}
              </span>
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command className="bg-background">
            <CommandInput placeholder="Search voices..." />
            <CommandList>
              <CommandEmpty>No voice found.</CommandEmpty>
              <CommandGroup>
                {voices.map((voice) => (
                  <VoicePickerItem
                    key={voice.id}
                    voice={voice}
                    isSelected={value === voice.id}
                    onSelect={() => {
                      onValueChange?.(voice.id);
                      if (!isControlled) setInternalOpen(false);
                    }}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </AudioPlayerProvider>
  );
}

interface VoicePickerItemProps {
  voice: VideoVoice;
  isSelected: boolean;
  onSelect: () => void;
}

function VoicePickerItem({
  voice,
  isSelected,
  onSelect,
}: VoicePickerItemProps) {
  const player = useAudioPlayer();

  const preview = voice.sampleUrl;
  const audioItem = React.useMemo(
    () => (preview ? { id: voice.id, src: preview, data: voice } : null),
    [preview, voice]
  );

  const isPlaying =
    audioItem && player.isItemActive(audioItem.id) && player.isPlaying;

  const handlePreview = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!audioItem) return;

      if (isPlaying) {
        player.pause();
      } else {
        player.play(audioItem);
      }
    },
    [audioItem, isPlaying, player]
  );

  return (
    <CommandItem
      value={voice.name} // Search by name
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 p-3"
    >
      <div
        className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 cursor-pointer transition-colors hover:bg-primary/20 text-primary"
        onClick={handlePreview}
      >
        {isPlaying ? (
          <Pause className="size-4" />
        ) : (
          <Play className="size-4 ml-0.5" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-bold tracking-tight">{voice.name}</span>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium tracking-wider">
          <span>{voice.gender}</span>
          <span>•</span>
          <span className="max-w-[150px] truncate">{voice.description}</span>
        </div>
      </div>

      <Check
        className={cn(
          "text-primary ml-auto size-4 shrink-0",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
}

export { VoicePicker, VoicePickerItem };
