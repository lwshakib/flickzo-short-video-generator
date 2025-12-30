import React from "react"
import { cn } from "@/lib/utils"

export function LogoIcon({ className }: { className?: string }) {
    return (
        <svg
            fill="none"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g transform="translate(5 0)">
                <path
                    d="m14.25 5c0 7.8701-6.37994 14.25-14.25 14.25v9.5h14.25v14.25h9.5c0-7.8701 6.3799-14.25 14.25-14.25v-9.5h-14.25v-14.25z"
                    fill="currentColor"
                />
            </g>
        </svg>
    )
}

export function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <LogoIcon className="size-6 text-primary shrink-0" />
            <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Flickzo
            </span>
        </div>
    )
}
