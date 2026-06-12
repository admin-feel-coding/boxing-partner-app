export type Punch = "jab" | "cross" | "hookL" | "hookR";

export type Defense = "pullBack" | "slipLeft" | "slipRight" | "roll" | "block";

export type ComboCall = Punch | Defense;

const PUNCHES: ReadonlySet<string> = new Set(["jab", "cross", "hookL", "hookR"]);

export const isPunch = (call: ComboCall): call is Punch => PUNCHES.has(call);

export type FootworkMove =
  | "stepLeft"
  | "stepRight"
  | "stepForward"
  | "stepBack"
  | "pivotLeft"
  | "pivotRight";

export type Command =
  | { kind: "combo"; calls: ComboCall[] }
  | { kind: "footwork"; move: FootworkMove };

export type RoundStep =
  | { punch: Punch }
  | { waitMs: number }
  | { command: Command };

export type RoundFocus = "reaction" | "pads" | "footwork";

export type Round = {
  name: string;
  description: string;
  focus: RoundFocus;
  speed: number;
  steps: RoundStep[];
};

export type RoundDef = {
  name: string;
  description: string;
  focus: RoundFocus;
  patterns: RoundStep[][];
};

export const ROUND_MS = 3 * 60_000;

// Time one punch step occupies on the round timeline:
// PUNCH_MS of animation plus a short recovery before the next step.
export const PUNCH_STEP_MS = 620;

// Execution windows for commands the user must obey.
export const COMBO_BASE_MS = 600;
export const COMBO_PER_PUNCH_MS = 400;
// Defense calls need a beat to move and come back before the counter.
export const COMBO_PER_DEFENSE_MS = 650;
export const FOOTWORK_MS = 1500;

export const comboCallMs = (call: ComboCall) =>
  isPunch(call) ? COMBO_PER_PUNCH_MS : COMBO_PER_DEFENSE_MS;

export function stepDurationMs(step: RoundStep, speed = 1): number {
  let base: number;
  if ("punch" in step) {
    base = PUNCH_STEP_MS;
  } else if ("waitMs" in step) {
    base = step.waitMs;
  } else if (step.command.kind === "footwork") {
    base = FOOTWORK_MS;
  } else {
    base = COMBO_BASE_MS;
    for (const call of step.command.calls) base += comboCallMs(call);
  }
  return base / speed;
}

const p = (punch: Punch): RoundStep => ({ punch });
const w = (waitMs: number): RoundStep => ({ waitMs });
const c = (...calls: ComboCall[]): RoundStep => ({ command: { kind: "combo", calls } });
const f = (move: FootworkMove): RoundStep => ({ command: { kind: "footwork", move } });

function buildSteps(patterns: RoundStep[][], totalMs: number, speed: number): RoundStep[] {
  const steps: RoundStep[] = [];
  let elapsed = 0;
  let i = 0;
  while (elapsed < totalMs) {
    for (const step of patterns[i % patterns.length]) {
      steps.push(step);
      elapsed += stepDurationMs(step, speed);
    }
    i++;
  }
  return steps;
}

// Rounds always fill ROUND_MS of real time: slower speeds mean
// fewer, more spaced-out actions — not a longer round.
export function makeRound(def: RoundDef, speed: number): Round {
  return {
    name: def.name,
    description: def.description,
    focus: def.focus,
    speed,
    steps: buildSteps(def.patterns, ROUND_MS, speed),
  };
}

const JAB_ONLY_PATTERNS: RoundStep[][] = [
  [p("jab"), w(1100)],
  [p("jab"), w(800)],
  [p("jab"), w(250), p("jab"), w(1400)],
  [p("jab"), w(1900)],
  [p("jab"), w(250), p("jab"), w(250), p("jab"), w(1600)],
  [p("jab"), w(700)],
  [p("jab"), w(2300)],
];

const STRAIGHTS_PATTERNS: RoundStep[][] = [
  [p("jab"), w(900)],
  [p("jab"), w(250), p("cross"), w(1400)],
  [p("cross"), w(1100)],
  [p("jab"), w(250), p("jab"), w(250), p("cross"), w(1800)],
  [p("cross"), w(300), p("jab"), w(1200)],
  [p("jab"), w(2000)],
  [p("jab"), w(250), p("cross"), w(300), p("jab"), w(1500)],
];

const ALL_PUNCHES_PATTERNS: RoundStep[][] = [
  [p("jab"), w(1000)],
  [p("hookL"), w(1300)],
  [p("jab"), w(250), p("cross"), w(1100)],
  [p("hookR"), w(1700)],
  [p("jab"), w(250), p("jab"), w(300), p("hookL"), w(1400)],
  [p("cross"), w(300), p("hookL"), w(250), p("cross"), w(1900)],
  [p("jab"), w(800)],
  [p("hookR"), w(300), p("hookL"), w(2100)],
];

const PADS_BASICS_PATTERNS: RoundStep[][] = [
  [c("jab"), w(1300)],
  [c("jab", "cross"), w(1600)],
  [c("cross"), w(1200)],
  [c("jab", "jab", "cross"), w(1900)],
  [c("jab", "cross"), w(1000)],
  [c("jab"), w(900)],
  [c("jab", "cross"), w(2200)],
];

const PADS_HOOKS_PATTERNS: RoundStep[][] = [
  [c("jab", "cross", "hookL"), w(1900)],
  [c("hookL"), w(1300)],
  [c("hookR"), w(1400)],
  [c("cross", "hookL"), w(1500)],
  [c("jab", "cross", "hookL", "hookR"), w(2300)],
  [c("hookL", "cross"), w(1600)],
  [c("jab", "jab", "hookR"), w(1800)],
];

const PADS_COUNTERS_PATTERNS: RoundStep[][] = [
  [c("jab", "pullBack", "cross"), w(1800)],
  [c("jab", "cross", "slipLeft", "hookL"), w(2100)],
  [c("slipRight", "cross"), w(1400)],
  [c("cross", "roll", "cross"), w(1700)],
  [c("jab", "block", "jab", "cross"), w(2000)],
  [c("jab", "pullBack", "jab", "cross"), w(2200)],
  [c("cross", "hookL", "roll", "hookR"), w(2300)],
  [c("block", "cross", "hookL"), w(1900)],
];

const FOOTWORK_PATTERNS: RoundStep[][] = [
  [f("stepLeft"), w(700)],
  [f("stepRight"), w(700)],
  [f("stepForward"), w(900)],
  [f("stepBack"), w(600)],
  [f("pivotLeft"), w(1100)],
  [f("stepLeft"), w(400), f("stepLeft"), w(900)],
  [f("stepBack"), w(500), f("stepForward"), w(1000)],
  [f("pivotRight"), w(1100)],
  [f("stepRight"), w(400), f("stepForward"), w(800)],
];

export const ROUND_DEFS: RoundDef[] = [
  {
    name: "Jab only",
    description: "Read the lead hand. Nothing else is coming.",
    focus: "reaction",
    patterns: JAB_ONLY_PATTERNS,
  },
  {
    name: "Straights",
    description: "Jabs and crosses. Watch which hand fires.",
    focus: "reaction",
    patterns: STRAIGHTS_PATTERNS,
  },
  {
    name: "All punches",
    description: "Straights and hooks, mixed. Stay alert.",
    focus: "reaction",
    patterns: ALL_PUNCHES_PATTERNS,
  },
  {
    name: "Pads: basics",
    description: "He calls 1s and 2s. Hit the mitt he shows.",
    focus: "pads",
    patterns: PADS_BASICS_PATTERNS,
  },
  {
    name: "Pads: hooks in",
    description: "Adds 3s and 4s. Longer combos, stay sharp.",
    focus: "pads",
    patterns: PADS_HOOKS_PATTERNS,
  },
  {
    name: "Pads: counters",
    description: "Defend on his call, then fire the counter.",
    focus: "pads",
    patterns: PADS_COUNTERS_PATTERNS,
  },
  {
    name: "Footwork",
    description: "Steps and pivots on his call. Keep moving.",
    focus: "footwork",
    patterns: FOOTWORK_PATTERNS,
  },
];
