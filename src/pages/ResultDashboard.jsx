import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, RotateCcw, Share2 } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceDot, CartesianGrid,
} from "recharts";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer as RC2,
} from "recharts";
import { getResults } from "../api/client";
import LanguageSwitcher from "../components/LanguageSwitcher";

/* --- Build a bell curve dataset (μ=100, σ=15) --- */
function buildBellCurve() {
  const data = [];
  for (let x = 55; x <= 145; x += 2) {
    const y = (1 / (15 * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - 100) / 15, 2));
    data.push({ x, y: +(y * 1000).toFixed(3) });
  }
  return data;
}

export default function ResultDashboard() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResults(uuid).then(setData).catch(setError);
  }, [uuid]);

  if (error) return <div className="p-10 text-rose-400">Error: {error.message}</div>;
  if (!data) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
      <div className="animate-pulse">Loading…</div>
    </div>
  );

  const bell = buildBellCurve();
  const catData = Object.entries(data.category_breakdown || {}).map(([k, v]) => ({
    category: t(`landing.domains.${k}`, k),
    score: v.percentage,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <header className="border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold tracking-tight">{t("results.title")}</h1>
          <LanguageSwitcher compact />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        {/* ---- Score reveal ---- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-2 text-sm uppercase tracking-widest text-indigo-300">
                {t("results.iq_label")}
              </div>
              <div className="flex items-end gap-4">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
                  className="bg-gradient-to-br from-white to-indigo-300 bg-clip-text text-8xl font-black leading-none text-transparent"
                >
                  {data.iq_score}
                </motion.span>
                <span className="mb-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                  <Award className="mr-1 inline h-4 w-4" />
                  {t("results.percentile_badge", { value: data.percentile })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat label={t("results.percentile")} value={`${data.percentile}%`} />
              <Stat label={t("results.accuracy")} value={`${Math.round(data.accuracy * 100)}%`} />
              <Stat label={t("results.raw_score")} value={data.raw_score} />
              <Stat
                label={t("results.time_spent")}
                value={`${Math.floor(data.duration_seconds / 60)}m ${data.duration_seconds % 60}s`}
              />
            </div>
          </div>
        </motion.section>

        {/* ---- Bell curve ---- */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-semibold">{t("results.distribution")}</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bell} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#e2e8f0",
                  }}
                  labelFormatter={(v) => `IQ ${v}`}
                />
                <Line
                  type="monotone" dataKey="y" stroke="#818cf8" strokeWidth={2.5}
                  dot={false} fill="url(#g)" />
                <ReferenceDot
                  x={data.iq_score}
                  y={
                    bell.reduce((acc, p) =>
                      Math.abs(p.x - data.iq_score) < Math.abs(acc.x - data.iq_score) ? p : acc
                    ).y
                  }
                  r={7}
                  fill="#f472b6"
                  stroke="#fff"
                  strokeWidth={2}
                  label={{
                    value: t("results.your_position"),
                    position: "top",
                    fill: "#fbcfe8",
                    fontSize: 12,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ---- Radar chart ---- */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-semibold">{t("results.category_performance")}</h2>
          <div className="h-80">
            <RC2 width="100%" height="100%">
              <RadarChart data={catData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Radar
                  name="Score" dataKey="score"
                  stroke="#818cf8" fill="#6366f1" fillOpacity={0.45}
                />
              </RadarChart>
            </RC2>
          </div>
        </section>

        {/* ---- Actions ---- */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" /> {t("results.retake")}
          </Link>
          <button
            onClick={() => navigator.share?.({ title: "My IQ", text: `IQ: ${data.iq_score}` })}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-indigo-500/30"
          >
            <Share2 className="h-4 w-4" /> {t("results.share")}
          </button>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-100">{value}</div>
    </div>
  );
}