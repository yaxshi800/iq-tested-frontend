import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, X, Trophy, RotateCcw, Home } from "lucide-react";
import clsx from "clsx";
import api from "../api/client";

export default function ImageTest() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  /* Savollarni yuklash */
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.post("/test/images/start/");
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error("Failed to start image test:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const selectImage = (idx) => {
    const q = questions[currentIdx];
    if (!q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: idx }));
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  const prev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = questions.map((q) => ({
      question_id: q.id,
      selected_index: answers[q.id] ?? null,
      time_spent: 0,
    }));

    try {
      const res = await api.post("/test/images/submit/", {
        answers: payload,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length
    ? (answeredCount / questions.length) * 100
    : 0;

  /* Loading */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse text-lg text-slate-600 dark:text-slate-300">
          Savollar yuklanmoqda…
        </div>
      </div>
    );
  }

  /* Savollar yo'q */
  if (!questions.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-lg text-slate-700 dark:text-slate-200">
          Savollar topilmadi
        </div>
        <button onClick={() => navigate("/home")} className="btn-primary">
          Bosh sahifaga qaytish
        </button>
      </div>
    );
  }

  /* Natija */
  if (result) {
    return (
      <ResultView
        result={result}
        onRetake={() => {
          setResult(null);
          setAnswers({});
          setCurrentIdx(0);
          setSubmitting(false);
          // Qayta yuklash
          api.post("/test/images/start/").then((r) => {
            setQuestions(r.data.questions || []);
          });
        }}
        onHome={() => navigate("/home")}
      />
    );
  }

  /* Test */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Orqaga
          </button>

          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {currentIdx + 1} / {questions.length}
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {answeredCount} javob
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-200 dark:bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* Question */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Sarlavha */}
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                  {currentQ.question_text || "Boshqalarga o'xshamagan rasmni toping"}
                </h2>
                {currentQ.hint_text && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    💡 {currentQ.hint_text}
                  </p>
                )}
              </div>

              {/* Rasmlar grid — 30 ta */}
              <div className="rounded-3xl border border-slate-200 bg-white/60 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-6">
                <div className="grid grid-cols-5 gap-2 md:grid-cols-6 md:gap-3">
                  {currentQ.images.map((img, idx) => {
                    const selected = answers[currentQ.id] === idx;
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => selectImage(idx)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                          "flex aspect-square items-center justify-center rounded-2xl border-2 text-3xl transition-all md:text-4xl",
                          selected
                            ? "border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400"
                            : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-400/50 dark:hover:bg-white/10"
                        )}
                      >
                        {img}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Tanlov ko'rsatkichi */}
              {answers[currentQ.id] !== undefined && (
                <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  Siz <span className="font-bold text-indigo-600 dark:text-indigo-400">{answers[currentQ.id] + 1}</span>-rasmni tanladingiz
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={prev}
            className="btn-ghost disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Oldingi
          </button>

          {currentIdx < questions.length - 1 ? (
            <button onClick={next} className="btn-primary">
              Keyingi
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="btn-primary"
            >
              {submitting ? "Yuborilmoqda…" : "Yakunlash"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RESULT VIEW
   ═══════════════════════════════════════════ */
function ResultView({ result, onRetake, onHome }) {
  const { percentage, correct_count, wrong_count, unanswered_count, total_questions } = result;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      >
        {/* Trophy */}
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
          <Trophy className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Natija
        </h1>

        {/* Foiz */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
          className="mt-6 bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-7xl font-black text-transparent"
        >
          {percentage}%
        </motion.div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {correct_count} ta to'g'ri javob
        </p>

        {/* Statistika */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-3">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-300">
              <Check className="h-4 w-4" />
              <span className="text-xl font-bold">{correct_count}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              To'g'ri
            </div>
          </div>

          <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-3">
            <div className="flex items-center justify-center gap-1 text-rose-600 dark:text-rose-300">
              <X className="h-4 w-4" />
              <span className="text-xl font-bold">{wrong_count}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Noto'g'ri
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="text-center">
              <span className="text-xl font-bold text-slate-600 dark:text-slate-300">
                {unanswered_count}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Javobsiz
            </div>
          </div>
        </div>

        {/* Tugmalar */}
        <div className="mt-8 flex flex-col gap-3">
          <button onClick={onRetake} className="btn-primary w-full py-3">
            <RotateCcw className="h-4 w-4" />
            Qayta sinash
          </button>
          <button onClick={onHome} className="btn-ghost w-full py-3">
            <Home className="h-4 w-4" />
            Bosh sahifaga qaytish
          </button>
        </div>
      </motion.div>
    </div>
  );
}