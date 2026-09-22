import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function IQScoreReveal({ iq, percentile }) {
  const { t } = useTranslation();
  return (
    <div className="relative">
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
          {iq}
        </motion.span>
        <span className="mb-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          <Award className="mr-1 inline h-4 w-4" />
          {t("results.percentile_badge", { value: percentile })}
        </span>
      </div>
    </div>
  );
}