"use client";

interface Props {
  value: number;
  max: number;
  label: string;
  color?: string;
}

export default function ProgressRing({ value, max, label, color = "#6366f1" }: Props) {
  const percent = Math.min((value / max) * 100, 100);
  const r = 45;
  const c = 2 * Math.PI * r;

  return (
    <div className="text-center">
      <svg width={120} height={120} className="-rotate-90 mx-auto">
        <circle cx="60" cy="60" r={r} stroke="#e5e7eb" strokeWidth="8" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={r}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (percent / 100) * c}
          strokeLinecap="round"
        />
      </svg>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
