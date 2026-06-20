"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, User, Mail, Lock, ShieldCheck, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
  forced?: boolean;
}

// ─── Helper: generate a random 6-digit OTP ───────────────────────────────────
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function AuthModal({ open, onClose, defaultTab = "login", forced = false }: Props) {
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, validateNewUser, register } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  // ── Email-verification OTP state ──────────────────────────────────────────
  const [verifyStep, setVerifyStep] = useState(false);          // show OTP screen?
  const [otp, setOtp] = useState("");                           // generated code
  const [otpInput, setOtpInput] = useState("");                 // user's typed code
  const [pendingUser, setPendingUser] = useState<{ name: string; email: string; password: string } | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);      // seconds left before resend allowed
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Reset everything when modal opens/closes or tab switches ─────────────
  useEffect(() => {
    setError("");
    setForm({ name: "", email: "", password: "" });
    setVerifyStep(false);
    setOtp("");
    setOtpInput("");
    setPendingUser(null);
    setResendCooldown(0);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
  }, [tab, open]);

  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  // ── ESC to close ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (forced) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [forced, onClose]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── Start resend cooldown (60 s) ─────────────────────────────────────────
  const startCooldown = () => {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  // ── Send (or resend) the OTP ─────────────────────────────────────────────
  const sendOtp = (email: string): string => {
    const code = generateOtp();
    setOtp(code);
    setOtpInput("");
    setError("");

    // In a real app you would call your email API here.
    // Since this project uses localStorage only, we show the code in a toast.
    toast(
      (t) => (
        <div>
          <p className="font-semibold text-sm">📧 Verification email sent to</p>
          <p className="text-xs text-slate-400 mt-0.5">{email}</p>
          <p className="mt-2 text-xs text-slate-300">
            Your code: <span className="font-mono font-bold text-purple-300 text-base">{code}</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1">(Shown here because no email backend is connected)</p>
        </div>
      ),
      { duration: 20000 }
    );

    startCooldown();
    return code;
  };

  // ── Form submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));

    if (tab === "login") {
      // ── Login flow (unchanged) ────────────────────────────────────────────
      const res = login(form.email, form.password);
      if (res.success) {
        toast.success("Welcome back!");
        onClose();
      } else {
        setError(res.error || "Login failed.");
      }
    } else {
      // ── Signup: validate first WITHOUT creating the account ───────────────
      const validation = validateNewUser(form.name, form.email, form.password);
      if (!validation.success) {
        setError(validation.error || "Invalid details.");
        setLoading(false);
        return;
      }

      // Store pending registration data, then show OTP screen
      setPendingUser({ name: form.name, email: form.email, password: form.password });
      sendOtp(form.email);
      setVerifyStep(true);
    }

    setLoading(false);
  };

  // ── OTP submit ────────────────────────────────────────────────────────────
  const handleVerifyOtp = () => {
    if (!pendingUser) return;
    if (otpInput.trim() !== otp) {
      setError("Incorrect code. Please check your email and try again.");
      return;
    }

    // OTP is correct → create the account now
    const res = register(pendingUser.name, pendingUser.email, pendingUser.password);
    if (res.success) {
      toast.success("✅ Email verified! Welcome aboard 🎉");
      onClose();
    } else {
      setError(res.error || "Registration failed. Please try again.");
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = () => {
    if (!pendingUser || resendCooldown > 0) return;
    const newCode = sendOtp(pendingUser.email);
    setOtp(newCode);
    toast.success("New code sent!");
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
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {verifyStep
                    ? "Verify your email"
                    : tab === "login"
                    ? "Welcome back"
                    : "Create account"}
                </h2>
                {forced && !verifyStep && (
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

            {/* ══════════════════════════════════════════════════════════════
                OTP VERIFICATION SCREEN
            ══════════════════════════════════════════════════════════════ */}
            {verifyStep ? (
              <div className="px-6 pb-6 space-y-5">
                {/* Icon + description */}
                <div className="flex flex-col items-center gap-2 py-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 14, stiffness: 260 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.35)",
                    }}
                  >
                    <ShieldCheck size={26} className="text-purple-400" />
                  </motion.div>
                  <p className="text-sm font-medium text-white text-center">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm text-purple-300 font-semibold">{pendingUser?.email}</p>
                  <p className="text-xs text-slate-500 text-center mt-1">
                    Enter the code below to activate your account.
                  </p>
                </div>

                {/* OTP input */}
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="• • • • • •"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter" && otpInput.length === 6) handleVerifyOtp(); }}
                    className="input-field text-center tracking-[0.5em] text-xl font-bold py-4"
                    autoFocus
                    autoComplete="one-time-code"
                  />
                </div>

                {error && <p className="text-red-400 text-xs px-1 text-center">{error}</p>}

                {/* Verify button */}
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpInput.length !== 6}
                  className="btn-primary w-full py-3.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Verify & Create Account
                </button>

                {/* Resend */}
                <p className="text-center text-xs text-text-muted">
                  Didn&apos;t receive it?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-slate-500">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-purple-400 hover:text-purple-300 font-medium transition-colors inline-flex items-center gap-1"
                    >
                      <RefreshCw size={11} />
                      Resend code
                    </button>
                  )}
                </p>

                {/* Back to signup */}
                <p className="text-center text-xs text-text-muted">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => { setVerifyStep(false); setPendingUser(null); setOtp(""); setOtpInput(""); setError(""); }}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Go back
                  </button>
                </p>
              </div>
            ) : (
              <>
                {/* ── Tab switcher ────────────────────────────────────────── */}
                <div className="px-6 mb-5">
                  <div className="flex rounded-xl p-1" style={{ background: "rgba(255,255,255,0.05)" }}>
                    {(["login", "signup"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                        style={
                          tab === t
                            ? { background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff" }
                            : { color: "#94a3b8" }
                        }
                      >
                        {t === "login" ? "Sign In" : "Sign Up"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Form ────────────────────────────────────────────────── */}
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

                  {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3.5 text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {tab === "login" ? "Signing in…" : "Checking details…"}
                      </span>
                    ) : tab === "login" ? (
                      "Sign In"
                    ) : (
                      "Continue →"
                    )}
                  </button>

                  {tab === "signup" && (
                    <p className="text-center text-xs text-text-muted">
                      You&apos;ll receive a verification code via email.
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
