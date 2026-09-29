import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import api from "../api/client";
import Navbar from "../components/Navbar";

const STATUS_MAP = {
  success: {
    label: "Muvaffaqiyatli",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
  },
  pending: {
    label: "Kutilmoqda",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  failed: {
    label: "Muvaffaqiyatsiz",
    icon: XCircle,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    border: "border-rose-400/30",
  },
  refunded: {
    label: "Qaytarilgan",
    icon: XCircle,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    border: "border-slate-400/30",
  },
};

const CARD_LABELS = {
  uzcard: "UZCARD",
  humo: "HUMO",
  visa: "VISA",
  mastercard: "MASTERCARD",
  amex: "AMEX",
  unknown: "KARTA",
};

export default function Payments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/auth/payments/")
      .then((r) => setPayments(r.data))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="animate-pulse">Yuklanmoqda…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Orqaga */}
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Profilga qaytish
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20">
            <CreditCard className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">To‘lov tarixi</h1>
            <p className="text-xs text-slate-400">
              Jami {payments.length} ta to‘lov
            </p>
          </div>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-500/20">
              <CreditCard className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-bold text-white">To‘lovlar yo‘q</h2>
            <p className="mt-2 text-sm text-slate-400">
              Hali hech qanday to‘lov amalga oshirmadingiz.
            </p>
            <Link to="/pricing" className="btn-primary mt-6 inline-flex">
              Tariflarni ko‘rish
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p, idx) => {
              const status = STATUS_MAP[p.status] || STATUS_MAP.pending;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                        <CreditCard className="h-6 w-6 text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {p.plan === "pro" ? "Pro tarif" : "Ultimate tarif"}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          {CARD_LABELS[p.card_type] || "KARTA"} ••••{" "}
                          {p.card_last4}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {new Date(p.created_at).toLocaleString("uz-UZ")}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {parseFloat(p.amount).toLocaleString("uz-UZ")} so‘m
                      </div>
                      <div
                        className={`mt-1 inline-flex items-center gap-1 rounded-full border ${status.border} ${status.bg} px-3 py-0.5 text-xs ${status.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </div>
                    </div>
                  </div>

                  {/* Tranzaksiya ID */}
                  <div className="mt-3 border-t border-white/5 pt-3">
                    <div className="font-mono text-[10px] text-slate-500">
                      ID: {p.transaction_id}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}