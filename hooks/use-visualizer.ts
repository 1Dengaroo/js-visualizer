import { create } from "zustand";
import { Calculator } from "@/utils/getSimulationSteps/calculator";
import { getAstFromText } from "@/utils/getSimulationSteps/getAstFromText";
import { getScopeFromAst } from "@/utils/getSimulationSteps/getScopeFromAst";
import { getSerialisedSteps } from "@/utils/getSimulationSteps/getSerializedSteps";
import { ELSerialisedStep } from "@/utils/types";

export interface VisualizerState {
  callStack: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  rafQueue: string[];
  webApis: { value: string; endTime: number }[];
  console: string[];
  currentStep: number;
  isRunning: boolean;
}

const initialState: VisualizerState = {
  callStack: [],
  taskQueue: [],
  microtaskQueue: [],
  rafQueue: [],
  webApis: [],
  console: [],
  currentStep: 0,
  isRunning: false,
};

const DEFAULT_CODE = `console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");`;

export const CODE_EXAMPLES: { name: string; code: string }[] = [
  {
    name: "Basic Event Loop",
    code: DEFAULT_CODE,
  },
  {
    name: "Nested Functions & Queues",
    code: `function scheduleIO() {
  console.log('scheduleIO');
  setTimeout(() => {
    console.log('io:fast');
    enqueueMicro();
  }, 0);
  setTimeout(() => {
    console.log('io:slow');
    scheduleFrame();
  }, 500);
}

function enqueueMicro() {
  queueMicrotask(() => {
    console.log('micro:queued');
    Promise.resolve().then(() => console.log('micro:chained'));
  });
}

function scheduleFrame() {
  requestAnimationFrame(() => {
    console.log('frame:paint');
    queueMicrotask(() => console.log('frame:micro'));
  });
}

function kickoff() {
  console.log('kickoff');
  Promise.resolve().then(() => {
    console.log('kickoff:then');
    scheduleIO();
  });
  queueMicrotask(() => console.log('kickoff:micro'));
  setTimeout(() => console.log('kickoff:timeout'), 0);
  console.log('kickoff:sync');
}

console.log('start');
kickoff();
console.log('end');`,
  },
  {
    name: "requestAnimationFrame",
    code: `console.log("start");

requestAnimationFrame(() => {
  console.log("rAF 1");
});

setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("microtask");
});

requestAnimationFrame(() => {
  console.log("rAF 2");
});

console.log("end");`,
  },
  {
    name: "Microtask Ordering",
    code: `console.log("start");

Promise.resolve().then(() => {
  console.log("promise 1");
});

queueMicrotask(() => {
  console.log("microtask 1");
});

Promise.resolve().then(() => {
  console.log("promise 2");
});

queueMicrotask(() => {
  console.log("microtask 2");
});

console.log("end");`,
  },
  {
    name: "Mixed Timers",
    code: `console.log("start");

setTimeout(() => {
  console.log("timeout 1");
  queueMicrotask(() => console.log("micro inside timeout"));
}, 0);

setTimeout(() => console.log("timeout 2"), 100);

queueMicrotask(() => {
  console.log("micro 1");
});

queueMicrotask(() => {
  console.log("micro 2");
});

console.log("end");`,
  },
];

interface VisualizerStore {
  // Code
  code: string;
  setCode: (code: string) => void;

  // Simulation data
  steps: ELSerialisedStep[];
  state: VisualizerState;
  error: string | null;

  // Playback
  autoplay: boolean;
  setAutoplay: (autoplay: boolean) => void;
  toggleAutoplay: () => void;
  speed: number;
  setSpeed: (speed: number) => void;

  // Derived
  isCompleted: boolean;
  currentStepData: ELSerialisedStep | undefined;

  // Actions
  parseCode: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  reset: () => void;
}

function applyStep(
  state: VisualizerState,
  step: ELSerialisedStep,
  direction: "forward" | "replay",
): VisualizerState {
  const s = { ...state };

  if (step.type === "push" && "queue" in step) {
    switch (step.queue) {
      case "callstack":
        s.callStack = [...s.callStack, step.value];
        break;
      case "macrotask":
        s.taskQueue = [...s.taskQueue, step.value];
        break;
      case "microtask":
        s.microtaskQueue = [...s.microtaskQueue, step.value];
        break;
      case "rafCallback":
        s.rafQueue = [...s.rafQueue, step.value];
        break;
      case "console":
        s.console = [...s.console, step.value];
        break;
      case "webApi":
        const webApiStep = step as ELSerialisedStep & {
          type: "push";
          queue: "webApi";
        };
        s.webApis = [
          ...s.webApis,
          { value: step.value, endTime: webApiStep.end },
        ];
        break;
    }
  } else if (
    (step.type === "pop" || step.type === "shift") &&
    "queue" in step
  ) {
    switch (step.queue) {
      case "callstack":
        s.callStack = s.callStack.slice(0, -1);
        break;
      case "macrotask":
        s.taskQueue = s.taskQueue.slice(1);
        break;
      case "microtask":
        s.microtaskQueue = s.microtaskQueue.slice(1);
        break;
      case "rafCallback":
        s.rafQueue = s.rafQueue.slice(1);
        break;
    }
  } else if (step.type === "delete" && step.queue === "webApi") {
    s.webApis = s.webApis.slice(1);
  } else if (step.type === "end" && direction === "forward") {
    s.isRunning = false;
  }

  return s;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  code: DEFAULT_CODE,
  setCode: (code) => set({ code }),

  steps: [],
  state: initialState,
  error: null,

  autoplay: true,
  setAutoplay: (autoplay) => set({ autoplay }),
  toggleAutoplay: () => set((s) => ({ autoplay: !s.autoplay })),
  speed: 1500,
  setSpeed: (speed) => set({ speed }),

  isCompleted: false,
  currentStepData: undefined,

  parseCode: () => {
    const { code } = get();
    try {
      const ast = getAstFromText(code);
      const scope = getScopeFromAst(ast);
      const calculatorSteps = new Calculator(scope).getSteps(ast);
      const serialized = getSerialisedSteps(calculatorSteps, scope);
      const newState = { ...initialState, isRunning: true };
      set({
        steps: serialized,
        state: newState,
        error: null,
        autoplay: true,
        isCompleted: false,
        currentStepData: serialized[0],
      });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  },

  stepForward: () => {
    const { steps, state } = get();
    if (state.currentStep >= steps.length) return;

    const step = steps[state.currentStep];
    let newState = applyStep(state, step, "forward");
    newState.currentStep = state.currentStep + 1;

    const isCompleted =
      newState.currentStep >= steps.length && !newState.isRunning;
    set({
      state: newState,
      isCompleted,
      currentStepData: steps[newState.currentStep],
    });
  },

  stepBackward: () => {
    const { steps, state } = get();
    if (state.currentStep <= 0) return;

    let newState = { ...initialState, isRunning: true };
    for (let i = 0; i < state.currentStep - 1; i++) {
      newState = applyStep(newState, steps[i], "replay");
    }
    newState.currentStep = state.currentStep - 1;

    set({
      state: newState,
      isCompleted: false,
      currentStepData: steps[newState.currentStep],
    });
  },

  reset: () => {
    set({
      steps: [],
      state: initialState,
      error: null,
      isCompleted: false,
      currentStepData: undefined,
    });
  },
}));
