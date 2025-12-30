import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset className="overflow-hidden relative">
                <SidebarTrigger className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur-md border shadow-sm rounded-full size-9 flex items-center justify-center hover:bg-muted transition-colors transition-all" />
                <div className="md:p-4 pt-10 md:pt-4 h-[calc(100vh-1rem)] overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}



