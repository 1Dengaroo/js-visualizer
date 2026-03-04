"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVisualizerStore } from "@/hooks/use-visualizer";
import {
  ChevronLeft,
  ChevronRight,
  CirclePause,
  CirclePlay,
  CircleCheckBig,
} from "lucide-react";

const SPEED_PRESETS = [
  { label: "0.5x", ms: 3000 },
  { label: "1x", ms: 1500 },
  { label: "2x", ms: 750 },
  { label: "3x", ms: 500 },
] as const;

export function StepControls() {
  const state = useVisualizerStore((s) => s.state);
  const steps = useVisualizerStore((s) => s.steps);
  const autoplay = useVisualizerStore((s) => s.autoplay);
  const setAutoplay = useVisualizerStore((s) => s.setAutoplay);
  const toggleAutoplay = useVisualizerStore((s) => s.toggleAutoplay);
  const stepForward = useVisualizerStore((s) => s.stepForward);
  const stepBackward = useVisualizerStore((s) => s.stepBackward);
  const isCompleted = useVisualizerStore((s) => s.isCompleted);
  const currentStepData = useVisualizerStore((s) => s.currentStepData);
  const speed = useVisualizerStore((s) => s.speed);
  const setSpeed = useVisualizerStore((s) => s.setSpeed);

  const atEnd = !steps.length || state.currentStep >= steps.length;

  return (
    <Card>
      <CardContent className="py-5 space-y-3">
        {/* Progress bar with inline step count */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-progress-bg overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: steps.length
                  ? `${(state.currentStep / steps.length) * 100}%`
                  : "0%",
                background:
                  "linear-gradient(90deg, var(--accent-blue), var(--accent-purple))",
              }}
            />
          </div>
          <span
            className="font-mono text-sm tabular-nums shrink-0"
            style={{ color: "var(--warm-muted)" }}
          >
            {state.currentStep}/{steps.length || 0}
          </span>
        </div>

        {/* Playback controls + speed */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setAutoplay(false);
              stepBackward();
            }}
            disabled={state.currentStep <= 0}
            className="h-10 w-10 shrink-0 rounded-xl p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={toggleAutoplay}
            disabled={atEnd}
            variant={autoplay ? "outline" : "primary"}
            className="h-10 w-10 shrink-0 rounded-full p-0"
            style={autoplay ? { borderColor: "var(--warm-border)" } : undefined}
          >
            {autoplay ? (
              <CirclePause className="w-4 h-4" />
            ) : (
              <CirclePlay className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={() => {
              setAutoplay(false);
              stepForward();
            }}
            disabled={atEnd}
            variant="success"
            className="h-10 w-10 shrink-0 rounded-xl p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <div className="flex gap-1 ml-auto">
            {SPEED_PRESETS.map((preset) => (
              <button
                key={preset.ms}
                onClick={() => setSpeed(preset.ms)}
                className="h-8 px-2.5 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background:
                    speed === preset.ms ? "var(--accent-blue)" : "var(--muted)",
                  color:
                    speed === preset.ms ? "white" : "var(--muted-foreground)",
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step info */}
        {isCompleted ? (
          <div className="px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 bg-step-push-bg text-step-push-text">
            <CircleCheckBig className="w-4 h-4 shrink-0" />
            Done — {steps.length} steps
          </div>
        ) : currentStepData ? (
          <div
            className="px-3 py-2.5 rounded-xl text-sm"
            style={{
              background: "var(--step-highlight-bg)",
              fontFamily: "var(--font-source-code), monospace",
            }}
          >
            <span className="text-[var(--accent-blue)] font-medium">
              {currentStepData.type}
            </span>
            {"queue" in currentStepData && (
              <span className="text-[var(--accent-purple)] ml-1.5">
                → {currentStepData.queue}
              </span>
            )}
            {"value" in currentStepData && (
              <span className="text-muted-foreground ml-2">
                {currentStepData.value}
              </span>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
