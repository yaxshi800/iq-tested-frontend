import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Crown } from "lucide-react";

export default function FeatureGate({
  userPlan = "free",
  requiredPlan = "pro",
  children,
  title = "Bu xususiyat Pro tarifda",
  description = "Sertifikat olish, batafsil statistika va PDF hisobot uchun Pro tarifga o‘ting.",
}) {
  const navigate = useNavigate();

  const hierarchy = { free: 0, pro: 1, ultimate: 2 };
  const hasAccess = hierarchy[userPlan] >= hierarchy[requiredPlan];

  if (hasAccess) return children;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-amber-500/5 p-8 backdrop-blur-xl"
    >
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
          <Lock className="h-8 w-8 text-amber-500 dark:text-amber-400" />
        </div>

        <div className="mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-300">
          <Crown className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            {requiredPlan === "ultimate" ? "Ultimate" : "Pro"} tarif
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
          {description}
        </p>

        <button
          onClick={() => navigate("/pricing")}
          className="mt-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:brightness-110"
        >
          Tarifni ko‘rish
        </button>
      </div>
    </motion.div>
  );
}