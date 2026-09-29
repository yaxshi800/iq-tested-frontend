import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import api from "../api/client";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "register" ? "register" : "login"
  );
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "register" || urlMode === "login") {
      setMode(urlMode);
    }
  }, [searchParams]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await api.post("/auth/register/", {
          username: form.username,
          email: form.email,
          password: form.password,
          password2: form.password2,
        });
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
      } else {
        const res = await api.post("/auth/token/", {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
      }
      navigate("/home");
    } catch (err) {
      const data = err?.response?.data;
      let msg = "Xatolik yuz berdi.";
      if (data) {
        if (typeof data === "string") msg = data;
        else if (data.detail) msg = data.detail;
        else if (data.password) msg = data.password.join(" ");
        else if (data.username) msg = data.username.join(" ");
        else msg = JSON.stringify(data);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-100 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="CogniTest"
            className="mx-auto mb-4 h-16 w-16 object-contain drop-shadow-xl"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {mode === "login" ? "Tizimga kirish" : "Ro‘yxatdan o‘tish"}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {mode === "login"
              ? "Akkauntingizga kiring"
              : "Yangi akkaunt yarating"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Foydalanuvchi nomi"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
              autoComplete="username"
            />
          </div>

          {/* Email (faqat register) */}
          {mode === "register" && (
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                autoComplete="email"
              />
            </div>
          )}

          {/* Parol */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              placeholder="Parol"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
              required
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </div>

          {/* Parol 2 (faqat register) */}
          {mode === "register" && (
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="Parolni qayta kiriting"
                value={form.password2}
                onChange={(e) =>
                  setForm({ ...form, password2: e.target.value })
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {/* Xato */}
          {error && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Yuborish */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading
              ? "..."
              : mode === "login"
              ? "Kirish"
              : "Ro‘yxatdan o‘tish"}
          </button>
        </form>

        {/* Rejim almashtirish */}
        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="mt-4 w-full text-center text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
        >
          {mode === "login"
            ? "Akkauntingiz yo‘qmi? Ro‘yxatdan o‘tish"
            : "Akkauntingiz bormi? Kirish"}
        </button>

        {/* Bosh sahifa */}
        <Link
          to="/"
          className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        >
          ← Bosh sahifaga qaytish
        </Link>
      </motion.div>
    </div>
  );
}