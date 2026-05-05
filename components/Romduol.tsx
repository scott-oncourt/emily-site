const BUD_LOBES = [
  { cx: 0, cy: -4.6 },
  { cx: 3.984, cy: 2.3 },
  { cx: -3.984, cy: 2.3 },
];

export function Romduol({ size = 32, opacity = 0.75 }: { size?: number; opacity?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, display: "block" }}
      aria-hidden="true"
    >
      <g transform="translate(40,40)">
        {[0, 120, 240].map((deg) => (
          <g key={`outer-${deg}`} transform={`rotate(${deg})`}>
            <path
              d="M 0 -2 C -17 -6 -15 -28 0 -31 C 15 -28 17 -6 0 -2 Z"
              fill="#c9985a"
              opacity="0.95"
            />
            <path
              d="M -1 -5 C -2 -12 -2 -22 -1 -28"
              stroke="#8a6a32"
              strokeWidth="0.5"
              opacity="0.35"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}

        {BUD_LOBES.map((p, i) => (
          <circle
            key={`bud-${i}`}
            cx={p.cx}
            cy={p.cy}
            r="5.5"
            fill="#c9985a"
            opacity="1"
          />
        ))}

        {[60, 180, 300].map((deg) => (
          <line
            key={`seam-${deg}`}
            x1="0"
            y1="0.2"
            x2="0"
            y2="-5.5"
            stroke="#5a3618"
            strokeWidth="0.85"
            opacity="0.85"
            strokeLinecap="round"
            transform={`rotate(${deg})`}
          />
        ))}

        <circle cx="0" cy="0" r="1" fill="#5a3618" opacity="0.9" />
      </g>
    </svg>
  );
}

export function RomduolDivider() {
  return (
    <div className="flex items-center gap-4 py-10 max-w-xs mx-auto px-7">
      <div className="flex-1 h-px bg-rule" />
      <Romduol size={22} opacity={0.7} />
      <div className="flex-1 h-px bg-rule" />
    </div>
  );
}
