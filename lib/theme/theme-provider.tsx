"use client";

import { useEffect } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { themeIds, getThemeDefinition } from "./theme-registry";

/**
 * Syncs the .dark class on <html> based on the active theme's isDark flag.
 *
 * next-themes with attribute="data-theme" does NOT automatically set class="dark".
 * Tailwind's dark: variant depends on @custom-variant dark (&:is(.dark *)),
 * which requires .dark on a parent element.
 */
function DarkClassManager() {
  const { resolvedTheme } = useNextTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    const def = getThemeDefinition(resolvedTheme);
    const html = document.documentElement;
    if (def?.isDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [resolvedTheme]);

  return null;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      themes={themeIds}
      enableSystem={false}
      disableTransitionOnChange
    >
      <DarkClassManager />
      {children}
    </NextThemesProvider>
  );
}
