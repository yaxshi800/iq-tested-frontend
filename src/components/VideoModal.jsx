import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Youtube, Clock } from "lucide-react";

export default function VideoModal({ isOpen, onClose, videos, questionTitle }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md dark:bg-slate-950/90"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-rose-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white md:text-base">
                Video yordam
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Question title */}
          {questionTitle && (
            <div className="border-b border-slate-100 px-4 py-3 dark:border-white/5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Savol: <span className="font-medium text-slate-700 dark:text-slate-300">{questionTitle}</span>
              </p>
            </div>
          )}

          {/* Videos */}
          <div className="space-y-6 p-4 md:p-6">
            {videos && videos.length > 0 ? (
              videos.map((video, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10"
                >
                  {/* Video header */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {video.title || `Video ${idx + 1}`}
                      </span>
                    </div>
                    {video.duration && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* YouTube embed */}
                  <div className="relative aspect-video bg-slate-900">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={video.url}
                      title={video.title || `Video ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-white/10 dark:bg-white/5">
                <Play className="mx-auto mb-3 h-12 w-12 text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Bu savol uchun videolar hali qo'shilmagan
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4 dark:border-white/10">
            <button
              onClick={onClose}
              className="btn-primary w-full py-3"
            >
              Yopish va davom etish
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}