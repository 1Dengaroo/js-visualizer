# Step Generation Pipeline

How user code becomes a sequence of event loop simulation steps.

## Pipeline Overview

Entry point: `useVisualizerStore.parseCode()` in `hooks/use-visualizer.ts`

```
1. getAstFromText(code)       → Acorn parser → AST (Program node)
2. getScopeFromAst(ast)       → eslint-scope → ScopeManager
3. new Calculator(scope)
     .getSteps(ast)           → Simulate event loop → ELStep[]
4. getSerialisedSteps(steps)  → AST nodes → readable strings → ELSerialisedStep[]
```

## Key Files

All under `utils/getSimulationSteps/`:

| File | Purpose |
|------|---------|
| `getAstFromText.ts` | Wraps acorn `parse()` with `ecmaVersion: "latest"` and `locations: true` |
| `getScopeFromAst.ts` | Runs `eslint-scope` to build a ScopeManager for resolving identifiers |
| `calculator.ts` | Core simulation engine (event loop model, queue management, step emission) |
| `calculator.traverse.ts` | AST walker using `acorn-walk`, handles each node type |
| `getSerializedSteps.ts` | Converts AST nodes in steps to human-readable strings |
| `utils.ts` | Pattern matchers: `isConsoleExpression`, `isSetTimeoutExpression`, etc. |
| `guards.ts` | Type guard functions for AST node types |
| `constants.ts` | Event loop wheel stop positions (degrees) |

Types live in `utils/types.ts`.

## Calculator Engine

`calculator.ts` maintains internal state:

- `macrotasks: Node[]` -- setTimeout callbacks
- `microtasks: Node[]` -- Promise.then, queueMicrotask
- `rafCallbacks: Node[]` -- requestAnimationFrame
- `callstack: Node[]` -- current execution stack
- `webApi: WebApiTask[]` -- in-flight timers (with endTime)
- `console: Node[]` -- console output
- `steps: ELStep[]` -- accumulated output
- `time: number` -- simulated clock (0-360 degrees per cycle)

### `getSteps(ast)` Algorithm

1. Emit `start` step, push entire AST as initial macrotask
2. Loop while any queue has items:
   - `processNextTask()` picks the next thing to run based on wheel position
   - Advance `this.time`
   - Execute the chosen task (traverses its AST subtree)
3. Emit `end` step

### `processNextTask()` Scheduling

Builds candidates from all queues with their target wheel times, picks the nearest one:

- **Macrotask**: Runs at 270 degrees (and 630 = 360+270)
- **Microtask**: Runs at 60, 120, 240, 300, 420 degrees (more frequent, per spec)
- **Render/rAF**: Scheduled between microtask and macrotask stops
- **WebApi resolve**: Runs when `webApiTask.endTime` is reached

Microtask draining: when microtasks run, ALL pending microtasks execute in one go (matching browser behavior).

### AST Traversal (`calculator.traverse.ts`)

Uses `acorn-walk` with handlers for:

- **CallExpression**: Detects `console.log`, `setTimeout`, `Promise.resolve().then()`, `queueMicrotask`, `requestAnimationFrame`, and user-defined function calls. Pushes/pops callstack, routes callbacks to appropriate queues.
- **BlockStatement**: Wraps with callstack push/pop, traverses children in order.
- **FunctionDeclaration**: Skipped (only executed when called via identifier lookup in scope).

Function calls are resolved by looking up the identifier in the ScopeManager, finding the declaration node, and traversing its body.

## Step Types

```typescript
type ELStep =
  | { type: "start"; time: number; ast: Node }
  | { type: "push"; queue: Queue; ast: Node; time: number }
  | { type: "push"; queue: "webApi"; ast: Node; time: number; end: number }
  | { type: "delete"; queue: "webApi"; ast: Node; time: number }
  | { type: "pop" | "shift"; queue: Queue; time: number; ast: Node }
  | { type: "render"; time: number }
  | { type: "markStop"; stop: WheelStop; time: number; value: boolean }
  | { type: "end"; time: number }

type Queue = "macrotask" | "microtask" | "rafCallback" | "callstack" | "console"
```

After serialization, each step gains a `value: string` field with a readable code snippet (e.g., `"console.log(1)"`, `"()=>{...}"`).

## Supported Constructs

- `console.log/error/warn/info`
- `setTimeout(callback, delay)`
- `Promise.resolve().then(callback)`
- `queueMicrotask(callback)`
- `requestAnimationFrame(callback)`
- Function declarations and calls
- Arrow functions in callbacks

No support for variables, loops, conditionals, promise chaining, async/await, or complex expressions.
