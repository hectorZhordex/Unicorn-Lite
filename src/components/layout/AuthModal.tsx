"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, ShieldCheck } from "lucide-react";
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
  const { login, register } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // After signup — show "check your inbox" screen
  const [checkInbox, setCheckInbox] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);
  useEffect(() => {
    setError("");
    setForm({ name: "", email: "", password: "" });
    setCheckInbox(false);
    setSignupEmail("");
  }, [tab, open]);

  useEffect(() => {
    if (!forced) {
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [forced, onClose]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    if (tab === "login") {
      const res = await login(form.email, form.password);
      if (res.success) {
        toast.success("Welcome back!");
        onClose();
      } else {
        setError(res.error || "Login failed.");
      }
    } else {
      if (!form.name.trim()) { setError("Please enter your name."); setLoading(false); return; }
      const res = await register(form.name, form.email, form.password);
      if (res.success) {
        // Supabase sends a real confirmation email — just show "check inbox"
        setSignupEmail(form.email);
        setCheckInbox(true);
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
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {checkInbox ? "Check your email" : tab === "login" ? "Welcome back" : "Create account"}
                </h2>
                {forced && !checkInbox && (
                  <p className="text-xs text-text-muted mt-1">
                    Sign in or create a free account to continue
                  </p>
                )}
              </div>
              {!forced && (
                <button onClick={onClose} className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* ── Check Inbox Screen ── */}
            {checkInbox ? (
              <div className="px-6 pb-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <ShieldCheck size={28} className="text-purple-400" />
                </div>

                <div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    We sent a confirmation link to
                  </p>
                  <p className="text-sm font-semibold text-purple-300 mt-1">{signupEmail}</p>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    Click the link in the email to verify your account, then come back and sign in.
                  </p>
                </div>

                <button
                  onClick={() => { setCheckInbox(false); setTab("login"); }}
                  className="btn-primary w-full py-3 text-sm mt-2"
                >
                  Go to Sign In
                </button>

                <p className="text-xs text-slate-500">
                  Didn&apos;t receive it? Check your spam folder or{" "}
                  <button
                    type="button"
                    onClick={() => { setCheckInbox(false); setTab("signup"); }}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    try again
                  </button>
                </p>
              </div>
            ) : (
              <>
                {/* Tab switcher */}
                <div className="px-6 mb-5">
                  <div className="flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                    {(["login", "signup"] as const).map((t) => (
                      <button key={t} onClick={() => setTab(t)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={tab === t
                          ? { background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff" }
                          : { color: "#94a3b8" }}>
                        {t === "login" ? "Sign In" : "Sign Up"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                  {tab === "signup" && (
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input type="text" placeholder="Full name" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-field pl-10" required />
                    </div>
                  )}

                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input type="email" placeholder="Email address" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field pl-10" required />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder={tab === "signup" ? "Password (min 6 chars)" : "Password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input-field pl-10 pr-11" required />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {tab === "login" ? "Signing in..." : "Creating account..."}
                      </span>
                    ) : tab === "login" ? "Sign In" : "Create Account"}
                  </button>

                  <p className="text-center text-xs text-text-muted">
                    {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => setTab(tab === "login" ? "signup" : "login")}
                      className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
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
