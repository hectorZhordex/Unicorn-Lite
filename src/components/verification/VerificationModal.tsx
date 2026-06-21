"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import {
  X, ExternalLink, CheckCircle2, Circle, Clock,
  Download, Shield, Zap, ArrowRight, Lock
} from "lucide-react";
import { type Artwork } from "@/types";
import { useVerificationStore } from "@/lib/verification-store";
import { useSettingsStore } from "@/lib/settings-store";
import { VERIFICATION_STEPS, VERIFICATION_TIMER, MONETAG_SMARTLINK } from "@/lib/utils";
import { getSessionId } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

interface Props {
  artwork: Artwork;
  onClose: () => void;
}

type VerificationPhase =
  | "idle"        // waiting for user to click Visit Sponsor
  | "tab_opened"  // sponsor tab opened, timer running
  | "verifying"   // returned to tab, checking
  | "step_done";  // step passed

const REQUIRED = VERIFICATION_STEPS; // 4

export default function VerificationModal({ artwork, onClose }: Props) {
  const sessionKey = `${artwork.id}_${getSessionId()}`;
  const store = useVerificationStore();
  const { settings } = useSettingsStore();
  const adLayerEnabled = settings.adLayerEnabled ?? true;

  // If ad layer is disabled, redirect immediately on open
  useEffect(() => {
    if (!adLayerEnabled) {
      handleDownload();
      return;
    }
    store.startVerification(artwork.id, sessionKey);
  }, []); // eslint-disable-line

  const progress = store.getProgress(sessionKey);
  const unlocked = store.isUnlocked(sessionKey);

  const [phase, setPhase] = useState<VerificationPhase>("idle");
  const [timeLeft, setTimeLeft] = useState(VERIFICATION_TIMER);
  const [tabOpenedAt, setTabOpenedAt] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const focusRef = useRef(false);

  // On window focus (user returns from sponsor tab)
  const handleWindowFocus = useCallback(() => {
    if (phase !== "tab_opened" || focusRef.current) return;
    focusRef.current = true;

    const elapsed = tabOpenedAt ? (Date.now() - tabOpenedAt) / 1000 : 0;
    if (elapsed >= VERIFICATION_TIMER) {
      // Enough time spent — complete step
      setPhase("step_done");
      if (timerRef.current) clearInterval(timerRef.current);
      store.completeStep(sessionKey);
      toast.success(`Step ${progress.completed + 1}/${REQUIRED} verified! ✅`);
      setTimeout(() => {
        setPhase("idle");
        setTimeLeft(VERIFICATION_TIMER);
        focusRef.current = false;
      }, 1500);
    } else {
      // Not enough time
      setPhase("verifying");
      if (timerRef.current) clearInterval(timerRef.current);
      toast.error("You didn't spend enough time on the sponsor page. Please try again.");
      setTimeout(() => {
        setPhase("idle");
        setTimeLeft(VERIFICATION_TIMER);
        focusRef.current = false;
      }, 2000);
    }
  }, [phase, tabOpenedAt, sessionKey, progress.completed]);

  useEffect(() => {
    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [handleWindowFocus]);

  // Countdown timer when tab is open
  useEffect(() => {
    if (phase === "tab_opened") {
      setTimeLeft(VERIFICATION_TIMER);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const handleVisitSponsor = () => {
    if (phase === "tab_opened") return;
    focusRef.current = false;
    const url = MONETAG_SMARTLINK;
    window.open(url, "_blank", "noopener,noreferrer");
    setTabOpenedAt(Date.now());
    setPhase("tab_opened");
    toast("Sponsor page opened! Return here after 15 seconds.", { icon: "⏱️" });
  };

  const handleDownload = async () => {
    // Track download
    try {
      await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artwork_id: artwork.id, session_id: getSessionId() }),
      });
    } catch {}

    // Redirect to external download link (Google Drive, Dropbox, etc.)
    if (artwork.download_url && artwork.download_url !== "#") {
      toast.success("Redirecting to download...");
      setTimeout(() => {
        window.open(artwork.download_url, "_blank", "noopener,noreferrer");
      }, 400);
    } else {
      toast.error("Download link not available.");
    }
  };

  const stepProgress = (progress.completed / REQUIRED) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-backdrop flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md glass-card rounded-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-border">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Shield size={18} className="text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Unlock Download</h2>
                <p className="text-xs text-text-muted">Complete verification to access</p>
              </div>
            </div>
          </div>

          {/* Artwork Preview */}
          <div className="px-6 pt-4">
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={artwork.preview_url} alt={artwork.title} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white line-clamp-1">{artwork.title}</p>
                {artwork.category && (
                  <p className="text-xs text-purple-400">{artwork.category.name}</p>
                )}
              </div>
              <Lock size={16} className="text-text-muted flex-shrink-0" />
            </div>
          </div>

          {/* Progress */}
          <div className="px-6 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">Verification Progress</span>
              <span className="text-sm font-bold gradient-text">{progress.completed}/{REQUIRED}</span>
            </div>
            <div className="progress-bar mb-3">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${stepProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 justify-center">
              {Array.from({ length: REQUIRED }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={i < progress.completed ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    i < progress.completed
                      ? "bg-green-500/20 border border-green-500/50 text-green-400"
                      : i === progress.completed && phase === "tab_opened"
                      ? "border-2 border-purple-500 text-purple-400 animate-pulse"
                      : "bg-white/5 border border-white/10 text-text-muted"
                  }`}>
                    {i < progress.completed ? <CheckCircle2 size={16} className="text-green-400" /> : i + 1}
                  </div>
                  {i < REQUIRED - 1 && (
                    <div className={`w-6 h-0.5 rounded-full transition-all duration-300 ${i < progress.completed - 1 ? "bg-green-500/50" : "bg-white/10"}`} />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Action Area */}
          <div className="px-6 pb-6">
            {unlocked ? (
              /* UNLOCKED STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(5,150,105,0.3))", border: "1px solid rgba(16,185,129,0.4)" }}
                >
                  <CheckCircle2 size={32} className="text-green-400" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-1">Verification Complete!</h3>
                <p className="text-text-muted text-sm mb-4">Your download is ready.</p>
                <button
                  onClick={handleDownload}
                  className="btn-success w-full py-4 text-base"
                >
                  <ExternalLink size={20} />
                  Go to Download
                </button>
              </motion.div>
            ) : phase === "tab_opened" ? (
              /* TIMER STATE */
              <div className="text-center space-y-3">
                <motion.div
                  className="w-20 h-20 mx-auto rounded-full flex items-center justify-center relative"
                  style={{ background: "rgba(124,58,237,0.1)", border: "2px solid rgba(124,58,237,0.3)" }}
                >
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(124,58,237,0.2)" strokeWidth="4" />
                    <motion.circle
                      cx="40" cy="40" r="36"
                      fill="none" stroke="#7c3aed" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={2 * Math.PI * 36 * (1 - timeLeft / VERIFICATION_TIMER)}
                      strokeLinecap="round"
                      transition={{ duration: 0.5 }}
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{timeLeft}</span>
                    <span className="text-xs text-text-muted">sec</span>
                  </div>
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white">Sponsor tab is open</p>
                  <p className="text-xs text-text-muted mt-1">
                    {timeLeft > 0
                      ? `Please wait ${timeLeft} more seconds on the sponsor page`
                      : "You can return to this tab now!"}
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-center px-4 py-2 rounded-xl text-xs text-text-muted"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Clock size={12} />
                  {timeLeft > 0 ? "Stay on sponsor page..." : "Return to this tab to continue"}
                </div>
              </div>
            ) : phase === "step_done" ? (
              /* STEP DONE ANIMATION */
              <div className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-green-500/20 border border-green-500/40"
                >
                  <CheckCircle2 size={24} className="text-green-400" />
                </motion.div>
                <p className="text-green-400 font-semibold">Step verified!</p>
              </div>
            ) : (
              /* IDLE — Visit Sponsor */
              <div className="space-y-4">
                <div className="p-4 rounded-xl text-sm text-text-secondary leading-relaxed"
                  style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="flex items-start gap-2">
                    <Zap size={15} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white mb-1">How it works</p>
                      <p className="text-xs text-text-muted">
                        Visit the sponsor page, wait {VERIFICATION_TIMER} seconds, then return here.
                        Repeat {REQUIRED} times to unlock the download.
                        <br /><span className="text-purple-400 font-medium">Step {progress.completed + 1} of {REQUIRED}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleVisitSponsor}
                  className="btn-primary w-full py-4 text-base"
                >
                  <ExternalLink size={18} />
                  Visit Sponsor
                  <ArrowRight size={16} />
                </button>

                <p className="text-center text-xs text-text-muted">
                  🔒 Verification supports free content hosting
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
