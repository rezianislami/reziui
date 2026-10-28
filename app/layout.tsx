import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE_URL } from "@/lib/site";
import { Toaster } from "@/registry/reziui/ui/toast";
import { TooltipProvider } from "@/registry/reziui/ui/tooltip";
import "lenis/dist/lenis.css";
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
  // Makes the og:image from app/opengraph-image.png absolute; crawlers ignore
  // relative image URLs.
  metadataBase: new URL(SITE_URL),
  title: { default: "Rezi UI", template: "%s · Rezi UI" },
  description: "Copy-paste React components distributed through a shadcn registry.",
  openGraph: { type: "website", siteName: "Rezi UI" },
  twitter: { card: "summary_large_image" },
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
        <SmoothScroll />
        {/* Light by default, matching the portfolio; a visitor's toggle choice still persists. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
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
