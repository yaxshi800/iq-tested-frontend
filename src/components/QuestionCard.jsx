import { motion } from "framer-motion";

export default function QuestionCard({ question }) {
  if (!question) return null;
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
    >
      <div className="mb-6 text-lg leading-relaxed text-slate-100">
        {question.text}
      </div>

      {question.image_url && (
        <div className="mb-6 flex justify-center">
          <img
            src={question.image_url}
            alt="visual"
            className="max-h-72 rounded-xl border border-white/10"
          />
        </div>
      )}
    </motion.div>
  );
}