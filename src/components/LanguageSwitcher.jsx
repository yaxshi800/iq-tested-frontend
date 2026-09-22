import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { SUPPORTED_LANGUAGES } from "../i18n";

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language?.slice(0, 2)) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const change = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative z-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
          "bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur",
          "text-slate-100 transition-colors"
        )}
      >
        <Globe className="h-4 w-4 text-indigo-400" />
        {!compact && <span>{current.flag} {current.label}</span>}
        {compact && <span>{current.flag}</span>}
        <ChevronDown
          className={clsx("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute right-0 mt-2 w-48 overflow-hidden rounded-xl",
              "bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl"
            )}
          >
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = lang.code === current.code;
              return (
                <li key={lang.code}>
                  <button
                    onClick={() => change(lang.code)}
                    className={clsx(
                      "flex w-full items-center justify-between px-4 py-2.5 text-sm",
                      "text-slate-200 hover:bg-indigo-500/20 transition-colors",
                      active && "bg-indigo-500/10 text-white"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      {lang.label}
                    </span>
                    {active && <Check className="h-4 w-4 text-indigo-400" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}