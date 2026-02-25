import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

/**
 * Global metadata for the application.
 * Defines SEO titles, descriptions, and favicon assets.
 */
export const metadata: Metadata = {
  title: "Flickzo - AI Cinematic Short Video Generator",
  description:
    "Transform your ideas into cinematic short-form videos in seconds with Flickzo AI. Effortless, professional narration and stunning visuals.",
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      { url: "/favicon_io/favicon.ico" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
};

/**
 * RootLayout component.
 * Wraps the entire application and provides global providers such as
 * ThemeProvider (light/dark mode) and Sonner for toast notifications.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {/* ThemeProvider manages light/dark/system theme states */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Main page content */}
          {children}
          {/* Global toast notification system */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
