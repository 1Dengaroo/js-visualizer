"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ThemePicker } from "@/components/theme-picker";
import {
  CircleHelp,
  BookMarked,
  ExternalLink,
  TriangleAlert,
} from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--warm-text)", letterSpacing: "-0.02em" }}
        >
          QuFlow
        </h1>
        <p style={{ color: "var(--warm-muted)" }} className="text-base mt-1">
          JavaScript event loop, visualized step by step
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemePicker />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-3 sm:px-4 rounded-xl text-sm font-medium"
              style={{
                borderColor: "var(--warm-border)",
                color: "var(--warm-text)",
              }}
            >
              <BookMarked className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Resources</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle
                className="text-xl"
                style={{ color: "var(--warm-text)" }}
              >
                Resources
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3" style={{ color: "var(--warm-muted)" }}>
              <p className="text-sm">
                Collection of resources that personally helped me understand the
                event loop and rendering process.
              </p>
              <a
                href="https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=1476s"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm"
                  style={{
                    background: "var(--step-pop-bg)",
                    color: "var(--step-pop-text)",
                  }}
                >
                  ▶
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--warm-text)" }}
                  >
                    What the heck is the event loop anyway?
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                  </div>
                  <div className="text-xs mt-0.5">
                    Philip Roberts — JSConf EU
                  </div>
                </div>
              </a>
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: "var(--step-push-bg)",
                    color: "var(--step-push-text)",
                  }}
                >
                  MDN
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--warm-text)" }}
                  >
                    JavaScript Execution Model
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                  </div>
                  <div className="text-xs mt-0.5">
                    MDN Web Docs — Official reference
                  </div>
                </div>
              </a>
              <a
                href="https://jsflow.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: "var(--step-neutral-bg)",
                    color: "var(--step-neutral-text)",
                  }}
                >
                  JS
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--warm-text)" }}
                  >
                    JSFlow
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                  </div>
                  <div className="text-xs mt-0.5">
                    Interactive JavaScript execution visualizer
                  </div>
                </div>
              </a>
              <a
                href="https://github.com/vault-developer/event-loop-explorer/tree/master"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm"
                  style={{
                    background: "var(--queue-purple-bg)",
                    color: "var(--queue-purple-text)",
                  }}
                >
                  {"</>"}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold flex items-center gap-1.5"
                    style={{ color: "var(--warm-text)" }}
                  >
                    Event Loop Explorer
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                  </div>
                  <div className="text-xs mt-0.5">
                    AST-based event loop analysis — great reference
                    implementation
                  </div>
                </div>
              </a>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-3 sm:px-4 rounded-xl text-sm font-medium"
              style={{
                borderColor: "var(--warm-border)",
                color: "var(--warm-text)",
              }}
            >
              <CircleHelp className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">About</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle
                className="text-xl"
                style={{ color: "var(--warm-text)" }}
              >
                Why did I make this?
              </DialogTitle>
            </DialogHeader>
            <div
              className="text-base space-y-4"
              style={{ color: "var(--warm-muted)" }}
            >
              <p>
                Although I&apos;ve been working professionally as a developer
                for some time now, I found my understanding of the JavaScript
                event loop was surprisingly shaky.
              </p>
              <p>
                I couldn't explain why certain code snippets behaved the way
                they did, (like setTimeout with 0 delay still runs after
                promises), or why, despite JavaScript being single-threaded, we
                can still do things concurrently (like loading data while
                keeping the UI responsive).
              </p>
              <p>
                I built this tool to help me solify these concepts, as I believe
                that building is the best way to learn.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-3 sm:px-4 rounded-xl text-sm font-medium"
              style={{
                borderColor: "var(--warm-border)",
                color: "var(--warm-text)",
              }}
            >
              <TriangleAlert className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Limitations</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle
                className="text-xl"
                style={{ color: "var(--warm-text)" }}
              >
                Limitations
              </DialogTitle>
            </DialogHeader>
            <div
              className="text-base space-y-4"
              style={{ color: "var(--warm-muted)" }}
            >
              <p>
                This is a simplified educational model of the event loop, not a
                full JavaScript runtime. It supports{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  console.log
                </code>
                ,{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  setTimeout
                </code>
                ,{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  Promise.resolve().then()
                </code>
                ,{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  queueMicrotask
                </code>
                , and{" "}
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  requestAnimationFrame
                </code>
                .
              </p>
              <p>
                It does not support variables, loops, conditionals, promise
                chaining (
                <code className="text-xs px-1 py-0.5 rounded bg-muted">
                  .then().then()
                </code>
                ), async/await, setInterval, or complex expressions. Each
                example is designed to work within these constraints to
                illustrate core event loop concepts.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
