"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AudioPlayerProvider,
  useAudioPlayer,
} from "@/components/ui/audio-player"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Orb } from "@/components/ui/orb"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type VideoVoice } from "@/lib/data"

interface VoicePickerProps {
  voices: VideoVoice[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
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
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  const selectedVoice = voices.find((v) => v.id === value)

  return (
    <AudioPlayerProvider>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn("w-full justify-between h-12 rounded-xl border-border/50", className)}
          >
            {selectedVoice ? (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="relative size-6 shrink-0 overflow-visible">
                  <Orb agentState="thinking" className="absolute inset-0" />
                </div>
                <span className="truncate font-bold">{selectedVoice.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground font-medium">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                      onValueChange?.(voice.id)
                      if (!isControlled) setInternalOpen(false)
                    }}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </AudioPlayerProvider>
  )
}

interface VoicePickerItemProps {
  voice: VideoVoice
  isSelected: boolean
  onSelect: () => void
}

function VoicePickerItem({
  voice,
  isSelected,
  onSelect,
}: VoicePickerItemProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const player = useAudioPlayer()

  const preview = voice.sampleUrl
  const audioItem = React.useMemo(
    () => (preview ? { id: voice.id, src: preview, data: voice } : null),
    [preview, voice]
  )

  const isPlaying =
    audioItem && player.isItemActive(audioItem.id) && player.isPlaying

  const handlePreview = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!audioItem) return

      if (isPlaying) {
        player.pause()
      } else {
        player.play(audioItem)
      }
    },
    [audioItem, isPlaying, player]
  )

  return (
    <CommandItem
      value={voice.name} // Search by name
      onSelect={onSelect}
      className="flex items-center gap-3 p-3 cursor-pointer"
    >
      <div
        className="relative z-10 size-9 shrink-0 cursor-pointer overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePreview}
      >
        <Orb
          agentState={isPlaying ? "talking" : undefined}
          className="pointer-events-none absolute inset-0"
        />
        {(isHovered || isPlaying) && (
          <div className="pointer-events-none absolute inset-0 flex size-9 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity">
            {isPlaying ? (
              <Pause className="size-3.5 text-white" />
            ) : (
              <Play className="size-3.5 text-white ml-0.5" />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-bold tracking-tight">{voice.name}</span>
        <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-medium tracking-wider">
          <span>{voice.gender}</span>
          <span>•</span>
          <span className="truncate max-w-[150px]">{voice.description}</span>
        </div>
      </div>

      <Check
        className={cn(
          "ml-auto size-4 shrink-0 text-primary",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  )
}

export { VoicePicker, VoicePickerItem }
