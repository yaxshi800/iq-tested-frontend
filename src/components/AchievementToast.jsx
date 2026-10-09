import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

export default function AchievementToast({ achievements, onClose }) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-3 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500 to-orange-500 px-6 py-4 text-white shadow-2xl backdrop-blur-xl">
          <Trophy className="h-8 w-8" />
          <div>
            <div className="text-xs uppercase tracking-widest opacity-90">
              Yangi yutuq!
            </div>
            <div className="mt-1 font-bold">
              {achievements.join(", ")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 rounded-lg p-1 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}