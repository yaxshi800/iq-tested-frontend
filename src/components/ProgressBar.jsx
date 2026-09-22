import { motion } from "framer-motion";
import clsx from "clsx";

export default function ProgressBar({ current, total, className }) {
  const pct = total ? (current / total) * 100 : 0;
  return (
    <div className={clsx("w-full", className)}>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>{current} / {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}