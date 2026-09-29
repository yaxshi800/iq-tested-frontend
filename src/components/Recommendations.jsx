import { motion } from "framer-motion";
import {
  BookOpen,
  Youtube,
  Brain,
  Trophy,
  Target,
  Sparkles,
} from "lucide-react";

const RECOMMENDATIONS = {
  high: {
    label: "Ajoyib natija!",
    message:
      "Sizning IQ darajangiz aholining 98% dan yuqori. Kognitiv qobiliyatingiz juda yuqori.",
    color: "emerald",
    books: [
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
      { title: "The Art of Problem Solving", author: "Sandor Lehoczky" },
      { title: "Gödel, Escher, Bach", author: "Douglas Hofstadter" },
      { title: "Superintelligence", author: "Nick Bostrom" },
    ],
    videos: [
      { title: "MIT OpenCourseWare", url: "https://www.youtube.com/results?search_query=mit+advanced+mathematics" },
      { title: "3Blue1Brown", url: "https://www.youtube.com/c/3blue1brown" },
      { title: "Lex Fridman Podcast", url: "https://www.youtube.com/c/lexfridman" },
    ],
    exercises: [
      "Kunlik 3 ta qiyin matematik masala yechish",
      "Sudoku (9x9 qiyin daraja)",
      "Shaxmat o'ynash (kunlik 30 daqiqa)",
      "Yangi til o'rganish",
    ],
  },
  above_average: {
    label: "Yaxshi natija!",
    message:
      "Siz aholining 84–98% dan yuqorisiz. Bilim va tajriba orqali yana ko'tarilishingiz mumkin.",
    color: "indigo",
    books: [
      { title: "How to Solve It", author: "George Pólya" },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
      { title: "The Power of Habit", author: "Charles Duhigg" },
      { title: "Peak", author: "Anders Ericsson" },
    ],
    videos: [
      { title: "Khan Academy", url: "https://www.youtube.com/c/khanacademy" },
      { title: "Veritasium", url: "https://www.youtube.com/c/veritasium" },
      { title: "Ted-Ed", url: "https://www.youtube.com/c/TEDEd" },
    ],
    exercises: [
      "Kunlik 20 daqiqa meditatsiya",
      "Raven matritsalari mashqi",
      "Rapid chess o'ynash",
      "Kitob o'qish (kuniga 30 bet)",
    ],
  },
  average: {
    label: "Yaxshi boshlanish!",
    message:
      "Sizning natijangiz aholining ko'pchilik qismiga to'g'ri keladi. Tizimli mashqlar bilan yaxshilashingiz mumkin.",
    color: "amber",
    books: [
      { title: "Atomic Habits", author: "James Clear" },
      { title: "The 5 Elements of Effective Thinking", author: "Edward Burger" },
      { title: "Moonwalking with Einstein", author: "Joshua Foer" },
      { title: "Make It Stick", author: "Peter Brown" },
    ],
    videos: [
      { title: "TED — Brain Training", url: "https://www.youtube.com/results?search_query=ted+brain+training" },
      { title: "CrashCourse", url: "https://www.youtube.com/c/crashcourse" },
      { title: "Jim Kwik", url: "https://www.youtube.com/c/JimKwik" },
    ],
    exercises: [
      "Kuniga 15 daqiqa mental arifmetika",
      "Lumosity yoki Elevate mashqlari",
      "Yoga yoki jismoniy mashqlar",
      "Krossvord va sudoku",
    ],
  },
  below_average: {
    label: "Boshlanish nuqtasi",
    message:
      "Bu sizning haqiqiy potentsialingiz emas — charchoq, stress yoki konsentratsiya muammosi ta'sir qilgan bo'lishi mumkin.",
    color: "rose",
    books: [
      { title: "Mindset", author: "Carol Dweck" },
      { title: "Learning How to Learn", author: "Barbara Oakley" },
      { title: "Deep Work", author: "Cal Newport" },
      { title: "The Brain That Changes Itself", author: "Norman Doidge" },
    ],
    videos: [
      { title: "Learning How to Learn", url: "https://www.youtube.com/results?search_query=learning+how+to+learn" },
      { title: "Andrew Huberman", url: "https://www.youtube.com/c/AndrewHubermanLab" },
    ],
    exercises: [
      "Har kuni 10 daqiqa diqqat mashqi",
      "Yaxshi uyqu (7-8 soat)",
      "Sog'lom ovqatlanish",
      "Jismoniy mashqlar (kuniga 30 daq.)",
    ],
  },
};

function getCategory(iq) {
  if (iq >= 130) return "high";
  if (iq >= 115) return "above_average";
  if (iq >= 85) return "average";
  return "below_average";
}

function getPercentileMessage(percentile) {
  if (percentile >= 99) return "Aholining 99% dan yuqori 🏆";
  if (percentile >= 95) return "Aholining 95% dan yuqori 🥇";
  if (percentile >= 84) return "Aholining 84% dan yuqori 🎯";
  if (percentile >= 50) return "Aholining yarmidan yuqori ✅";
  if (percentile >= 16) return "Aholining 16% dan yuqori 📈";
  return "Boshlanish nuqtasi 🌱";
}

export default function Recommendations({ iq, percentile }) {
  const category = getCategory(iq);
  const rec = RECOMMENDATIONS[category];

  const colorClasses = {
    emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
    indigo: "border-indigo-400/30 bg-indigo-400/10 text-indigo-600 dark:text-indigo-300",
    amber: "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
    rose: "border-rose-400/30 bg-rose-400/10 text-rose-600 dark:text-rose-300",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      <div className={`rounded-3xl border p-8 backdrop-blur-xl ${colorClasses[rec.color]}`}>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/40 dark:bg-white/10">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {rec.label}
            </h2>
            <p className="mt-1 text-sm opacity-90">
              {getPercentileMessage(percentile)}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed opacity-90">{rec.message}</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Tavsiya etilgan kitoblar
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {rec.books.map((book, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white/60 p-4 transition hover:border-indigo-400/40 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {book.title}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {book.author}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center gap-3">
          <Youtube className="h-6 w-6 text-rose-500 dark:text-rose-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            YouTube kanallar va videolar
          </h3>
        </div>
        <div className="space-y-3">
          {rec.videos.map((video, i) => (
            <a
              key={i}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/60 p-4 transition hover:border-rose-400/40 hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <span className="text-sm text-slate-900 dark:text-white">
                {video.title}
              </span>
              <Youtube className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mb-4 flex items-center gap-3">
          <Brain className="h-6 w-6 text-violet-500 dark:text-violet-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            IQ ko‘taruvchi mashqlar
          </h3>
        </div>
        <ul className="space-y-3">
          {rec.exercises.map((ex, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
            >
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-violet-500 dark:text-violet-400" />
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-6 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-300" />
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong className="text-slate-900 dark:text-white">Eslatma:</strong>{" "}
            IQ — bu tug‘ma qobiliyat emas. Muntazam mashqlar, yaxshi uyqu va
            yangi ko‘nikmalar o‘rganish orqali kognitiv qobiliyatlarni oshirish
            mumkin.
          </div>
        </div>
      </div>
    </motion.section>
  );
}