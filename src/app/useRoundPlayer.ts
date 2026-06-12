"use client";

import { useEffect, useRef, useState } from "react";
import type { Command, Punch, Round } from "./rounds";
import { stepDurationMs } from "./rounds";

// Must match the punch animation durations in globals.css.
export const PUNCH_MS = 500;

export type ActiveEvent =
  | { type: "punch"; punch: Punch; id: number }
  | { type: "command"; command: Command; id: number };

type TimelineEvent = {
  startMs: number;
  activeMs: number;
  make: (id: number) => ActiveEvent;
};

function roundTotalMs(round: Round) {
  let total = 0;
  for (const step of round.steps) total += stepDurationMs(step, round.speed);
  return total;
}

export function useRoundPlayer(round: Round | null, onDone: () => void) {
  const [active, setActive] = useState<ActiveEvent | null>(null);
  const [remainingSec, setRemainingSec] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  // Reset player state in the same render the round changes,
  // so the clock never flashes 0:00 and no stale punch lingers.
  const [lastRound, setLastRound] = useState<Round | null>(null);
  if (round !== lastRound) {
    setLastRound(round);
    setRemainingSec(round ? Math.ceil(roundTotalMs(round) / 1000) : 0);
    setActive(null);
    setPaused(false);
  }

  useEffect(() => {
    pausedRef.current = false;
    if (!round) return;

    const events: TimelineEvent[] = [];
    let t = 0;
    for (const step of round.steps) {
      const dur = stepDurationMs(step, round.speed);
      if ("punch" in step) {
        const { punch } = step;
        events.push({
          startMs: t,
          activeMs: PUNCH_MS / round.speed,
          make: (id) => ({ type: "punch", punch, id }),
        });
      } else if ("command" in step) {
        const { command } = step;
        events.push({
          startMs: t,
          activeMs: dur,
          make: (id) => ({ type: "command", command, id }),
        });
      }
      t += dur;
    }
    const totalMs = t;

    let elapsed = 0;
    let last = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      if (!pausedRef.current) elapsed += now - last;
      last = now;

      if (elapsed >= totalMs) {
        clearInterval(interval);
        setActive(null);
        setRemainingSec(0);
        onDoneRef.current();
        return;
      }

      setRemainingSec(Math.ceil((totalMs - elapsed) / 1000));
      const idx = events.findIndex(
        (e) => e.startMs <= elapsed && elapsed < e.startMs + e.activeMs,
      );
      setActive((prev) => {
        if (idx < 0) return prev === null ? prev : null;
        return prev?.id === idx ? prev : events[idx].make(idx);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [round]);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  return { active, remainingSec, paused, togglePause };
}
