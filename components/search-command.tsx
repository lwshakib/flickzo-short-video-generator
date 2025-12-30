"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    IconVideo,
    IconSearch,
    IconPlus,
    IconHome,
} from "@tabler/icons-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useFlickzoStore } from "@/context"

export function SearchCommand({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: (open: boolean) => void
}) {
    const router = useRouter()
    const { recentVideos } = useFlickzoStore()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(!open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [open, setOpen])

    const runCommand = React.useCallback(
        (command: () => void) => {
            setOpen(false)
            command()
        },
        [setOpen]
    )

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search videos..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/home"))}
                    >
                        <IconHome className="mr-2 h-4 w-4" />
                        <span>Home</span>
                    </CommandItem>
                    <CommandItem
                        onSelect={() => runCommand(() => router.push("/create-video"))}
                    >
                        <IconPlus className="mr-2 h-4 w-4" />
                        <span>Create New Video</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Recent Videos">
                    {recentVideos.map((video) => (
                        <CommandItem
                            key={video.id}
                            onSelect={() => runCommand(() => router.push(`/videos/${video.id}`))}
                        >
                            <IconVideo className="mr-2 h-4 w-4" />
                            <span>{video.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
