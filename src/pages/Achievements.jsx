import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Sparkles,
  Award,
  Trophy,
  Target,
  Crown,
  Lock,
  CheckCircle2,
  TrendingUp,
  Star,
  Zap,
  BookOpen,
  Play,
  Brain,
  Shield,
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

// Icon mapping
const ICONS = {
  Play: Play,
  Trophy: Trophy,
  Brain: Brain,
  Flame: Flame,
  Award: Award,
  BookOpen: BookOpen,
  Star: Star,
  Shield: Shield,
  Target: Target,
  Crown: Crown,
  Zap: Zap,
};

// Color classes
const COLOR_MAP = {
  indigo: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-500",
    border: "border-indigo-400/30",
    gradient: "from-indigo-500 to-violet-500",
  },
  amber: {
    bg: "bg-amber-500/20",
    text: "text-amber-500",
    border: "border-amber-400/30",
    gradient: "from-amber-500 to-orange-500",
  },
  violet: {
    bg: "bg-violet-500/20",
    text: "text-violet-500",
    border: "border-violet-400/30",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  rose: {
    bg: "bg-rose-500/20",
    text: "text-rose-500",
    border: "border-rose-400/30",
    gradient: "from-rose-500 to-pink-500",
  },
  emerald: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-500",
    border: "border-emerald-400/30",
    gradient: "from-emerald-500 to-teal-500",
  },
  cyan: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-500",
    border: "border-cyan-400/30",
    gradient: "from-cyan-500 to-blue-500",
  },
};

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/auth/achievements/").catch(() => ({ data: [] })),
      api.get("/auth/streak/").catch(() => ({ data: null })),
      api.get("/auth/me/").catch(() => ({ data: null })),
    ])
      .then(([achRes, streakRes, meRes]) => {
        setAchievements(achRes.data || []);
        setStreak(streakRes.data);
        setProfile(meRes.data?.profile || null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse text-slate-600 dark:text-slate-300">
          Yuklanmoqda…
        </div>
      </div>
    );
  }

  const earned = achievements.filter((a) => a.earned);
  const locked = achievements.filter((a) => !a.earned);
  const totalPoints = streak?.total_points || 0;
  const maxPoints = achievements.reduce((sum, a) => sum + (a.points || 0), 0);
  const progress = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  const completionRate =
    achievements.length > 0
      ? Math.round((earned.length / achievements.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* Orqaga */}
        <Link
          to="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Bosh sahifaga qaytish
        </Link>

        {/* Sarlavha */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-2xl shadow-amber-500/40">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white md:text-4xl">
            Yutuqlaringiz
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Har bir testda yangi yutuqlar qozonasiz
          </p>
        </motion.div>

        {/* Statistika */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-orange-400/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <Flame className="h-8 w-8 text-orange-500" />
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-600 dark:text-orange-300">
                STREAK
              </span>
            </div>
            <div className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
              {streak?.current_streak || 0}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              kunlik ketma-ketlik
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-3.5 w-3.5" />
              Eng uzun: {streak?.longest_streak || 0} kun
            </div>
          </motion.div>

          {/* Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="h-8 w-8 text-amber-500" />
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-300">
                BALL
              </span>
            </div>
            <div className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
              {totalPoints}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              to'plangan ball
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Umumiy</span>
                <span>
                  {totalPoints} / {maxPoints}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-indigo-400/30 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <Award className="h-8 w-8 text-indigo-500" />
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                YUTUQLAR
              </span>
            </div>
            <div className="mt-4 text-4xl font-black text-slate-900 dark:text-white">
              {earned.length}
              <span className="text-2xl text-slate-400 dark:text-slate-500">
                {" "}
                / {achievements.length}
              </span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              yutuq qozonildi
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Tugallangan</span>
                <span>{completionRate}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Qozonilgan yutuqlar */}
        {earned.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Qozonilgan ({earned.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {earned.map((a, idx) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  delay={idx * 0.05}
                  earned={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Qulflangan yutuqlar */}
        {locked.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <Lock className="h-5 w-5 text-slate-400" />
              Qulflangan ({locked.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locked.map((a, idx) => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  delay={idx * 0.05}
                  earned={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Bo'sh holat */}
        {achievements.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-12 text-center dark:border-white/10 dark:bg-white/5">
            <Award className="mx-auto mb-4 h-16 w-16 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Yutuqlar yo'q
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Testni boshlang va birinchi yutuqingizni qozoning
            </p>
            <Link to="/home" className="btn-primary mt-6">
              <Target className="h-4 w-4" />
              Testni boshlash
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function AchievementCard({ achievement, delay, earned }) {
  const Icon = ICONS[achievement.icon] || Award;
  const colors = COLOR_MAP[achievement.color] || COLOR_MAP.amber;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition ${
        earned
          ? `${colors.border} ${colors.bg}`
          : "border-slate-200 bg-white/40 opacity-60 dark:border-white/10 dark:bg-white/5"
      }`}
    >
      {/* Icon */}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            earned ? `bg-gradient-to-br ${colors.gradient} shadow-lg` : "bg-slate-300/50 dark:bg-white/10"
          }`}
        >
          <Icon
            className={`h-7 w-7 ${earned ? "text-white" : "text-slate-500"}`}
          />
        </div>

        {earned && (
          <div className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            +{achievement.points}
          </div>
        )}
        {!earned && <Lock className="h-5 w-5 text-slate-400" />}
      </div>

      {/* Info */}
      <h3
        className={`mt-4 text-lg font-bold ${
          earned
            ? "text-slate-900 dark:text-white"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {achievement.name_uz}
      </h3>
      <p
        className={`mt-1 text-sm ${
          earned
            ? "text-slate-600 dark:text-slate-300"
            : "text-slate-400 dark:text-slate-500"
        }`}
      >
        {achievement.description_uz}
      </p>

      {/* Ball */}
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <Sparkles
          className={`h-3.5 w-3.5 ${earned ? "text-amber-500" : "text-slate-400"}`}
        />
        <span
          className={
            earned
              ? "font-bold text-amber-600 dark:text-amber-300"
              : "text-slate-400"
          }
        >
          {achievement.points} ball
        </span>
      </div>

      {/* Background decoration */}
      {earned && (
        <div
          className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${colors.gradient} opacity-20 blur-2xl`}
        />
      )}
    </motion.div>
  );
}