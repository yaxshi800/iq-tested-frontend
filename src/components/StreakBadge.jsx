import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Award, Sparkles } from "lucide-react";
import api from "../api/client";

export default function StreakBadge() {
  const [streak, setStreak] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    api.get("/auth/streak/").then((r) => setStreak(r.data)).catch(() => {});
    api.get("/auth/achievements/").then((r) => setAchievements(r.data)).catch(() => {});
  }, []);

  if (!streak) return null;

  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      {/* Streak */}
      {streak.current_streak > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/20 to-red-500/20 px-4 py-2 backdrop-blur-xl shadow-lg"
        >
          <Flame className="h-5 w-5 text-orange-500" />
          <div>
            <div className="text-sm font-bold text-orange-600 dark:text-orange-300">
              {streak.current_streak} kun
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Streak
            </div>
          </div>
        </motion.div>
      )}

      {/* Points */}
      {streak.total_points > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 px-4 py-2 backdrop-blur-xl shadow-lg"
        >
          <Sparkles className="h-5 w-5 text-amber-500" />
          <div>
            <div className="text-sm font-bold text-amber-600 dark:text-amber-300">
              {streak.total_points}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ball
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 rounded-2xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 px-4 py-2 backdrop-blur-xl shadow-lg"
        >
          <Award className="h-5 w-5 text-indigo-500" />
          <div>
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-300">
              {earnedCount} / {achievements.length}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Yutuq
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}