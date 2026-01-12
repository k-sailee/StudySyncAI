export const evaluateBadges = async (userId, metrics) => {
  const badges = [];

  if (metrics.currentStreak >= 3) {
    badges.push({
      id: "streak_3",
      title: "Getting Started",
      description: "3 day study streak",
      icon: "🔥",
      tier: "bronze",
      unlocked: true,
      progress: 100,
      unlockedAt: Date.now()
    });
  }

  return badges;
};
