import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, Send, Grid3x3 } from "lucide-react";
import clsx from "clsx";
import { startTest, submitTest } from "../api/client";
import LanguageSwitcher from "../components/LanguageSwitcher";

const TOTAL_SECONDS = 40 * 60;

export default function TestContainer() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [sessionUuid, setSessionUuid] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});     // { qid: {selected_index, time_spent} }
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const questionStartRef = useRef(Date.now());

  /* ---------- Bootstrap test ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await startTest(i18n.language);
        if (!mounted) return;
        setQuestions(data.questions);
        setSessionUuid(data.session_uuid);
        setSecondsLeft(data.duration_seconds || TOTAL_SECONDS);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []); // eslint-disable-line

  /* ---------- Countdown timer ---------- */
  useEffect(() => {
    if (loading || submitting) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          handleSubmit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loading, submitting]); // eslint-disable-line

  /* ---------- Track per-question time ---------- */
  useEffect(() => {
    questionStartRef.current = Date.now();
  }, [currentIdx]);

  /* ---------- Keyboard shortcuts 1..4, arrow nav ---------- */
  useEffect(() => {
    const onKey = (e) => {
      const q = questions[currentIdx];
      if (!q) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        selectOption(parseInt(e.key, 10) - 1);
      } else if (e.key === "ArrowRight") {
        setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIdx((i) => Math.max(i - 1, 0));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIdx, questions]); // eslint-disable-line

  const selectOption = (idx) => {
    const q = questions[currentIdx];
    if (!q) return;
    const time_spent = Math.round((Date.now() - questionStartRef.current) / 1000);
    setAnswers((prev) => {
      const prevTime = prev[q.id]?.time_spent || 0;
      return {
        ...prev,
        [q.id]: { selected_index: idx, time_spent: prevTime + time_spent },
      };
    });
    questionStartRef.current = Date.now();
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    if (!auto && !window.confirm(t("test.confirm_submit"))) return;

    setSubmitting(true);
    const payload = questions.map((q) => ({
      question_id: q.id,
      selected_index: answers[q.id]?.selected_index ?? null,
      time_spent: answers[q.id]?.time_spent ?? 0,
    }));

    try {
      const res = await submitTest(sessionUuid, payload);
      navigate(`/results/${res.result.uuid}`, { state: { result: res.result } });
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const currentQ = questions[currentIdx];
  const answeredCount = Object.keys(answers).length;
  const progress = questions.length ? (answeredCount / questions.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="animate-pulse text-lg">{t("test.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      {/* ---------- Top bar ---------- */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div
            className={clsx(
              "flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg font-semibold",
              "border border-white/10 bg-white/5 backdrop-blur",
              secondsLeft < 300 ? "text-rose-400 animate-pulse" : "text-indigo-300"
            )}
          >
            <Clock className="h-5 w-5" />
            {formatTime(secondsLeft)}
          </div>

          <div className="hidden flex-1 items-center gap-3 md:flex">
            <span className="text-sm text-slate-400 whitespace-nowrap">
              {answeredCount} / {questions.length}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid((s) => !s)}
              className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"
              title="Question grid"
            >
              <Grid3x3 className="h-5 w-5 text-indigo-300" />
            </button>
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>

      {/* ---------- Grid overlay ---------- */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur"
            onClick={() => setShowGrid(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="grid max-w-2xl grid-cols-8 gap-2 rounded-2xl border border-white/10 bg-slate-900/90 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {questions.map((q, i) => {
                const answered = answers[q.id] != null;
                const active = i === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIdx(i); setShowGrid(false); }}
                    className={clsx(
                      "h-10 w-10 rounded-lg border text-sm font-medium transition",
                      active && "ring-2 ring-indigo-400",
                      answered
                        ? "bg-indigo-500/30 border-indigo-400/50 text-white"
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Question card ---------- */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 text-sm text-slate-400">
          {t("test.question_of", { current: currentIdx + 1, total: questions.length })}
        </div>

        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="mb-6 text-lg leading-relaxed text-slate-100">
                {currentQ.text}
              </div>

              {currentQ.image_url && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={currentQ.image_url}
                    alt="matrix"
                    className="max-h-72 rounded-xl border border-white/10"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {currentQ.options.map((opt, i) => {
                  const selected = answers[currentQ.id]?.selected_index === i;
                  return (
                    <button
                      key={i}
                      onClick={() => selectOption(i)}
                      className={clsx(
                        "group flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all",
                        selected
                          ? "border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20"
                          : "border-white/10 bg-white/5 hover:border-indigo-400/50 hover:bg-white/10 text-slate-200"
                      )}
                    >
                      <span
                        className={clsx(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                          selected
                            ? "border-indigo-400 bg-indigo-500 text-white"
                            : "border-white/20 bg-white/5 text-slate-300 group-hover:border-indigo-400/60"
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm md:text-base">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Footer nav ---------- */}
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> {t("test.previous")}
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
              className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
            >
              {t("test.next")} <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" /> {t("test.submit")}
            </button>
          )}
        </div>
      </main>

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur">
          <div className="animate-pulse text-lg text-indigo-300">
            {t("test.time_up")}
          </div>
        </div>
      )}
    </div>
  );
}