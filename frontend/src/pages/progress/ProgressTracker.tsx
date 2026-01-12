import { useEffect, useState } from "react";
import { Flame, Award, Clock, Calendar } from "lucide-react";

import StatBadge from "@/components/progress/StatBadge";
import PeriodToggle from "@/components/progress/PeriodToggle";
import AchievementCard from "@/components/progress/AchievementCard";

import { getProgressMetrics, getProgressBadges } from "@/services/progressService";
import { ProgressMetrics, BadgeData } from "@/types/progress";
import { formatStudyTime } from "@/utils/progressUtils";
import { THEME_GRADIENTS } from "@/constants/theme";

const ProgressTracker = () => {
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, b] = await Promise.all([
          getProgressMetrics(),
          getProgressBadges()
        ]);
        setMetrics(m);
        setBadges(b);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="px-6 py-6">Loading progress…</div>;
  }

  if (!metrics) {
    return <div className="px-6 py-6">No progress data</div>;
  }

  // ---- Period calculation ----
  const now = new Date();
  const entries = Object.entries(
    metrics.dailyStudyMinutes
  ) as [string, number][];

  const periodMinutes = entries
    .filter(([date]) => {
      const d = new Date(date);
      if (period === "day")
        return d.toDateString() === now.toDateString();
      if (period === "week")
        return (now.getTime() - d.getTime()) / 86400000 <= 7;
      return d.getMonth() === now.getMonth();
    })
    .reduce((sum, [, minutes]) => sum + minutes, 0);

  return (
    /* 🔑 OUTER WRAPPER — sticks to sidebar */
    <div className="px-6 py-4 w-full">
      {/* 🔑 DASHBOARD-LIKE SURFACE */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-8">

        {/* 🔥 HERO (like dashboard welcome card) */}
        <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-semibold">Progress Tracker</h1>
          <p className="text-sm opacity-90 mt-1">
            Track your consistency, study time, and achievements
          </p>
        </div>

        {/* 📊 OVERVIEW HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Overview
          </h2>
          <PeriodToggle value={period} onChange={setPeriod} />
        </div>

        {/* 🏷️ STAT BADGES — tight grid like dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBadge
            title="Current Streak"
            value={`${metrics.currentStreak}d`}
            subtitle="Study today to continue"
            icon={<Flame />}
            gradient={THEME_GRADIENTS.primary}
          />

          <StatBadge
            title="Longest Streak"
            value={`${metrics.longestStreak}d`}
            subtitle="Best achievement"
            icon={<Award />}
            gradient={THEME_GRADIENTS.accent}
          />

          <StatBadge
            title="Total Hours"
            value={Math.floor(metrics.totalStudyMinutes / 60)}
            subtitle="All sessions"
            icon={<Clock />}
            gradient={THEME_GRADIENTS.secondary}
          />

          <StatBadge
            title={
              period === "day"
                ? "Today"
                : period === "week"
                ? "This Week"
                : "This Month"
            }
            value={formatStudyTime(periodMinutes)}
            subtitle="Study time"
            icon={<Calendar />}
            gradient={THEME_GRADIENTS.soft}
          />
        </div>

        {/* 🏆 ACHIEVEMENTS — dashboard-style card */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">
            Achievements
          </h2>

          {badges.length === 0 ? (
            <p className="text-sm text-gray-500">
              No achievements unlocked yet. Start studying!
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {badges.map(b => (
                <AchievementCard key={b.id} badge={b} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProgressTracker;
