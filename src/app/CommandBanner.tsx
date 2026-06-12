import type { Command, Defense, FootworkMove, Punch } from "./rounds";
import { isPunch } from "./rounds";

const PUNCH_NUM: Record<Punch, string> = {
  jab: "1",
  cross: "2",
  hookL: "3",
  hookR: "4",
};

const PUNCH_NAME: Record<Punch, string> = {
  jab: "jab",
  cross: "cross",
  hookL: "left hook",
  hookR: "right hook",
};

const DEFENSE_SHORT: Record<Defense, string> = {
  pullBack: "PULL",
  slipLeft: "SLIP L",
  slipRight: "SLIP R",
  roll: "ROLL",
  block: "BLOCK",
};

const DEFENSE_NAME: Record<Defense, string> = {
  pullBack: "pull back",
  slipLeft: "slip left",
  slipRight: "slip right",
  roll: "roll under",
  block: "block",
};

const FOOTWORK: Record<FootworkMove, { arrow: string; label: string }> = {
  stepLeft: { arrow: "←", label: "step left" },
  stepRight: { arrow: "→", label: "step right" },
  stepForward: { arrow: "↑", label: "step forward" },
  stepBack: { arrow: "↓", label: "step back" },
  pivotLeft: { arrow: "⟲", label: "pivot left" },
  pivotRight: { arrow: "⟳", label: "pivot right" },
};

export default function CommandBanner({ command }: { command: Command }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[14vh] z-10 flex justify-center">
      <div className="command-pop rounded-2xl bg-zinc-950/70 px-10 py-4 text-center">
        {command.kind === "combo" ? (
          <>
            <div className="text-8xl font-bold text-zinc-50 drop-shadow-lg">
              {command.calls.map((call, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-zinc-500">-</span>}
                  {isPunch(call) ? (
                    PUNCH_NUM[call]
                  ) : (
                    <span className="text-5xl font-semibold text-zinc-400">
                      {DEFENSE_SHORT[call]}
                    </span>
                  )}
                </span>
              ))}
            </div>
            <div className="mt-1 text-2xl text-zinc-300">
              {command.calls
                .map((call) => (isPunch(call) ? PUNCH_NAME[call] : DEFENSE_NAME[call]))
                .join(" · ")}
            </div>
          </>
        ) : (
          <>
            <div className="text-8xl font-bold text-zinc-50 drop-shadow-lg">
              {FOOTWORK[command.move].arrow}
            </div>
            <div className="mt-1 text-3xl font-semibold uppercase tracking-wide text-zinc-200">
              {FOOTWORK[command.move].label}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
