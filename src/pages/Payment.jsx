import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  Lock,
  Check,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import api from "../api/client";
import Navbar from "../components/Navbar";

// Narxlar — backend bilan bir xil bo‘lishi kerak
const PLAN_INFO = {
  pro: {
    name: "Pro",
    amount: 49000,
    days: 30,
    period: "1 oy",
    features: [
      "Sertifikat olish",
      "Batafsil statistikalar",
      "PDF hisobot",
    ],
  },
  ultimate: {
    name: "Ultimate",
    amount: 149000,
    days: 90,
    period: "3 oy",
    features: [
      "Barcha Pro imkoniyatlari",
      "Reklama yo‘q",
      "Ustuvor qo‘llab-quvvatlash",
    ],
  },
};

/**
 * Karta raqamidan turini aniqlash (BIN prefiksi asosida).
 */
function detectCardType(number) {
  const num = number.replace(/\D/g, "");

  if (!num) return { type: "unknown", label: "KARTA", color: "slate" };

  // Uzcard
  if (num.startsWith("8600") || num.startsWith("5614"))
    return { type: "uzcard", label: "UZCARD", color: "emerald" };

  // Humo
  if (num.startsWith("9860"))
    return { type: "humo", label: "HUMO", color: "blue" };

  // Visa
  if (num.startsWith("4"))
    return { type: "visa", label: "VISA", color: "indigo" };

  // Mastercard
  if (["51", "52", "53", "54", "55"].includes(num.slice(0, 2)))
    return { type: "mastercard", label: "MASTERCARD", color: "orange" };
  if (num.length >= 4 && 2221 <= parseInt(num.slice(0, 4)) <= 2720)
    return { type: "mastercard", label: "MASTERCARD", color: "orange" };

  // Amex
  if (num.startsWith("34") || num.startsWith("37"))
    return { type: "amex", label: "AMEX", color: "cyan" };

  return { type: "unknown", label: "KARTA", color: "slate" };
}

function formatCardNumber(value) {
  const num = value.replace(/\D/g, "").slice(0, 19);
  return num.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const num = value.replace(/\D/g, "").slice(0, 4);
  if (num.length <= 2) return num;
  return num.slice(0, 2) + "/" + num.slice(2);
}

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan") || "pro";
  const plan = PLAN_INFO[planId] || PLAN_INFO.pro;

  const [form, setForm] = useState({
    card_number: "",
    card_holder: "",
    card_expiry: "",
    card_cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const cardInfo = useMemo(
    () => detectCardType(form.card_number),
    [form.card_number]
  );

  // Login tekshiruvi
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate(`/login?redirect=/payment?plan=${planId}`);
    }
  }, [navigate, planId]);

  const handleChange = (field, value) => {
    if (field === "card_number") value = formatCardNumber(value);
    if (field === "card_expiry") value = formatExpiry(value);
    if (field === "card_cvv") value = value.replace(/\D/g, "").slice(0, 4);
    setForm((f) => ({ ...f, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validatsiya
    const digits = form.card_number.replace(/\s/g, "");
    if (digits.length < 13) {
      setError("Karta raqami to‘liq emas.");
      return;
    }
    if (!form.card_holder.trim()) {
      setError("Karta egasi ismini kiriting.");
      return;
    }
    if (form.card_expiry.length !== 5) {
      setError("Muddat noto‘g‘ri (MM/YY).");
      return;
    }
    if (form.card_cvv.length < 3) {
      setError("CVV noto‘g‘ri.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/payment/", {
        plan: planId,
        card_number: digits,
        card_holder: form.card_holder,
        card_expiry: form.card_expiry,
        card_cvv: form.card_cvv,
      });

      setSuccess(true);
      setTimeout(() => navigate("/home"), 2500);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "To‘lov amalga oshmadi. Kartani tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Muvaffaqiyat sahifasi ───
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="max-w-md rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-12 text-center backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
            >
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">
              To‘lov muvaffaqiyatli!
            </h1>
            <p className="mt-3 text-slate-300">
              {plan.name} tarif {plan.days} kunga faollashtirildi.
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Bosh sahifaga yo‘naltirilmoqda…
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const colorMap = {
    slate: "from-slate-600 to-slate-700",
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-indigo-500",
    indigo: "from-indigo-500 to-violet-500",
    orange: "from-orange-500 to-red-500",
    cyan: "from-cyan-500 to-blue-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10">
        {/* Orqaga */}
        <button
          onClick={() => navigate("/pricing")}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Tariflarga qaytish
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white md:text-4xl">
            To‘lovni amalga oshirish
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {plan.name} tarif — {plan.amount.toLocaleString("uz-UZ")} so‘m /{" "}
            {plan.period}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* ─── Chap: Karta formasi ─── */}
          <form
            onSubmit={submit}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            {/* Karta ko‘rinishi */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative mb-6 h-48 overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[cardInfo.color]} p-6 text-white shadow-2xl`}
            >
              <div className="absolute right-4 top-4">
                <CreditCard className="h-6 w-6 opacity-80" />
              </div>

              {/* Karta turi */}
              <div className="mb-4 text-xs font-bold uppercase tracking-widest opacity-90">
                {cardInfo.label}
              </div>

              {/* Karta raqami */}
              <div className="mb-6 font-mono text-lg tracking-wider md:text-xl">
                {form.card_number || "•••• •••• •••• ••••"}
              </div>

              {/* Pastdagi qator */}
              <div className="flex justify-between text-xs">
                <div>
                  <div className="opacity-60">KARTA EGASI</div>
                  <div className="mt-1 truncate font-medium uppercase">
                    {form.card_holder || "ISM FAMILIYA"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="opacity-60">MUDDAT</div>
                  <div className="mt-1 font-medium">
                    {form.card_expiry || "MM/YY"}
                  </div>
                </div>
              </div>

              {/* Dekorativ aylana */}
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-white/10" />
            </motion.div>

            {/* Karta raqami */}
            <div className="mb-4">
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                Karta raqami
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={form.card_number}
                  onChange={(e) => handleChange("card_number", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 font-mono text-sm tracking-wider placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Karta egasi */}
            <div className="mb-4">
              <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                Karta egasi (ism familiya)
              </label>
              <input
                type="text"
                placeholder="ALISHER NAVOIY"
                value={form.card_holder}
                onChange={(e) =>
                  handleChange("card_holder", e.target.value.toUpperCase())
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                required
              />
            </div>

            {/* Muddat + CVV */}
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                  Muddat
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  value={form.card_expiry}
                  onChange={(e) => handleChange("card_expiry", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
                  CVV
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  placeholder="•••"
                  value={form.card_cvv}
                  onChange={(e) => handleChange("card_cvv", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Xato */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Yuborish */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <span className="animate-pulse">To‘lanmoqda…</span>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {plan.amount.toLocaleString("uz-UZ")} so‘m to‘lash
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Ma’lumotlar xavfsiz shifrlangan
            </div>
          </form>

          {/* ─── O‘ng: Tarif tafsiloti ─── */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-bold text-white">
              {plan.name} tarif
            </h2>

            <div className="mb-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-6">
              <div className="text-xs uppercase tracking-widest text-indigo-300">
                To‘lanadigan summa
              </div>
              <div className="mt-1 text-3xl font-black text-white">
                {plan.amount.toLocaleString("uz-UZ")}{" "}
                <span className="text-sm font-normal text-slate-400">so‘m</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {plan.days} kun uchun
              </div>
            </div>

            <div className="mb-4 text-sm font-semibold text-slate-300">
              Nima olasiz:
            </div>
            <ul className="space-y-2">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-300"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Karta logotiplari */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-3 text-xs uppercase tracking-widest text-slate-500">
                Qabul qilinadigan kartalar
              </div>
              <div className="grid grid-cols-3 gap-2">
                <CardBadge label="HUMO" color="from-blue-500 to-indigo-500" />
                <CardBadge
                  label="UZCARD"
                  color="from-emerald-500 to-teal-500"
                />
                <CardBadge label="VISA" color="from-indigo-600 to-violet-600" />
                <CardBadge label="MC" color="from-orange-500 to-red-500" />
                <CardBadge label="AMEX" color="from-cyan-500 to-blue-500" />
              </div>
            </div>

            {/* Eslatma */}
            <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-xs text-amber-200">
              💡 Bu demo to‘lov tizimi. Real loyihada Payme / Click / Stripe
              ishlatiladi.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CardBadge({ label, color }) {
  return (
    <div
      className={`flex h-10 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-xs font-bold text-white shadow-lg`}
    >
      {label}
    </div>
  );
}