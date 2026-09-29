import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, RotateCcw, Share2, Download, Crown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  CartesianGrid,
} from "recharts";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer as RC2,
} from "recharts";
import { getResults } from "../api/client";
import api from "../api/client";
import Navbar from "../components/Navbar";
import Recommendations from "../components/Recommendations";
import FeatureGate from "../components/FeatureGate";

function buildBellCurve() {
  const data = [];
  for (let x = 55; x <= 145; x += 2) {
    const y =
      (1 / (15 * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - 100) / 15, 2));
    data.push({ x, y: +(y * 1000).toFixed(3) });
  }
  return data;
}

export default function ResultDashboard() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getResults(uuid).then(setData).catch(setError);

    const token = localStorage.getItem("access_token");
    if (token) {
      api
        .get("/auth/me/")
        .then((r) => setProfile(r.data.profile))
        .catch(() => {});
    }
  }, [uuid]);

  if (error)
    return <div className="p-10 text-rose-500">Error: {error.message}</div>;

  if (!data)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
        <div className="animate-pulse">Yuklanmoqda…</div>
      </div>
    );

  const bell = buildBellCurve();
  const catData = Object.entries(data.category_breakdown || {}).map(([k, v]) => ({
    category: k,
    score: v.percentage,
  }));

  const userPlan = profile?.plan || "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-gradient text-3xl font-black tracking-tight md:text-4xl">
            {t("results.title")}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sizning kognitiv natijangiz tayyor
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/60 p-10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-2 text-sm uppercase tracking-widest text-indigo-600 dark:text-indigo-300">
                {t("results.iq_label")}
              </div>
              <div className="flex items-end gap-4">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
                  className="text-gradient text-8xl font-black leading-none"
                >
                  {data.iq_score}
                </motion.span>
                <span className="mb-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-600 dark:text-emerald-300">
                  <Award className="mr-1 inline h-4 w-4" />
                  {data.percentile}%
                </span>
              </div>
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {t("results.percentile_badge", { value: data.percentile })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <Stat
                label={t("results.accuracy")}
                value={`${Math.round(data.accuracy * 100)}%`}
              />
              <Stat label={t("results.raw_score")} value={data.raw_score} />
              <Stat
                label={t("results.time_spent")}
                value={`${Math.floor(data.duration_seconds / 60)} daq`}
              />
              <Stat label="Kategoriyalar" value={catData.length} />
            </div>
          </div>
        </motion.section>

        <section className="rounded-3xl border border-slate-200 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            {t("results.distribution")}
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bell}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="x" stroke="#94a3b8" tick={{ fontSize: 12 }} />
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
                  type="monotone"
                  dataKey="y"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={false}
                />
                <ReferenceDot
                  x={data.iq_score}
                  y={
                    bell.reduce((acc, p) =>
                      Math.abs(p.x - data.iq_score) <
                      Math.abs(acc.x - data.iq_score)
                        ? p
                        : acc
                    ).y
                  }
                  r={7}
                  fill="#ec4899"
                  stroke="#fff"
                  strokeWidth={2}
                  label={{
                    value: t("results.your_position"),
                    position: "top",
                    fill: "#ec4899",
                    fontSize: 12,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {catData.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {t("results.category_performance")}
            </h2>
            <div className="h-80">
              <RC2 width="100%" height="100%">
                <RadarChart data={catData}>
                  <PolarGrid stroke="rgba(148,163,184,0.2)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </RC2>
            </div>
          </section>
        )}

        <Recommendations iq={data.iq_score} percentile={data.percentile} />

        <section className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 p-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-3">
            <Crown className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Sertifikat va batafsil hisobot
            </h2>
          </div>

          {profile ? (
            <FeatureGate
              userPlan={userPlan}
              requiredPlan="pro"
              title="Sertifikat olish uchun Pro tarif kerak"
              description="IQ sertifikatingizni yuklab olish, PDF sifatida saqlash va do‘stlaringizga ulashish uchun Pro tarifga o‘ting."
            >
              <div className="flex flex-wrap gap-3">
                <Link to={`/certificate/${uuid}`} className="btn-primary">
                  <Award className="h-4 w-4" />
                  Sertifikatni ko‘rish
                </Link>
                <button onClick={() => window.print()} className="btn-ghost">
                  <Download className="h-4 w-4" />
                  PDF sifatida saqlash
                </button>
              </div>
            </FeatureGate>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Sertifikat olish uchun iltimos, akkauntingizga kiring.
            </div>
          )}
        </section>

        <div className="flex flex-wrap justify-center gap-3 no-print">
          <Link to="/test" className="btn-ghost">
            <RotateCcw className="h-4 w-4" /> {t("results.retake")}
          </Link>
          <button
            onClick={() =>
              navigator.share?.({
                title: "Mening IQ natijam",
                text: `IQ: ${data.iq_score} (${data.percentile}%)`,
              })
            }
            className="btn-primary"
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
    <div className="rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
        {value}
      </div>
    </div>
  );
}