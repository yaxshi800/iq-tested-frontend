import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CreditCard, Phone } from "lucide-react";
import api from "../api/client";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login"); return; }

    api.get("/auth/me/")
      .then((r) => setProfile(r.data.profile))
      .finally(() => setLoading(false));
  }, [navigate]);

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await api.patch("/auth/profile/", {
        full_name: profile.full_name,
        passport_series: profile.passport_series,
        phone_number: profile.phone_number,
      });
      setProfile(res.data);
      setMessage("Saqlandi ✅");
    } catch (e) {
      setMessage("Xatolik ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-300">Yuklanmoqda...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <h1 className="mb-2 text-2xl font-bold">Shaxsiy ma’lumotlar</h1>
        <p className="mb-6 text-sm text-slate-400">
          Sertifikat olish uchun quyidagilarni to‘ldiring.
        </p>

        <div className="space-y-4">
          <Field icon={User} label="F.I.SH"
            value={profile.full_name}
            onChange={(v) => setProfile({ ...profile, full_name: v })}
            placeholder="Alisher Navoiy" />

          <Field icon={CreditCard} label="Pasport seriyasi va raqami"
            value={profile.passport_series}
            onChange={(v) => setProfile({ ...profile, passport_series: v })}
            placeholder="AA1234567" />

          <Field icon={Phone} label="Telefon raqami"
            value={profile.phone_number}
            onChange={(v) => setProfile({ ...profile, phone_number: v })}
            placeholder="+998901234567" />
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 py-3 font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>

        {profile.is_certificate_ready && (
          <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            ✅ Sertifikat olishga tayyor
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />
      </div>
    </div>
  );
}