"use client";

import { useEffect } from "react";
import { useVisualizerStore } from "./use-visualizer";

export function useKeyboardShortcuts() {
  const stepForward = useVisualizerStore((s) => s.stepForward);
  const stepBackward = useVisualizerStore((s) => s.stepBackward);
  const toggleAutoplay = useVisualizerStore((s) => s.toggleAutoplay);
  const setAutoplay = useVisualizerStore((s) => s.setAutoplay);
  const steps = useVisualizerStore((s) => s.steps);
  const currentStep = useVisualizerStore((s) => s.state.currentStep);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          if (steps.length && currentStep < steps.length) {
            toggleAutoplay();
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          setAutoplay(false);
          stepForward();
          break;
        case "ArrowLeft":
          e.preventDefault();
          setAutoplay(false);
          stepBackward();
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    steps.length,
    currentStep,
    stepForward,
    stepBackward,
    toggleAutoplay,
    setAutoplay,
  ]);
}
