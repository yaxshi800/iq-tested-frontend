import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Award, Sparkles, ChevronRight } from "lucide-react";
import api from "../api/client";

export default function StreakBadge() {
  const navigate = useNavigate();
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
  const hasAny = streak.current_streak > 0 || streak.total_points > 0 || achievements.length > 0;

  if (!hasAny) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate("/achievements")}
      className="group fixed bottom-4 right-4 z-40 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-slate-900/95 to-slate-800/95 px-4 py-3 shadow-2xl backdrop-blur-xl dark:from-slate-900/95 dark:to-slate-800/95"
    >
      <div className="flex items-center gap-3">
        {/* Icons row */}
        <div className="flex items-center gap-2">
          {streak.current_streak > 0 && (
            <div className="flex flex-col items-center">
              <Flame className="h-5 w-5 text-orange-400" />
              <span className="text-[10px] font-bold text-orange-300">
                {streak.current_streak}
              </span>
            </div>
          )}

          {streak.total_points > 0 && (
            <div className="flex flex-col items-center">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="text-[10px] font-bold text-amber-300">
                {streak.total_points}
              </span>
            </div>
          )}

          {achievements.length > 0 && (
            <div className="flex flex-col items-center">
              <Award className="h-5 w-5 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-300">
                {earnedCount}/{achievements.length}
              </span>
            </div>
          )}
        </div>

        {/* Chevron */}
        <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 transition group-hover:opacity-100" />
    </motion.button>
  );
}