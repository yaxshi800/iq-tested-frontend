import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Monitor } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }

    // Dismissed before?
    if (localStorage.getItem("pwa_prompt_dismissed") === "true") {
      setDismissed(true);
      return;
    }

    // iOS detection
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    // Android / Desktop: capture install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 3000);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: show custom prompt
    if (ios && !window.navigator.standalone) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (isStandalone || dismissed || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-indigo-400/30 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl md:bottom-6"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500">
            {isIOS ? (
              <Smartphone className="h-6 w-6 text-white" />
            ) : (
              <Download className="h-6 w-6 text-white" />
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">
              CogniTest ilovasini o‘rnating
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {isIOS
                ? "Safari'da Share → Add to Home Screen tugmasini bosing"
                : "Ilovani telefoningiz yoki kompyuteringizga o‘rnating"}
            </p>

            <div className="mt-3 flex gap-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstall}
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  O‘rnatish
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
              >
                Keyinroq
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="rounded-lg p-1 text-slate-500 hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}