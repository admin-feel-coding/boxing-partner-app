import type { ComboCall, Punch } from "./rounds";
import { comboCallMs, isPunch } from "./rounds";

// The opponent faces the viewer: his left hand (jab, hookL) is the screen-right glove.
// Punch poses are applied in globals.css via [data-punch] transforms.
// Your left-hand punches (1, 3) target his screen-left mitt; right-hand (2, 4) the screen-right.

const isLeftTarget = (p: Punch) => p === "jab" || p === "hookL";

function MittFlashes({
  calls,
  side,
  mittsKey,
  speed,
}: {
  calls: ComboCall[];
  side: "l" | "r";
  mittsKey: number;
  speed: number;
}) {
  const cx = side === "l" ? 52 : 148;
  let delay = 200;
  const flashes: React.ReactNode[] = [];
  calls.forEach((call, i) => {
    if (isPunch(call) && (side === "l") === isLeftTarget(call)) {
      flashes.push(
        <circle
          key={`${mittsKey}-${i}`}
          className="mitt-flash"
          cx={cx}
          cy="72"
          r="21"
          style={{ animationDelay: `${delay / speed}ms` }}
        />,
      );
    }
    delay += comboCallMs(call);
  });
  return flashes;
}

export default function Opponent({
  punch,
  mitts,
  mittsKey = 0,
  speed = 1,
}: {
  punch: Punch | null;
  mitts: ComboCall[] | null;
  mittsKey?: number;
  speed?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 320"
      className="opponent-idle h-[70vh] max-h-[640px]"
      data-punch={punch ?? undefined}
      aria-label="Opponent boxer"
      role="img"
    >
      <g className="opponent-sway">
        <g className="opponent-figure">
          {/* legs */}
          <line x1="86" y1="220" x2="68" y2="302" stroke="#b5764f" strokeWidth="17" strokeLinecap="round" />
          <line x1="114" y1="220" x2="132" y2="302" stroke="#b5764f" strokeWidth="17" strokeLinecap="round" />
          {/* torso */}
          <rect x="66" y="112" width="68" height="104" rx="24" fill="#c68863" />
          {/* shorts */}
          <rect x="64" y="184" width="72" height="42" rx="15" fill="#1f2937" />
          {/* head */}
          <circle cx="100" cy="76" r="24" fill="#d99a70" />
          {/* eyes */}
          <circle cx="91" cy="72" r="2.5" fill="#1f2937" />
          <circle cx="109" cy="72" r="2.5" fill="#1f2937" />
          {/* his right hand (screen left): cross, hookR / left mitt target */}
          <g className="hand hand-screen-l">
            {mitts ? (
              <>
                <line x1="76" y1="128" x2="58" y2="86" stroke="#c68863" strokeWidth="14" strokeLinecap="round" />
                <circle cx="52" cy="72" r="21" fill="#d4a373" stroke="#92400e" strokeWidth="3" />
                <MittFlashes calls={mitts} side="l" mittsKey={mittsKey} speed={speed} />
              </>
            ) : (
              <>
                <line x1="76" y1="128" x2="66" y2="102" stroke="#c68863" strokeWidth="14" strokeLinecap="round" />
                <circle cx="68" cy="94" r="16" fill="#dc2626" />
              </>
            )}
          </g>
          {/* his left hand (screen right): jab, hookL / right mitt target */}
          <g className="hand hand-screen-r">
            {mitts ? (
              <>
                <line x1="124" y1="128" x2="142" y2="86" stroke="#c68863" strokeWidth="14" strokeLinecap="round" />
                <circle cx="148" cy="72" r="21" fill="#d4a373" stroke="#92400e" strokeWidth="3" />
                <MittFlashes calls={mitts} side="r" mittsKey={mittsKey} speed={speed} />
              </>
            ) : (
              <>
                <line x1="124" y1="128" x2="134" y2="102" stroke="#c68863" strokeWidth="14" strokeLinecap="round" />
                <circle cx="132" cy="94" r="16" fill="#dc2626" />
              </>
            )}
          </g>
        </g>
      </g>
    </svg>
  );
}
