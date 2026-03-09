# QuFlow

A step-by-step JavaScript event loop visualizer. Write or paste JavaScript code and watch how it flows through the call stack, task queue, microtask queue, and browser APIs in real time.

## What it does

QuFlow parses JavaScript code into an AST, simulates the event loop execution model, and visualizes each step. You can step through manually or autoplay at different speeds.

Supported constructs:

- `console.log()`
- `setTimeout()`
- `Promise.resolve().then()`
- `queueMicrotask()`
- `requestAnimationFrame()`

It does not support variables, loops, conditionals, async/await, or promise chaining. The focus is on illustrating how the event loop schedules and processes different task types.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand for state
- Acorn for AST parsing
- Radix UI primitives

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Tests

```bash
npm test
```

Tests cover the simulation engine: AST parsing, step calculation, serialization, and type guards.

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Project structure

```
app/            Next.js app router (single page)
components/     UI components and visualizer panels
hooks/          Zustand store, autoplay, keyboard shortcuts
utils/          Event loop simulation engine
styles/themes/  Dark and light theme CSS
```

## How the simulation works

1. Code is parsed into an AST using Acorn.
2. The AST is traversed to build a sequence of event loop steps.
3. Each step represents a push, pop, or shift on one of the queues (call stack, macrotask, microtask, rAF, web API, console).
4. The UI replays these steps one at a time, updating each queue panel to show the current state.

## License

MIT
