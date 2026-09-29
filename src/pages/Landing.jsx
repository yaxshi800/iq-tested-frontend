import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  Clock,
  Grid3x3,
  Hash,
  Layers,
  ArrowRight,
  Sparkles,
  Crown,
  Bot,
} from "lucide-react";
import Navbar from "../components/Navbar";

const DOMAIN_META = [
  { key: "pattern", Icon: Grid3x3 },
  { key: "spatial", Icon: Layers },
  { key: "numerical", Icon: Hash },
  { key: "abstract", Icon: Sparkles },
];

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 text-center md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src="/logo.png"
            alt="CogniTest"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 h-24 w-24 object-contain drop-shadow-2xl"
          />

          <h1 className="text-gradient mx-auto max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            {t("landing.hero_title")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-600 md:text-lg dark:text-slate-400">
            {t("landing.hero_subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/test" className="btn-primary px-8 py-4 text-base">
              {t("landing.begin")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/ai-advisor"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/10 px-8 py-4 text-base font-semibold text-violet-600 transition hover:bg-violet-500/20 dark:text-violet-300"
            >
              <Bot className="h-5 w-5" />
              AI Yordamchi
            </Link>
          </div>
        </motion.div>
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
                Imtihon (IELTS, CEFR, SAT) yoki kasb (Full Stack, Python) haqida
                so'rang — AI sizga maslahat, kitoblar va YouTube kanallarini
                topib beradi.
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

      {/* Domains */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DOMAIN_META.map(({ key, Icon }, idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t(`landing.domains.${key}`)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="glass rounded-3xl p-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">
            {t("landing.instructions_title")}
          </h2>
          <ul className="space-y-3">
            {t("landing.instructions", { returnObjects: true }).map((line, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/10 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-700 dark:text-amber-200">
            <Clock className="h-5 w-5 shrink-0" />
            <span>40:00 — vaqt tugagach avtomatik yuboriladi.</span>
          </div>
        </div>
      </section>

      {/* Tarif CTA */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 text-center backdrop-blur-xl"
        >
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
              <Crown className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
              Pro yoki Ultimate tarifga o‘ting
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Sertifikat olish, batafsil statistika va PDF hisobot uchun Pro
              tarifga o‘ting.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:brightness-110"
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