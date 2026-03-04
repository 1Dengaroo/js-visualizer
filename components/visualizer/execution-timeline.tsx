"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useVisualizerStore } from "@/hooks/use-visualizer";

export function ExecutionTimeline() {
  const state = useVisualizerStore((s) => s.state);
  const steps = useVisualizerStore((s) => s.steps);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = timelineRef.current?.querySelector(
      "[data-slot='scroll-area-viewport']",
    ) as HTMLElement | null;
    if (viewport) viewport.scrollTop = viewport.scrollHeight;
  }, [state.currentStep]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Execution Timeline</span>
          <Badge variant="outline" className="font-normal text-sm px-3 py-1">
            {state.currentStep} steps executed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea ref={timelineRef} className="h-[280px]">
          {state.currentStep === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground">
              <p className="text-base">
                Click &quot;Next Step&quot; to begin execution
              </p>
            </div>
          ) : (
            <div className="space-y-2 pr-4">
              {steps.slice(0, state.currentStep).map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-base"
                  style={{
                    background:
                      i === state.currentStep - 1
                        ? "var(--step-highlight-bg)"
                        : "transparent",
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                    style={{
                      background:
                        step.type === "push"
                          ? "var(--step-push-bg)"
                          : step.type === "pop" || step.type === "shift"
                            ? "var(--step-pop-bg)"
                            : "var(--step-neutral-bg)",
                      color:
                        step.type === "push"
                          ? "var(--step-push-text)"
                          : step.type === "pop" || step.type === "shift"
                            ? "var(--step-pop-text)"
                            : "var(--step-neutral-text)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`font-medium shrink-0 ${
                      step.type === "push"
                        ? "text-step-push-text"
                        : step.type === "pop" || step.type === "shift"
                          ? "text-step-pop-text"
                          : "text-step-neutral-text"
                    }`}
                  >
                    {step.type}
                  </span>
                  {"queue" in step && (
                    <Badge
                      variant="secondary"
                      className="text-sm px-2 shrink-0"
                    >
                      {step.queue}
                    </Badge>
                  )}
                  {"value" in step && (
                    <span
                      className="text-muted-foreground text-sm truncate"
                      style={{
                        fontFamily: "var(--font-source-code), monospace",
                      }}
                    >
                      {step.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
