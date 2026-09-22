import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import clsx from "clsx";

export default function Timer({ totalSeconds, onExpire }) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) { onExpire?.(); return; }
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft, onExpire]);

  const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const s = (secondsLeft % 60).toString().padStart(2, "0");
  const danger = secondsLeft < 300;

  return (
    <motion.div
      animate={danger ? { scale: [1, 1.04, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.6 }}
      className={clsx(
        "flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2",
        "font-mono text-lg font-semibold backdrop-blur",
        danger ? "text-rose-400" : "text-indigo-300"
      )}
    >
      <Clock className="h-5 w-5" />
      {m}:{s}
    </motion.div>
  );
}