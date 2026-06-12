import type { Punch } from "./rounds";
import { PUNCH_MS } from "./useRoundPlayer";

const PUNCH_CLASS: Record<Punch, string> = {
  jab: "punch-jab",
  cross: "punch-cross",
  hookL: "punch-hook-l",
  hookR: "punch-hook-r",
};

export default function PunchOverlay({ punch, speed = 1 }: { punch: Punch; speed?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className={`h-[55vmin] w-[55vmin] ${PUNCH_CLASS[punch]}`}
        style={{ animationDuration: `${PUNCH_MS / speed}ms` }}
        aria-hidden="true"
      >
        <circle cx="50" cy="46" r="34" fill="#dc2626" />
        <rect x="34" y="76" width="32" height="16" rx="6" fill="#b91c1c" />
        <path d="M30 36 A 24 24 0 0 1 50 16" stroke="#fca5a5" strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
