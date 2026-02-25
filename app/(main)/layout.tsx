import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

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
      <SidebarInset className="relative overflow-hidden">
        <SidebarTrigger className="bg-background/80 hover:bg-muted absolute top-4 left-4 z-50 flex size-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all transition-colors" />
        <div className="custom-scrollbar h-[calc(100vh-1rem)] overflow-y-auto pt-10 md:p-4 md:pt-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
