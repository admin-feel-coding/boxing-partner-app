export default function Ring() {
  return (
    <svg
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {/* canvas floor */}
      <polygon points="180,445 820,445 1000,600 0,600" fill="#a1a1aa" />
      {/* far corner posts */}
      <rect x="172" y="235" width="16" height="215" rx="4" fill="#dc2626" />
      <rect x="812" y="235" width="16" height="215" rx="4" fill="#2563eb" />
      {/* far ropes */}
      <line x1="188" y1="265" x2="812" y2="265" stroke="#ef4444" strokeWidth="7" />
      <line x1="188" y1="325" x2="812" y2="325" stroke="#f4f4f5" strokeWidth="7" />
      <line x1="188" y1="385" x2="812" y2="385" stroke="#3b82f6" strokeWidth="7" />
      {/* left side ropes, toward the viewer */}
      <line x1="180" y1="265" x2="0" y2="320" stroke="#ef4444" strokeWidth="9" />
      <line x1="180" y1="325" x2="0" y2="440" stroke="#f4f4f5" strokeWidth="9" />
      <line x1="180" y1="385" x2="0" y2="560" stroke="#3b82f6" strokeWidth="9" />
      {/* right side ropes, toward the viewer */}
      <line x1="820" y1="265" x2="1000" y2="320" stroke="#ef4444" strokeWidth="9" />
      <line x1="820" y1="325" x2="1000" y2="440" stroke="#f4f4f5" strokeWidth="9" />
      <line x1="820" y1="385" x2="1000" y2="560" stroke="#3b82f6" strokeWidth="9" />
      {/* shadow under the opponent */}
      <ellipse cx="500" cy="540" rx="95" ry="14" fill="#18181b" opacity="0.3" />
    </svg>
  );
}
