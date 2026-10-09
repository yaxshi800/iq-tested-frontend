import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain, Hash, BookOpen, Languages, BookMarked, GraduationCap,
  ArrowRight, Sparkles, Crown, Bot, Clock, Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import StreakBadge from "../components/StreakBadge";
import api from "../api/client";

const KEEP_CATEGORIES = ["iq", "math", "english", "native", "russian", "teacher"];

const ICONS = {
  Brain: Brain,
  Hash: Hash,
  BookOpen: BookOpen,
  Languages: Languages,
  BookMarked: BookMarked,
  GraduationCap: GraduationCap,
};

export default function Landing() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/test/categories/")
      .then((r) => {
        const filtered = r.data.filter((cat) =>
          KEEP_CATEGORIES.includes(cat.code)
        );
        setCategories(filtered);
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <StreakBadge />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-2xl shadow-indigo-500/40">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-gradient mx-auto max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            {t("landing.hero_title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-400">
            {t("landing.hero_subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/ai-advisor"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              <Bot className="h-5 w-5" />
              AI Yordamchi
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Test turlari */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
          Test turlari
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Rasmlar O'yini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Link
              to="/images"
              className="glass group block h-full rounded-3xl p-6 transition hover:border-pink-400/40 hover:shadow-2xl hover:shadow-pink-500/20"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-500">
                <ImageIcon className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Rasmlar O'yini
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Bolalar uchun — farqli rasmni toping
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  20 savol
                </div>
                <span className="flex items-center gap-1 text-sm font-medium text-pink-600 dark:text-pink-400">
                  Boshlash
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Boshqa testlar */}
          {categories.map((cat, idx) => {
            const Icon = ICONS[cat.icon] || Brain;
            const isTeacher = cat.code === "teacher";
            const questionCount = isTeacher ? 20 : 30;
            return (
              <motion.div
                key={cat.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx + 1) * 0.08 }}
              >
                <Link
                  to={`/test/${cat.code}`}
                  className="glass group block h-full rounded-3xl p-6 transition hover:border-indigo-400/40 hover:shadow-2xl hover:shadow-indigo-500/20"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-${cat.color}-500/20 text-${cat.color}-500`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {cat.name_uz}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {cat.description_uz}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {questionCount} savol
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      Boshlash
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* AI Advisor CTA */}
      <section className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-8"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
              <Bot className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Yordamchi
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Imtihon (IELTS, CEFR, SAT) yoki kasb haqida so'rang — AI sizga
                maslahat, kitoblar va YouTube kanallarini topib beradi.
              </p>
            </div>
            <Link
              to="/ai-advisor"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              Boshlash
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Tarif CTA */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 text-center backdrop-blur-xl"
        >
          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
              <Crown className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
              Pro yoki Ultimate tarifga o‘ting
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Sertifikat olish va batafsil statistika uchun Pro tarifga o‘ting.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30"
              >
                <Crown className="h-4 w-4" />
                Tariflarni ko‘rish
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-xs text-slate-500 dark:border-white/5">
        © {new Date().getFullYear()} {t("app.title")} — {t("app.tagline")}
      </footer>
    </div>
  );
}