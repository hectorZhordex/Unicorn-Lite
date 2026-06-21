"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AboutModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: "rgba(5,5,16,0.88)", backdropFilter: "blur(12px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-2xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "rgba(13,13,26,0.98)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 flex-shrink-0">
              <div>
                <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase">Company</p>
                <h2 className="text-lg font-bold text-white mt-0.5">About Us</h2>
              </div>
              <button onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-6 py-6">
              <article className="space-y-5 text-[15px] leading-relaxed text-slate-300">
                <p className="text-white font-semibold text-base">Welcome to BlueOrbit Technologies</p>

                <p>BlueOrbit Technologies is a U.S.-based cloud storage, file hosting, and digital content distribution platform built for individuals, creators, and businesses worldwide. We provide secure, scalable, and high-performance cloud infrastructure that enables users to upload, store, organize, and share digital files from anywhere in the world.</p>

                <p>Our platform is designed to make cloud storage accessible, fast, and reliable. Whether you are an individual looking for a secure place to store your files, a creator distributing digital content to a global audience, or a business requiring dependable cloud infrastructure, BlueOrbit is built to meet your needs.</p>

                <p>BlueOrbit supports both public and private file hosting. Public files can be shared through unique links and discovered by other users on the platform. Private files remain restricted to the account holder, protected by our secure cloud infrastructure and access controls.</p>

                <p>One of the core features of BlueOrbit is our creator monetization system. Creators who upload and share content publicly can earn revenue when visitors access or unlock their files through our platform&apos;s supported advertising and verification mechanisms. Our reward system is designed to fairly compensate content creators for the traffic and engagement their uploads generate.</p>

                <p>We are committed to maintaining a secure, transparent, and trustworthy environment for all users. Our infrastructure is built on modern cloud technologies designed for high availability, data integrity, and performance. We continuously invest in improving our platform, expanding our services, and supporting our growing global community of creators and users.</p>

                <p>BlueOrbit Technologies operates under U.S. law and maintains compliance with applicable regulations governing cloud services, data privacy, and digital content distribution.</p>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-white font-semibold">BlueOrbit Technologies</p>
                  <p className="text-slate-500">Powering Your Digital Universe.</p>
                </div>
              </article>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
