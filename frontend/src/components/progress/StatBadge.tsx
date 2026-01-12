import { ReactNode } from "react";

interface StatBadgeProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  gradient: string;
}

export default function StatBadge({
  title,
  value,
  subtitle,
  icon,
  gradient
}: StatBadgeProps) {
  return (
    <div
    className={`rounded-2xl p-5 text-white shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br ${gradient}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-xs opacity-80 mt-1">{subtitle}</p>
        </div>
        <div className="text-3xl opacity-90">{icon}</div>
      </div>
    </div>
  );
}
