# QuFlow Project Overview

JavaScript event loop visualizer. Users paste JS code, the app simulates execution through the event loop, and visualizes each step across queues, call stack, and console.

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript 5)
- **Tailwind CSS v4** with CSS-based config (`@theme inline` in `globals.css`)
- **Zustand v5** for state management
- **Radix UI** primitives (Tooltip, Dialog, ScrollArea, Select) via shadcn
- **acorn** for JavaScript parsing, **eslint-scope** for scope analysis
- **Lucide React** icons
- **next-themes** for dark/light switching
- **Jest 30** + React Testing Library for tests

## Directory Structure

```
app/
  layout.tsx          Root layout (ThemeProvider, TooltipProvider, fonts, OG metadata)
  page.tsx            Home page, renders VisualizerDashboard
  globals.css         Tailwind config, CSS custom property mappings, base styles
  error.tsx           Error boundary page
  not-found.tsx       404 page
  robots.ts           SEO
  sitemap.ts          SEO

components/
  visualizer/         Core visualization components
    visualizer-dashboard.tsx   Main responsive grid layout
    code-editor.tsx            Code input with syntax highlighting
    highlighted-editor.tsx     Custom tokenizer + AST range highlighting
    queue-card.tsx             Reusable card for each queue (5 instances)
    console-output.tsx         Terminal-style console.log display
    step-controls.tsx          Fixed bottom playback bar
    event-loop-cycle.tsx       4-stage loop diagram
    loop-stage.tsx             Individual stage badge
    flow-connector.tsx         Arrows between stages
    execution-timeline.tsx     Step history log
    dashboard-header.tsx       Title, theme toggle, help/about/limitations dialogs
    resource-link.tsx          Link component for resources dialog
  ui/                 shadcn base components (button, card, dialog, etc.)
  theme-picker.tsx    Dark/light toggle

hooks/
  use-visualizer.ts           Zustand store (all simulation + playback state)
  use-autoplay.ts             setInterval-based auto-advance
  use-keyboard-shortcuts.ts   Space/arrow key handlers

lib/
  theme/
    theme-provider.tsx        next-themes wrapper + .dark class manager
    theme-registry.ts         Theme definitions (2 themes: dark, light)
    use-theme.ts              Hook for accessing current theme
  utils.ts                    cn() utility

styles/themes/
  dark.css            "Electric Dusk" -- deep space purple-black, electric accents
  light.css           "Clean Slate" -- cool neutral canvas, soft blue primary

utils/
  types.ts                         Step, queue, and state type definitions
  constants.ts                     Event loop wheel stop positions
  getSimulationSteps/
    calculator.ts                  Core event loop simulation engine
    calculator.traverse.ts         AST walker (handles each JS construct)
    getAstFromText.ts              acorn parser wrapper
    getScopeFromAst.ts             eslint-scope wrapper
    getSerializedSteps.ts          AST node to string serializer
    utils.ts                       API call pattern matchers
    guards.ts                      AST node type guards
```

## Theming

Two themes, dark is default. Switching via `data-theme` attribute on `<html>`.

CSS custom properties organized into layers:
- **Foundation** (shadcn): background, foreground, card, primary, muted, border, etc.
- **Code editor**: bg, text, keyword, string, number, function, highlight colors
- **Queue colors**: 5 families (blue, purple, amber, orange, emerald), each with bg/border/text/accent/icon-bg/item-bg/item-border
- **Loop stages**: 4 families (blue, purple, amber, emerald) with bg/active-bg/text
- **Step indicators**: push (green), pop (red), neutral (gray), highlight
- **Flow connectors**: inactive/active gradient colors
- **Semantic**: success, warning, info, traffic lights

Colors use oklch for perceptual uniformity. Dark theme uses high chroma for saturated, eye-catching accents. Light theme uses softer, desaturated variants.

Fonts: Bricolage Grotesque (display), JetBrains Mono (code), Lora (serif fallback).

## How It Works

1. User writes or selects example JS code in the editor
2. Clicks "Run" which calls `parseCode()`:
   - acorn parses code to AST
   - eslint-scope analyzes variable bindings
   - Calculator simulates the event loop, emitting steps as it processes queues
   - Steps are serialized to include readable string values
3. Steps are stored in Zustand. User advances through them via:
   - Play/pause autoplay (configurable speed: 0.5x to 3x)
   - Manual prev/next buttons
   - Keyboard shortcuts (space, arrow keys)
4. Each step updates the VisualizerState (queue arrays, console, callstack)
5. Components subscribe to relevant state slices and re-render:
   - Queue cards show current contents
   - Console shows accumulated output
   - Code editor highlights the active AST node
   - Event loop diagram lights up active stages
   - Timeline shows execution history

## Supported JS Constructs

- `console.log/error/warn/info`
- `setTimeout(callback, delay)`
- `Promise.resolve().then(callback)`
- `queueMicrotask(callback)`
- `requestAnimationFrame(callback)`
- Function declarations and calls
- Arrow functions in callbacks

Not supported: variables, loops, conditionals, promise chaining, async/await, setInterval.

## Scripts

- `npm run dev` -- Next.js dev server
- `npm run build` -- production build
- `npm run lint` -- eslint
- `npm run test` -- jest

## CI/CD

GitHub Actions at `.github/workflows/ci.yml`: lint, test, build, typecheck in parallel on Node 20.
