import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

/**
 * MainLayout component.
 * Provides the authenticated user experience, including a persistent sidebar
 * and a scrollable content area.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // SidebarProvider manages the state and sizing of the sidebar
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      {/* The actual sidebar component containing navigation links */}
      <AppSidebar variant="inset" />
      {/* Main content area */}
      <SidebarInset className="relative overflow-hidden">
        {/* Floating trigger button to toggle sidebar visibility */}
        <SidebarTrigger className="bg-background/80 hover:bg-muted absolute top-4 left-4 z-50 flex size-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all transition-colors" />
        {/* Content container with custom scrollbar styling */}
        <div className="custom-scrollbar h-[calc(100vh-1rem)] overflow-y-auto pt-10 md:p-4 md:pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
