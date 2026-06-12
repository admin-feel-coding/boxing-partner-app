import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Boxing Partner — reaction, pads, and footwork rounds";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: "#18181b",
        }}
      >
        <svg viewBox="0 0 100 100" width="260" height="260">
          <circle cx="50" cy="46" r="34" fill="#dc2626" />
          <rect x="34" y="76" width="32" height="16" rx="6" fill="#b91c1c" />
          <path
            d="M30 36 A 24 24 0 0 1 50 16"
            stroke="#fca5a5"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ fontSize: 84, fontWeight: 700, color: "#fafafa" }}>
          Boxing Partner
        </div>
        <div style={{ fontSize: 36, color: "#a1a1aa" }}>
          Reaction · Pads · Footwork — 3-minute rounds
        </div>
      </div>
    ),
    size,
  );
}
