import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-source-code",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://quflow.dev";

export const metadata: Metadata = {
  title: "QuFlow - JavaScript Event Loop Visualizer",
  description:
    "Watch JavaScript execute step by step. Understand the event loop, call stack, microtasks, and task queue visually.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "QuFlow - JavaScript Event Loop Visualizer",
    description:
      "Watch JavaScript execute step by step. Understand the event loop, call stack, microtasks, and task queue visually.",
    url: siteUrl,
    siteName: "QuFlow",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuFlow - JavaScript Event Loop Visualizer",
    description:
      "Watch JavaScript execute step by step. Understand the event loop, call stack, microtasks, and task queue visually.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
