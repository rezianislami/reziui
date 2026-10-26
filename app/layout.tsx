import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/registry/reziui/ui/toast";
import { TooltipProvider } from "@/registry/reziui/ui/tooltip";
import "./globals.css";

// Registered as --font-sans because globals.css maps the Tailwind font-sans
// utility to that exact variable.
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Rezi UI", template: "%s · Rezi UI" },
  description: "Copy-paste React components distributed through a shadcn registry.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the `dark` class on <html> before hydration, so React
    // would otherwise warn about the className mismatch.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* One provider for the whole site, so header tooltips share the
              instant hand-off between neighbouring buttons. */}
          <TooltipProvider>{children}</TooltipProvider>
          {/* 72px from the top clears the 60px sticky header with a 12px gap,
              on phones too (Sonner's phone default is 16px). */}
          <Toaster offset={{ top: 72 }} mobileOffset={{ top: 72 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
