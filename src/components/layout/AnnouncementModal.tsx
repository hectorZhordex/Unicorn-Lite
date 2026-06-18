"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/auth-store";

export default function AnnouncementModal() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (!currentUser) return;
    const key = `blueorbit_announcement_${currentUser.id}`;
    const seen = sessionStorage.getItem(key);
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleOk = () => {
    if (currentUser) {
      sessionStorage.setItem(`blueorbit_announcement_${currentUser.id}`, "seen");
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          style={{ background: "rgba(5,5,16,0.85)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,13,26,0.98)",
              border: "1px solid rgba(124,58,237,0.3)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.15)",
            }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #7c3aed, #3b82f6)" }} />

            <div className="p-7">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))", border: "1px solid rgba(124,58,237,0.3)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>

              <h2 className="text-lg font-bold text-white text-center mb-3">
                How Monetization Works
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>1</div>
                  <p className="text-sm text-text-secondary">Upload your first file to the platform to get started.</p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(59,130,246,0.3)", color: "#60a5fa" }}>2</div>
                  <p className="text-sm text-text-secondary">Once your file receives <span className="text-white font-semibold">500 visits</span>, the system automatically turns on monetization for your uploads.</p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(16,185,129,0.3)", color: "#34d399" }}>3</div>
                  <p className="text-sm text-text-secondary">Each visitor who downloads your file completes a short verification step that generates revenue for you.</p>
                </div>
              </div>

              <button
                onClick={handleOk}
                className="btn-primary w-full py-3.5 text-sm font-semibold"
              >
                Got it, let me upload
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
