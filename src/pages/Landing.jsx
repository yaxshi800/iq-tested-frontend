import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain, Clock, Grid3x3, Hash, Layers, ArrowRight, Sparkles,
} from "lucide-react";
import Navbar from "../components/Navbar";

const DOMAIN_META = [
  { key: "pattern",   Icon: Grid3x3 },
  { key: "spatial",   Icon: Layers },
  { key: "numerical", Icon: Hash },
  { key: "abstract",  Icon: Sparkles },
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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-2xl shadow-indigo-500/40">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="mx-auto max-w-3xl bg-gradient-to-br from-white via-slate-100 to-indigo-300 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
            {t("landing.hero_title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 md:text-lg">
            {t("landing.hero_subtitle")}
          </p>

          <Link to="/test" className="btn-primary mt-8 px-8 py-4 text-base">
            {t("landing.begin")}
            <ArrowRight className="h-5 w-5" />
          </Link>
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
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-slate-100">
                {t(`landing.domains.${key}`)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="glass rounded-3xl p-8">
          <h2 className="mb-4 text-2xl font-bold">{t("landing.instructions_title")}</h2>
          <ul className="space-y-3">
            {t("landing.instructions", { returnObjects: true }).map((line, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-indigo-400/40 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
            <Clock className="h-5 w-5 shrink-0" />
            <span>40:00 — auto-submit on timeout.</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {t("app.title")} — {t("app.tagline")}
      </footer>
    </div>
  );
}