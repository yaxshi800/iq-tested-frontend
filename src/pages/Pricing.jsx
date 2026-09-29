import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Lock } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/client";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "abadiy",
    icon: Star,
    color: "slate",
    description: "Boshlash uchun",
    features: [
      { text: "40 ta savol testi", included: true },
      { text: "Asosiy IQ natijasi", included: true },
      { text: "Kategoriya bo‘yicha tahlil", included: true },
      { text: "Tavsiyalar (kitob/video)", included: true },
      { text: "Sertifikat olish", included: false },
      { text: "Batafsil statistikalar", included: false },
      { text: "PDF hisobot", included: false },
      { text: "Reklama yo‘q", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "49 000",
    period: "so‘m/oy",
    icon: Zap,
    color: "indigo",
    popular: true,
    description: "Jiddiy o‘rganuvchilar uchun",
    features: [
      { text: "40 ta savol testi", included: true },
      { text: "Asosiy IQ natijasi", included: true },
      { text: "Kategoriya bo‘yicha tahlil", included: true },
      { text: "Tavsiyalar (kitob/video)", included: true },
      { text: "✅ Sertifikat olish", included: true },
      { text: "✅ Batafsil statistikalar", included: true },
      { text: "✅ PDF hisobot", included: true },
      { text: "Reklama yo‘q", included: false },
    ],
  },
  {
    id: "ultimate",
    name: "Ultimate",
    price: "149 000",
    period: "so‘m/3 oy",
    icon: Crown,
    color: "amber",
    description: "Maksimal imkoniyatlar",
    features: [
      { text: "40 ta savol testi", included: true },
      { text: "Asosiy IQ natijasi", included: true },
      { text: "Kategoriya bo‘yicha tahlil", included: true },
      { text: "Tavsiyalar (kitob/video)", included: true },
      { text: "✅ Sertifikat olish", included: true },
      { text: "✅ Batafsil statistikalar", included: true },
      { text: "✅ PDF hisobot", included: true },
      { text: "✅ Reklama yo‘q", included: true },
    ],
  },
];

const COLOR_MAP = {
  slate: {
    border: "border-slate-200 dark:border-white/10",
    bg: "bg-white/60 dark:bg-white/5",
    badge: "bg-slate-500/20 text-slate-600 dark:text-slate-300",
  },
  indigo: {
    border: "border-indigo-400/40",
    bg: "bg-indigo-500/10",
    badge: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300",
  },
  amber: {
    border: "border-amber-400/40",
    bg: "bg-amber-500/10",
    badge: "bg-amber-500/20 text-amber-600 dark:text-amber-300",
  },
};

export default function Pricing() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    api
      .get("/auth/me/")
      .then((r) => setProfile(r.data.profile))
      .catch(() => setProfile(null));
  }, []);

  const currentPlan = profile?.plan || "free";
  const planHierarchy = { free: 0, pro: 1, ultimate: 2 };

  const handleSubscribe = (planId) => {
    if (planId === "free") {
      navigate("/home");
      return;
    }

    if (planHierarchy[currentPlan] >= planHierarchy[planId]) {
      alert(`Siz allaqachon ${currentPlan.toUpperCase()} tarifga egasiz.`);
      return;
    }

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate(`/login?redirect=/payment?plan=${planId}`);
      return;
    }

    navigate(`/payment?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient text-4xl font-black md:text-5xl"
          >
            Tarif rejalar
          </motion.h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Sizga mos rejani tanlang. Istalgan vaqtda o‘zgartirish mumkin.
          </p>
        </div>

        {profile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-8 max-w-lg rounded-2xl border border-slate-200 bg-white/60 px-6 py-4 text-center dark:border-white/10 dark:bg-white/5"
          >
            <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Joriy tarifingiz
            </div>
            <div className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
              {currentPlan.toUpperCase()}
              {profile.plan_expires_at && (
                <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                  ({new Date(profile.plan_expires_at).toLocaleDateString("uz-UZ")} gacha)
                </span>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, idx) => {
            const Icon = plan.icon;
            const colors = COLOR_MAP[plan.color];
            const isCurrent = currentPlan === plan.id;
            const isDowngrade =
              planHierarchy[currentPlan] > planHierarchy[plan.id];

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-3xl border ${colors.border} ${colors.bg} p-8 backdrop-blur-xl ${
                  isCurrent ? "ring-2 ring-emerald-400/60" : ""
                }`}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    ENG MASHHUR
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                    ✓ JORIY TARIF
                  </div>
                )}

                <div className="mb-6 text-center">
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.badge}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((f, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-sm ${
                        f.included
                          ? "text-slate-700 dark:text-slate-200"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                      )}
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent || isDowngrade}
                  className={`w-full rounded-xl py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    plan.popular
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30 hover:brightness-110"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {isCurrent
                    ? "Joriy tarif"
                    : isDowngrade
                    ? "Allaqachon faol"
                    : plan.id === "free"
                    ? "Boshlash"
                    : "Obuna bo‘lish"}
                </button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl border border-slate-200 bg-white/60 p-6 dark:border-white/10 dark:bg-white/5"
        >
          <div className="text-center">
            <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Qabul qilinadigan to‘lov usullari
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <CardBadge label="HUMO" color="from-blue-500 to-indigo-500" />
              <CardBadge label="UZCARD" color="from-emerald-500 to-teal-500" />
              <CardBadge label="VISA" color="from-indigo-600 to-violet-600" />
              <CardBadge label="MASTERCARD" color="from-orange-500 to-red-500" />
              <CardBadge label="AMEX" color="from-cyan-500 to-blue-500" />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function CardBadge({ label, color }) {
  return (
    <div
      className={`flex h-10 min-w-[110px] items-center justify-center rounded-lg bg-gradient-to-br ${color} px-4 text-xs font-bold text-white shadow-lg`}
    >
      {label}
    </div>
  );
}