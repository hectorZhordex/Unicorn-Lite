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
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,5,16,0.88)", backdropFilter: "blur(10px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,13,26,0.97)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <h2 className="text-base font-bold text-white">About Us</h2>
              <button onClick={onClose} className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-4 text-sm text-text-secondary leading-relaxed"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a55 transparent" }}>

              <p className="text-white font-semibold text-base">Welcome to BlueOrbit Technologies.</p>

              <p>
                BlueOrbit Technologies is a U.S.-based technology company focused on delivering reliable, secure, and scalable cloud solutions for individuals, creators, and businesses worldwide. Our mission is to make cloud services accessible, affordable, and easy to use while maintaining high standards of performance and security.
              </p>

              <p>
                We provide a range of services including public cloud storage, private cloud solutions, file hosting, data management, and cloud infrastructure designed to help users store, access, and share their digital content from anywhere in the world.
              </p>

              <p>
                At BlueOrbit, we believe technology should empower people. Whether you need simple file storage, enterprise-grade cloud infrastructure, or secure data management solutions, our platform is built to support your needs with speed, reliability, and transparency.
              </p>

              <p>
                Our commitment is to continuously improve our services, maintain a secure environment, and provide dependable cloud solutions for our growing global community.
              </p>

              <div className="pt-2">
                <p className="text-white font-semibold">BlueOrbit Technologies</p>
                <p className="text-text-muted">Powering Your Digital Universe.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
              <button onClick={onClose} className="btn-primary w-full py-3 text-sm">
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
