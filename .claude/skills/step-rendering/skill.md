# Step Rendering (Frontend)

How simulation steps become visual UI updates.

## State Management

Zustand store in `hooks/use-visualizer.ts`.

### VisualizerState

```typescript
interface VisualizerState {
  callStack: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  rafQueue: string[];
  webApis: { value: string; endTime: number }[];
  console: string[];
  currentStep: number;
  isRunning: boolean;
}
```

### Store Shape

- `code: string` -- user input
- `steps: ELSerialisedStep[]` -- all simulation steps
- `state: VisualizerState` -- current queue contents
- `autoplay: boolean`, `speed: number` -- playback controls
- `isCompleted: boolean` -- all steps exhausted
- `currentStepData: ELSerialisedStep | undefined` -- step being shown
- `error: string | null`

### Actions

- `parseCode()` -- parse + simulate, populate `steps`
- `stepForward()` -- apply next step via `applyStep(state, step, "forward")`, increment `currentStep`
- `stepBackward()` -- replay all steps from 0 to `currentStep - 2` (full rebuild)
- `reset()` -- clear everything
- `toggleAutoplay()`, `setSpeed(ms)`

## applyStep Function

Location: `hooks/use-visualizer.ts` lines 185-245.

Takes `(state, step, direction)` and returns new state:

| Step Type | Effect |
|-----------|--------|
| `push` (callstack) | Append to `callStack` |
| `push` (macrotask) | Append to `taskQueue` |
| `push` (microtask) | Append to `microtaskQueue` |
| `push` (rafCallback) | Append to `rafQueue` |
| `push` (webApi) | Append to `webApis` with endTime |
| `push` (console) | Append to `console` |
| `pop`/`shift` | Remove from head or tail of the relevant queue |
| `delete` (webApi) | Remove first webApi entry |
| `end` | Set `isRunning = false` (forward only, ignored on replay) |

Backward stepping works by replaying all steps from scratch up to `currentStep - 1`. This is simple over O(1) reverse operations.

## Playback Hooks

### `useAutoplay()` (`hooks/use-autoplay.ts`)
- `setInterval` that calls `stepForward()` every `speed` ms
- Only active when `autoplay && isRunning && currentStep < steps.length`

### `useKeyboardShortcuts()` (`hooks/use-keyboard-shortcuts.ts`)
- Space: toggle autoplay
- Arrow Right: step forward (pauses autoplay)
- Arrow Left: step backward (pauses autoplay)

## Components and What They Render

All in `components/visualizer/`.

### QueueCard (`queue-card.tsx`)
- Instantiated 5 times: Call Stack, Web APIs, Task Queue, Microtask Queue, rAF Queue
- Subscribes to the relevant array in `state` (e.g., `state.callStack`)
- Shows count badge, scrollable list of items in monospace, color-coded by queue type
- Each queue has a unique color (blue, amber, orange, purple, emerald) and accent top border

### ConsoleOutput (`console-output.tsx`)
- Subscribes to `state.console`
- Terminal-like display with dark background (`code-bg`)
- Line numbers, auto-scrolls to bottom on new entries

### CodeEditor (`code-editor.tsx`) + HighlightedEditor (`highlighted-editor.tsx`)
- Subscribes to `currentStepData` for highlight range
- Derives `{ start, end }` from `currentStepData.ast` when `isRunning`
- Dual-layer rendering: `<pre>` with syntax-highlighted HTML + transparent `<textarea>` overlay
- Custom tokenizer for keywords, strings, numbers, comments, functions
- Wraps active AST range in `<mark class="code-highlight">` (yellow highlight)
- Textarea disabled during execution

### EventLoopCycle (`event-loop-cycle.tsx`) + LoopStage (`loop-stage.tsx`)
- 4 stages: Call Stack, Microtasks, Tasks, Render
- Each stage lights up (scale + color change) when its queue is non-empty
- FlowConnector arrows between stages animate based on queue state

### ExecutionTimeline (`execution-timeline.tsx`)
- Shows `steps.slice(0, currentStep)` as a scrollable list
- Color-coded badges: push (green), pop/shift (red), other (gray)
- Current step highlighted with `step-highlight-bg`
- Auto-scrolls to latest

### StepControls (`step-controls.tsx`)
- Fixed bottom bar with glass morphism (`backdrop-blur-xl`)
- Shows current step type, queue, value, and counter (`N/total`)
- Previous / Play-Pause / Next buttons
- Speed presets: 0.5x, 1x, 2x, 3x
- Completion state: "Complete -- N steps"

## Data Flow Summary

```
User clicks Next → stepForward()
  → applyStep(state, steps[currentStep], "forward")
  → new state written to store
  → Zustand notifies subscribers:
      QueueCard     re-renders (queue arrays changed)
      ConsoleOutput re-renders (console array changed)
      CodeEditor    re-renders (currentStepData changed, new highlight range)
      EventLoopCycle re-renders (queue lengths changed, stages light up/dim)
      Timeline      re-renders (currentStep changed, new entry visible)
      StepControls  re-renders (step info text updated)
```

## Layout

`visualizer-dashboard.tsx` uses a responsive grid:
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (lg): `grid-cols-[1.1fr_1fr_1fr]`

Code editor spans left column on desktop (row-span-3). Event loop and timeline span right 2 columns (`lg:col-start-2 lg:col-span-2`). Bottom padding (`pb-40 lg:pb-8`) clears the fixed step controls bar.
