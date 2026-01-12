"use client";
import { CheckCircle2 } from "lucide-react";
import { BadgeData } from "@/types/progress";


export default function AchievementCard({ badge }: { badge: BadgeData }) {
  return (
    <div className={`p-4 rounded-xl ${badge.unlocked ? "bg-indigo-600 text-white" : "bg-gray-100"}`}>
      <div className="flex justify-between">
        <span className="text-3xl">{badge.icon}</span>
        {badge.unlocked && <CheckCircle2 />}
      </div>
      <h3 className="font-semibold mt-2">{badge.title}</h3>
      <p className="text-sm opacity-80">{badge.description}</p>

      {!badge.unlocked && (
        <div className="mt-2 h-2 bg-gray-300 rounded">
          <div className="h-full bg-indigo-500 rounded" style={{ width: `${badge.progress}%` }} />
        </div>
      )}
    </div>
  );
}
