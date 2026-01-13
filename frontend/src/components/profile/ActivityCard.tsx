export default function ActivityCard({ metrics }: any) {
  const lastActiveDate = Object.keys(
    metrics.dailyStudyMinutes || {}
  ).pop();

  return (
    <div className="card">
      <h3>Activity</h3>

      <p>
        Study Streak:{" "}
        <strong>{metrics.currentStreak} days 🔥</strong>
      </p>

      <p>
        Total Study Time:{" "}
        <strong>
          {Math.floor(metrics.totalStudyMinutes / 60)} hrs
        </strong>
      </p>

      <p>
        Last Active:{" "}
        <strong>{lastActiveDate || "—"}</strong>
      </p>
    </div>
  );
}
