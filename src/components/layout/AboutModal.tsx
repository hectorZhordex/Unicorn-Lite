"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, MailCheck, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  forced?: boolean;
}

export default function AuthModal({ open, onClose, defaultTab = "login", forced = false }: Props) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // After successful signup, show the "check your email" screen
  const [emailSentTo, setEmailSentTo] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const { login, register } = useAuthStore();

  // ── Sync tab with prop ────────────────────────────────────────────────────
  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  // ── Reset on open/close or tab change ────────────────────────────────────
  useEffect(() => {
    setError("");
    setForm({ name: "", email: "", password: "" });
    setEmailSentTo(null);
    setShowPw(false);
  }, [tab, open]);

  // ── ESC to close ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (forced) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [forced, onClose]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (tab === "login") {
      const res = await login(form.email, form.password);
      if (res.success) {
        toast.success("Welcome back!");
        onClose();
      } else {
        setError(res.error || "Login failed.");
      }
    } else {
      // Sign up → Supabase sends real verification email
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        // Show "check your inbox" screen
        setEmailSentTo(form.email);
      } else {
        setError(res.error || "Registration failed.");
      }
    }

    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(5,5,16,0.92)", backdropFilter: "blur(12px)" }}
          onClick={(e) => { if (!forced && e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,13,26,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >

            {/* ══════════════════════════════════════════════════════════════
                CHECK YOUR EMAIL SCREEN
                Shown after a successful signUp call.
            ══════════════════════════════════════════════════════════════ */}
            {emailSentTo ? (
              <div className="px-6 py-8 flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 14, stiffness: 260 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(59,130,246,0.2))",
                    border: "1px solid rgba(124,58,237,0.4)",
                  }}
                >
                  <MailCheck size={30} className="text-purple-400" />
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Check your inbox</h2>
                  <p className="text-sm text-slate-400">We sent a verification link to</p>
                  <p className="text-sm font-semibold text-purple-300 mt-0.5">{emailSentTo}</p>
                </div>

                {/* Steps */}
                <div
                  className="w-full rounded-xl p-4 text-left space-y-3 mt-1"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {[
                    { n: "1", text: "Open the email from us" },
                    { n: "2", text: 'Click "Confirm your email"' },
                    { n: "3", text: "Come back here and sign in" },
                  ].map(({ n, text }) => (
                    <div key={n} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff" }}
                      >
                        {n}
                      </div>
                      <p className="text-sm text-slate-300">{text}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500">
                  Can&apos;t find it? Check your spam folder.
                </p>

                {/* Back to Sign In */}
                <button
                  onClick={() => { setEmailSentTo(null); setTab("login"); }}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium mt-1"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </button>

                {!forced && (
                  <button
                    onClick={onClose}
                    className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>

            ) : (
              <>
                {/* ── Header ───────────────────────────────────────────── */}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {tab === "login" ? "Welcome back" : "Create account"}
                    </h2>
                    {forced && (
                      <p className="text-xs text-text-muted mt-1">
                        Sign in or create a free account to continue
                      </p>
                    )}
                  </div>
                  {!forced && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* ── Tab switcher ─────────────────────────────────────── */}
                <div className="px-6 mb-5">
                  <div className="flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                    {(["login", "signup"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={
                          tab === t
                            ? { background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff" }
                            : { color: "#94a3b8" }
                        }
                      >
                        {t === "login" ? "Sign In" : "Sign Up"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Form ─────────────────────────────────────────────── */}
                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                  {tab === "signup" && (
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field pl-10"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder={tab === "signup" ? "Password (min 6 chars)" : "Password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input-field pl-10 pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {error && (
                    <div
                      className="px-3 py-2 rounded-xl text-xs text-red-300"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {tab === "login" ? "Signing in…" : "Creating account…"}
                      </span>
                    ) : tab === "login" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {tab === "signup" && (
                    <p className="text-center text-xs text-slate-500">
                      A verification email will be sent to your inbox.
                    </p>
                  )}

                  <p className="text-center text-xs text-text-muted">
                    {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => setTab(tab === "login" ? "signup" : "login")}
                      className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      {tab === "login" ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
