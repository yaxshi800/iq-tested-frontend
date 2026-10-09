import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight, Send, Grid3x3, PlayCircle } from "lucide-react";
import clsx from "clsx";
import { startTest, submitTest } from "../api/client";
import VideoModal from "../components/VideoModal";

const TOTAL_SECONDS = 40 * 60;

export default function TestContainer() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { category = "iq" } = useParams();

  const [questions, setQuestions] = useState([]);
  const [sessionUuid, setSessionUuid] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showVideo, setShowVideo] = useState(false);   // ⭐ VIDEO MODAL

  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const data = await startTest(category, i18n.language);
        if (!mounted) return;
        setQuestions(data.questions || []);
        setSessionUuid(data.session_uuid);
        setSecondsLeft(data.duration_seconds || TOTAL_SECONDS);
      } catch (err) {
        console.error("Failed to start test:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => { mounted = false; };
  }, [category]); // eslint-disable-line

  useEffect(() => {
    if (loading || submitting) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(id); handleSubmit(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [loading, submitting]); // eslint-disable-line

  useEffect(() => { questionStartRef.current = Date.now(); }, [currentIdx]);

  useEffect(() => {
    const onKey = (e) => {
      const q = questions[currentIdx];
      if (!q) return;
      if (["1", "2", "3", "4"].includes(e.key)) selectOption(parseInt(e.key, 10) - 1);
      else if (e.key === "ArrowRight") setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
      else if (e.key === "ArrowLeft") setCurrentIdx((i) => Math.max(i - 1, 0));
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
      return { ...prev, [q.id]: { selected_index: idx, time_spent: prevTime + time_spent } };
    });
    questionStartRef.current = Date.now();
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
        <div className="animate-pulse text-lg">{t("test.loading")}</div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-4 dark:bg-slate-950">
        <div className="text-lg text-slate-700 dark:text-slate-200">Bu test uchun savollar topilmadi.</div>
        <button onClick={() => navigate("/home")} className="btn-primary">Bosh sahifaga qaytish</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className={clsx(
            "flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-lg font-semibold border backdrop-blur",
            secondsLeft < 300
              ? "border-rose-400/30 bg-rose-500/10 text-rose-500 dark:text-rose-400"
              : "border-slate-200 bg-white/60 text-indigo-600 dark:border-white/10 dark:bg-white/5 dark:text-indigo-300"
          )}>
            <Clock className="h-5 w-5" />
            {formatTime(secondsLeft)}
          </div>

          <div className="hidden flex-1 items-center gap-3 md:flex">
            <span className="whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
              {answeredCount} / {questions.length}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
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
              className="rounded-xl border border-slate-200 bg-white/60 p-2 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              title="Savollar jadvali"
            >
              <Grid3x3 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Grid */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 backdrop-blur dark:bg-slate-950/80"
            onClick={() => setShowGrid(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="grid max-w-2xl grid-cols-8 gap-2 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900/90"
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
                        ? "border-indigo-400/50 bg-indigo-500/30 text-indigo-900 dark:text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
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

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
        videos={currentQ?.videos || []}
        questionTitle={currentQ?.text}
      />

      {/* Question */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {t("test.question_of", { current: currentIdx + 1, total: questions.length })}
          </div>

          {/* ⭐ VIDEO TUGMASI */}
          {currentQ?.videos && currentQ.videos.length > 0 && (
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-400/20 dark:text-rose-300"
            >
              <PlayCircle className="h-4 w-4" />
              Video yordam ({currentQ.videos.length})
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border border-slate-200 bg-white/60 p-8 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-6 text-lg leading-relaxed text-slate-900 dark:text-slate-100">
                {currentQ.text}
              </div>

              {currentQ.image_url && (
                <div className="mb-6 flex justify-center">
                  <img src={currentQ.image_url} alt="matrix"
                    className="max-h-72 rounded-xl border border-slate-200 dark:border-white/10" />
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
                          ? "border-indigo-400 bg-indigo-500/20 text-slate-900 shadow-lg shadow-indigo-500/20 dark:text-white"
                          : "border-slate-200 bg-white/60 text-slate-700 hover:border-indigo-400/50 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                      )}
                    >
                      <span className={clsx(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                        selected
                          ? "border-indigo-400 bg-indigo-500 text-white"
                          : "border-slate-200 bg-white text-slate-600 group-hover:border-indigo-400/60 dark:border-white/20 dark:bg-white/5 dark:text-slate-300"
                      )}>
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

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="btn-ghost disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> {t("test.previous")}
          </button>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))} className="btn-primary">
              {t("test.next")} <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn-primary">
              <Send className="h-4 w-4" /> {t("test.submit")}
            </button>
          )}
        </div>
      </main>

      {submitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur dark:bg-slate-950/80">
          <div className="animate-pulse text-lg text-indigo-600 dark:text-indigo-300">
            {t("test.time_up")}
          </div>
        </div>
      )}
    </div>
  );
}