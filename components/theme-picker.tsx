"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/lib/theme/use-theme";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

export function ThemePicker() {
  const { isDark, setTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getTrue, getFalse);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--muted)]"
          style={{ color: "var(--warm-muted)" }}
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {mounted && isDark ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {mounted && isDark ? "Light mode" : "Dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}
