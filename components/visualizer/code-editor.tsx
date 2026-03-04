"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVisualizerStore, CODE_EXAMPLES } from "@/hooks/use-visualizer";
import { Code2, Play, RotateCcw, BookOpen } from "lucide-react";
import { HighlightedEditor } from "./highlighted-editor";

export function CodeEditor() {
  const code = useVisualizerStore((s) => s.code);
  const setCode = useVisualizerStore((s) => s.setCode);
  const parseCode = useVisualizerStore((s) => s.parseCode);
  const reset = useVisualizerStore((s) => s.reset);
  const isRunning = useVisualizerStore((s) => s.state.isRunning);
  const currentStepData = useVisualizerStore((s) => s.currentStepData);

  const highlightRange =
    isRunning && currentStepData && "ast" in currentStepData
      ? { start: currentStepData.ast.start, end: currentStepData.ast.end }
      : null;

  return (
    <Card className="lg:row-span-3 flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="w-10 h-10 rounded-xl bg-queue-blue-icon-bg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-queue-blue-text" />
          </div>
          Your Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 flex-1 flex flex-col">
        <div className="rounded-2xl overflow-hidden bg-code-bg border border-code-border flex-1 flex flex-col min-h-[480px]">
          <div className="px-5 py-3 border-b border-code-header-border flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-traffic-red" />
              <div className="w-3.5 h-3.5 rounded-full bg-traffic-yellow" />
              <div className="w-3.5 h-3.5 rounded-full bg-traffic-green" />
            </div>
            <span className="text-muted-foreground text-sm ml-3">
              script.js
            </span>
            <Select
              disabled={isRunning}
              onValueChange={(value) => {
                const example = CODE_EXAMPLES.find((e) => e.name === value);
                if (example) setCode(example.code);
              }}
            >
              <SelectTrigger
                size="sm"
                className="ml-auto h-8 px-3 gap-2 text-sm font-medium rounded-lg"
                style={{
                  borderColor: "var(--accent-blue)",
                  color: "var(--code-text)",
                }}
              >
                <BookOpen
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--accent-blue)" }}
                />
                <SelectValue placeholder="Try an example" />
              </SelectTrigger>
              <SelectContent>
                {CODE_EXAMPLES.map((example) => (
                  <SelectItem key={example.name} value={example.name}>
                    {example.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <HighlightedEditor
            value={code}
            onChange={setCode}
            highlightRange={highlightRange}
            readOnly={isRunning}
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={parseCode}
            variant="primary"
            disabled={isRunning}
            className="flex-1 h-12 rounded-xl font-semibold text-base"
          >
            {isRunning ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse [animation-delay:0.4s]" />
              </span>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Code
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={reset}
            className="flex-1 h-12 rounded-xl font-semibold text-base"
            style={{ borderColor: "var(--warm-border)" }}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
