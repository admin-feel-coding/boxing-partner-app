"use client";

import { useEffect, useState } from "react";
import CommandBanner from "./CommandBanner";
import Opponent from "./Opponent";
import PunchOverlay from "./PunchOverlay";
import Ring from "./Ring";
import { makeRound, ROUND_DEFS, type Round, type RoundFocus } from "./rounds";
import { cancelSpeech, commandSpeech, speak } from "./speech";
import { useRoundPlayer } from "./useRoundPlayer";

const FOCUS_LABEL: Record<RoundFocus, string> = {
  reaction: "Reaction",
  pads: "Pads",
  footwork: "Footwork",
};
const FOCUSES: RoundFocus[] = ["reaction", "pads", "footwork"];
const SPEEDS = [0.5, 0.75, 1, 1.25];

function formatClock(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Home() {
  const [round, setRound] = useState<Round | null>(null);
  const [speed, setSpeed] = useState(1);
  const { active, remainingSec, paused, togglePause } = useRoundPlayer(
    round,
    () => setRound(null),
  );

  useEffect(() => {
    if (active?.type === "command") speak(commandSpeech(active.command));
  }, [active]);

  useEffect(() => {
    if (paused || !round) cancelSpeech();
  }, [paused, round]);

  const mitts =
    active?.type === "command" && active.command.kind === "combo"
      ? active.command.calls
      : null;

  return (
    <main className="relative flex flex-1 items-end justify-center overflow-hidden bg-zinc-900">
      <Ring />
      <div className="relative mb-[9vh]">
        <Opponent
          punch={active?.type === "punch" ? active.punch : null}
          mitts={mitts}
          mittsKey={active?.id}
          speed={round?.speed}
        />
      </div>
      {active?.type === "punch" && round && (
        <PunchOverlay key={active.id} punch={active.punch} speed={round.speed} />
      )}
      {active?.type === "command" && (
        <CommandBanner key={active.id} command={active.command} />
      )}

      {round && (
        <div className="absolute inset-x-0 top-3 z-20 flex justify-center px-3 sm:top-4">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-950/70 px-4 py-2 sm:gap-5 sm:px-6 sm:py-3">
            <span className="text-xs font-medium text-zinc-400 sm:text-sm">
              {round.name}
              {round.speed !== 1 && ` · ${round.speed}x`}
            </span>
            <span className="font-mono text-2xl font-semibold tabular-nums text-zinc-50 sm:text-3xl">
              {formatClock(remainingSec)}
            </span>
            <button
              onClick={togglePause}
              className="w-20 rounded-lg bg-zinc-100 px-3 py-1.5 font-medium text-zinc-900 transition-colors hover:bg-white sm:w-24 sm:px-4 sm:py-2"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={() => setRound(null)}
              className="rounded-lg bg-red-600 px-3 py-1.5 font-medium text-zinc-50 transition-colors hover:bg-red-500 sm:px-4 sm:py-2"
            >
              End
            </button>
          </div>
        </div>
      )}

      {!round && (
        <div className="absolute inset-0 z-20 flex overflow-y-auto bg-zinc-950/70 p-6">
          <div className="m-auto flex flex-col items-center gap-6 sm:gap-8">
          <h1 className="text-2xl font-semibold text-zinc-50">Pick a round</h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Speed
            </span>
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`rounded-full px-4 py-1.5 font-medium transition-colors ${
                  s === speed
                    ? "bg-zinc-100 text-zinc-900"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {FOCUSES.map((focus) => (
              <div key={focus} className="flex flex-col gap-3">
                <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-zinc-400">
                  {FOCUS_LABEL[focus]}
                </h2>
                {ROUND_DEFS.filter((r) => r.focus === focus).map((r) => (
                  <button
                    key={r.name}
                    onClick={() => setRound(makeRound(r, speed))}
                    className="w-64 rounded-lg bg-zinc-100 px-4 py-3 text-left transition-colors hover:bg-white"
                  >
                    <div className="font-medium text-zinc-900">{r.name}</div>
                    <div className="text-sm text-zinc-600">{r.description}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
          </div>
        </div>
      )}
    </main>
  );
}
