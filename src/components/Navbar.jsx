import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LogIn,
  UserPlus,
  User,
  LogOut,
  Menu,
  X,
  Crown,
  Bot,
  CreditCard,
  Settings,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();

  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  /* ═══════════ Foydalanuvchi ma'lumotlarini olish ═══════════ */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetch(
        (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1") +
          "/auth/me/",
        { headers: { Authorization: "Bearer " + token } }
      )
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => data && setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  /* ═══════════ Tashqariga bosilganda user menuni yopish ═══════════ */
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ═══════════ Chiqish ═══════════ */
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  /* ═══════════ Tarif badge ═══════════ */
  const planBadge = () => {
    if (!user?.profile) return null;
    const { plan } = user.profile;
    if (plan === "ultimate")
      return (
        <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white">
          ULTIMATE
        </span>
      );
    if (plan === "pro")
      return (
        <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-2 py-0.5 text-[10px] font-bold text-white">
          PRO
        </span>
      );
    return null;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/70 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/60">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* ═══════════ Logotip ═══════════ */}
        <Link to="/home" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="CogniTest"
            className="h-10 w-10 rounded-xl object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            {t("app.title")}
          </span>
        </Link>

        {/* ═══════════ Desktop menyu ═══════════ */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Day/Night toggle */}
          <button
            onClick={toggle}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            title={theme === "dark" ? "Yorug‘ rejim" : "Qorong‘i rejim"}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>

          {/* AI Yordamchi */}
          <Link
            to="/ai-advisor"
            className="flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-600 transition hover:bg-violet-400/20 dark:text-violet-300"
          >
            <Bot className="h-4 w-4" />
            AI Yordamchi
          </Link>

          {/* Tariflar */}
          <Link
            to="/pricing"
            className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-600 transition hover:bg-amber-400/20 dark:text-amber-300"
          >
            <Crown className="h-4 w-4" />
            Tariflar
          </Link>

          {/* User menu yoki Login/Register */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span>{user.username}</span>
                {planBadge()}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User dropdown menyu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900/95">
                  {/* User ma'lumotlari */}
                  <div className="border-b border-slate-200 px-4 py-3 dark:border-white/5">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user.username}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email || "Email yo‘q"}
                    </div>
                  </div>

                  {/* Profil */}
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Profil
                  </Link>

                  {/* To'lov tarixi */}
                  <Link
                    to="/payments"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <CreditCard className="h-4 w-4 text-slate-400" />
                    To‘lov tarixi
                  </Link>

                  {/* Tarifni oshirish */}
                  <Link
                    to="/pricing"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 transition hover:bg-slate-100 dark:text-amber-300 dark:hover:bg-white/5"
                  >
                    <Crown className="h-4 w-4" />
                    Tarifni oshirish
                  </Link>

                  {/* Chiqish */}
                  <div className="border-t border-slate-200 dark:border-white/5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Chiqish
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Kirish */}
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" />
                Kirish
              </Link>

              {/* Ro'yxatdan o'tish */}
              <Link
                to="/login?mode=register"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
              >
                <UserPlus className="h-4 w-4" />
                Ro‘yxatdan o‘tish
              </Link>
            </>
          )}
        </div>

        {/* ═══════════ Mobil tugmalar ═══════════ */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Day/Night (mobil) */}
          <button
            onClick={toggle}
            className="rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-white/5"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-amber-400" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500" />
            )}
          </button>

          {/* Hamburger tugmasi */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ═══════════ Mobil menyu ═══════════ */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-white/5 dark:bg-slate-950/95 md:hidden">
          <div className="flex flex-col gap-2">
            {/* AI Yordamchi */}
            <Link
              to="/ai-advisor"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-3 text-sm text-violet-600 dark:text-violet-300"
            >
              <Bot className="h-4 w-4" />
              AI Yordamchi
            </Link>

            {/* Tariflar */}
            <Link
              to="/pricing"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-300"
            >
              <Crown className="h-4 w-4" />
              Tariflar
            </Link>

            {user ? (
              <>
                {/* User info */}
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.username}
                      </span>
                    </div>
                    {planBadge()}
                  </div>
                </div>

                {/* Profil */}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  <Settings className="h-4 w-4" />
                  Profil
                </Link>

                {/* To'lov tarixi */}
                <Link
                  to="/payments"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  <CreditCard className="h-4 w-4" />
                  To‘lov tarixi
                </Link>

                {/* Chiqish */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300"
                >
                  <LogOut className="h-4 w-4" />
                  Chiqish
                </button>
              </>
            ) : (
              <>
                {/* Kirish */}
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  <LogIn className="h-4 w-4" />
                  Kirish
                </Link>

                {/* Ro'yxatdan o'tish */}
                <Link
                  to="/login?mode=register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  Ro‘yxatdan o‘tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}