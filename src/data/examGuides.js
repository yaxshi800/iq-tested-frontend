// Imtihonlar va kasblar bo'yicha qo'llanmalar.
// Foydalanuvchi nom yozganda shu ma'lumotlardan foydalanamiz.

export const EXAM_GUIDES = {
  ielts: {
    title: "IELTS",
    fullName: "International English Language Testing System",
    description: "Xalqaro ingliz tili imtihoni — universitetga kirish va migratsiya uchun.",
    sections: [
      { name: "Listening", duration: "30 daqiqa", score: "0-9" },
      { name: "Reading", duration: "60 daqiqa", score: "0-9" },
      { name: "Writing", duration: "60 daqiqa", score: "0-9" },
      { name: "Speaking", duration: "11-14 daqiqa", score: "0-9" },
    ],
    books: [
      { title: "Cambridge IELTS 18 Academic", author: "Cambridge University Press" },
      { title: "The Official Cambridge Guide to IELTS", author: "Cambridge" },
      { title: "IELTS Trainer 2", author: "Cambridge" },
      { title: "Barron's IELTS Superpack", author: "Lin Lougheed" },
    ],
    channels: [
      { title: "IELTS Liz", url: "https://www.youtube.com/c/ieltsliz", desc: "Barcha bo'limlar bo'yicha maslahatlar" },
      { title: "IELTS Advantage", url: "https://www.youtube.com/c/IELTSAdvantage", desc: "Writing va Speaking fokus" },
      { title: "E2 IELTS", url: "https://www.youtube.com/c/E2IELTS", desc: "Strategiyalar va mock testlar" },
    ],
    tips: [
      "Kuniga 1 soat Writing mashqi — Task 1 va Task 2 ni navbat bilan",
      "Har kuni 20 daqiqa Speaking (o'zingiz bilan ham bo'lsa)",
      "Reading uchun skimming va scanning texnikalarini mashq qiling",
      "Vocabulary uchun 10 ta yangi so'zni har kuni yodlang",
    ],
  },

  cefr: {
    title: "CEFR",
    fullName: "Common European Framework of Reference for Languages",
    description: "Yevropa til ko'nikmalari tizimi — A1 dan C2 gacha.",
    sections: [
      { level: "A1-A2", name: "Boshlang'ich" },
      { level: "B1-B2", name: "O'rta" },
      { level: "C1-C2", name: "Yuqori" },
    ],
    books: [
      { title: "English Grammar in Use", author: "Raymond Murphy" },
      { title: "Destination B2", author: "Malcolm Mann" },
      { title: "Cambridge Vocabulary for IELTS", author: "Pauline Cullen" },
    ],
    channels: [
      { title: "BBC Learning English", url: "https://www.youtube.com/c/bbclearningenglish", desc: "Barcha darajalar uchun" },
      { title: "English with Lucy", url: "https://www.youtube.com/c/EnglishwithLucy", desc: "Grammatika va talaffuz" },
      { title: "Speak English With Vanessa", url: "https://www.youtube.com/c/SpeakEnglishWithVanessa", desc: "Speaking mashqlari" },
    ],
    tips: [
      "Har kuni 15 daqiqa tinglash (podkast yoki YouTube)",
      "Yangi so'zlarni kontekstda o'rganing",
      "Speaking uchun shadowing texnikasidan foydalaning",
    ],
  },

  "full stack": {
    title: "Full Stack Developer",
    fullName: "To'liq stack dasturchi yo'li",
    description: "Frontend + Backend + DevOps ko'nikmalari.",
    sections: [
      { name: "Frontend", tech: "HTML, CSS, JavaScript, React" },
      { name: "Backend", tech: "Python, Django, Node.js" },
      { name: "Database", tech: "PostgreSQL, MongoDB" },
      { name: "DevOps", tech: "Docker, CI/CD, AWS" },
    ],
    books: [
      { title: "Eloquent JavaScript", author: "Marijn Haverbeke" },
      { title: "You Don't Know JS", author: "Kyle Simpson" },
      { title: "Django for Professionals", author: "William S. Vincent" },
      { title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" },
    ],
    channels: [
      { title: "Traversy Media", url: "https://www.youtube.com/c/TraversyMedia", desc: "To'liq stack loyihalar" },
      { title: "The Net Ninja", url: "https://www.youtube.com/c/TheNetNinja", desc: "React, Node, Django" },
      { title: "freeCodeCamp", url: "https://www.youtube.com/c/freeCodeCamp", desc: "Bepul to'liq kurslar" },
      { title: "Fireship", url: "https://www.youtube.com/c/Fireship", desc: "Tez va qisqa darslar" },
    ],
    tips: [
      "Har kuni kamida 1 soat kod yozing",
      "GitHub'da 3-5 ta real loyiha qiling",
      "Portfolio sayt yarating",
      "Open source loyihalarga hissa qo'shing",
    ],
  },

  "frontend": {
    title: "Frontend Developer",
    fullName: "Frontend dasturchi yo'li",
    description: "Veb sayt interfeyslarini yaratish.",
    sections: [
      { name: "HTML/CSS", tech: "Semantik HTML, Flexbox, Grid" },
      { name: "JavaScript", tech: "ES6+, DOM, Async" },
      { name: "React", tech: "Hooks, Router, State" },
      { name: "Tools", tech: "Vite, Git, npm" },
    ],
    books: [
      { title: "HTML and CSS", author: "Jon Duckett" },
      { title: "JavaScript: The Good Parts", author: "Douglas Crockford" },
      { title: "Learning React", author: "Alex Banks" },
    ],
    channels: [
      { title: "Kevin Powell", url: "https://www.youtube.com/c/KevinPowell", desc: "CSS mutaxassisi" },
      { title: "Web Dev Simplified", url: "https://www.youtube.com/c/WebDevSimplified", desc: "React va JS" },
      { title: "Codevolution", url: "https://www.youtube.com/c/Codevolution", desc: "React chuqur" },
    ],
    tips: [
      "Kuniga 1 ta kichik loyiha",
      "CSS Flexbox va Grid ni yaxshi o'rganing",
      "React Hooks ni chuqur tushuning",
    ],
  },

  python: {
    title: "Python Developer",
    fullName: "Python dasturchi yo'li",
    description: "Backend, Data Science, Automation.",
    sections: [
      { name: "Asoslar", tech: "Sintaksis, OOP, Funksiyalar" },
      { name: "Web", tech: "Django, FastAPI, Flask" },
      { name: "Data", tech: "Pandas, NumPy" },
      { name: "DevOps", tech: "Docker, Linux" },
    ],
    books: [
      { title: "Automate the Boring Stuff", author: "Al Sweigart" },
      { title: "Python Crash Course", author: "Eric Matthes" },
      { title: "Fluent Python", author: "Luciano Ramalho" },
    ],
    channels: [
      { title: "Corey Schafer", url: "https://www.youtube.com/c/Coreyms", desc: "Python asoslari" },
      { title: "Tech With Tim", url: "https://www.youtube.com/c/TechWithTim", desc: "Python loyihalar" },
      { title: "sentdex", url: "https://www.youtube.com/c/sentdex", desc: "Data Science" },
    ],
    tips: [
      "Kuniga 1 ta Python masala (LeetCode / Codewars)",
      "Django bilan 2 ta loyiha qiling",
      "GitHub'ga yuklang",
    ],
  },

  sat: {
    title: "SAT",
    fullName: "Scholastic Assessment Test",
    description: "AQSh universitetlariga kirish testi.",
    sections: [
      { name: "Reading & Writing", duration: "64 daqiqa" },
      { name: "Math", duration: "70 daqiqa" },
    ],
    books: [
      { title: "The Official SAT Study Guide", author: "College Board" },
      { title: "SAT Prep Black Book", author: "Mike Barrett" },
      { title: "Khan Academy SAT Math", author: "Khan Academy" },
    ],
    channels: [
      { title: "Khan Academy SAT", url: "https://www.youtube.com/c/khanacademy", desc: "Bepul rasmiy tayyorgarlik" },
      { title: "The Princeton Review", url: "https://www.youtube.com/c/ThePrincetonReview", desc: "Strategiyalar" },
    ],
    tips: [
      "Har hafta 1 ta to'liq mock test",
      "Math formulalarini yodlang",
      "Reading uchun tez o'qish texnikasi",
    ],
  },
};

// Fallback — agar imtihon topilmasa
export const DEFAULT_GUIDE = {
  title: "Umumiy o'quv maslahatlar",
  fullName: "Universal study guide",
  description: "Har qanday imtihon yoki ko'nikma uchun umumiy maslahatlar.",
  sections: [
    { name: "Rejalashtirish", tech: "Kunlik jadval tuzing" },
    { name: "Amaliyot", tech: "Har kuni mashq qiling" },
    { name: "Tahlil", tech: "Xatolaringizni tahlil qiling" },
  ],
  books: [
    { title: "Deep Work", author: "Cal Newport" },
    { title: "Atomic Habits", author: "James Clear" },
    { title: "Learning How to Learn", author: "Barbara Oakley" },
  ],
  channels: [
    { title: "TED-Ed", url: "https://www.youtube.com/c/TEDEd", desc: "Ta'lim videolari" },
    { title: "CrashCourse", url: "https://www.youtube.com/c/crashcourse", desc: "Turli fanlar" },
  ],
  tips: [
    "Har kuni bir xil vaqtda o'qing",
    "Pomodoro texnikasidan foydalaning (25 daqiqa + 5 tanaffus)",
    "Progressni kuzatib boring",
    "Yaxshi uxlang (7-8 soat)",
  ],
};

// Imtihon nomini kalitga aylantirish
export function findGuide(query) {
  const q = query.toLowerCase().trim();

  if (q.includes("ielts")) return EXAM_GUIDES.ielts;
  if (q.includes("cefr") || q.includes("cef")) return EXAM_GUIDES.cefr;
  if (q.includes("full") && q.includes("stack")) return EXAM_GUIDES["full stack"];
  if (q.includes("front")) return EXAM_GUIDES.frontend;
  if (q.includes("python")) return EXAM_GUIDES.python;
  if (q.includes("sat")) return EXAM_GUIDES.sat;

  return null;
}