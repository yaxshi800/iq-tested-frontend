import { motion } from "framer-motion";
import clsx from "clsx";

export default function NavigationGrid({
  total, current, answeredMap, onSelect, onClose,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="grid max-w-2xl grid-cols-8 gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {Array.from({ length: total }).map((_, i) => {
          const answered = answeredMap?.[i];
          const active = i === current;
          return (
            <button
              key={i}
              onClick={() => { onSelect(i); onClose(); }}
              className={clsx(
                "h-10 w-10 rounded-lg border text-sm font-medium transition",
                active && "ring-2 ring-indigo-400",
                answered
                  ? "border-indigo-400/50 bg-indigo-500/30 text-white"
                  : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
}