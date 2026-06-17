"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ open, onClose }: Props) {
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
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  <Shield size={17} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Privacy Policy</h2>
                  <p className="text-xs text-text-muted">Last Updated: June 17, 2026</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 px-6 py-6 text-sm text-text-secondary leading-relaxed space-y-5"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a55 transparent" }}>

              <p className="text-text-muted text-sm">
                Welcome to <span className="text-purple-400 font-medium">Unicorn.asso</span> ("we," "our," or "us").
                We respect your privacy and are committed to protecting any information you provide while using our website.
              </p>

              {[
                {
                  title: "1. Information We Collect",
                  content: null,
                  sub: [
                    {
                      label: "Information You Provide",
                      items: ["Name", "Email address", "Contact information", "Any information submitted through forms or communications"],
                    },
                    {
                      label: "Automatically Collected Information",
                      items: ["IP address", "Browser type", "Device information", "Pages visited", "Date and time of visits", "Referring websites"],
                    },
                  ],
                },
                {
                  title: "2. How We Use Your Information",
                  content: "We may use collected information to:",
                  items: [
                    "Provide and improve our services",
                    "Respond to inquiries and support requests",
                    "Monitor website performance and security",
                    "Prevent fraud and abuse",
                    "Comply with legal obligations",
                  ],
                },
                {
                  title: "3. Cookies",
                  content: "Unicorn.asso may use cookies and similar technologies to:",
                  items: ["Remember user preferences", "Analyze website traffic", "Improve user experience"],
                  footer: "You can disable cookies through your browser settings, though some website features may not function properly.",
                },
                {
                  title: "4. Third-Party Services",
                  content: "We may use third-party services such as:",
                  items: ["Analytics providers", "Advertising networks", "Cloud hosting providers", "Payment processors (if applicable)"],
                  footer: "These services may collect information according to their own privacy policies.",
                },
                {
                  title: "5. Data Security",
                  content: "We implement reasonable security measures to protect your information. However, no method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security.",
                },
                {
                  title: "6. Data Retention",
                  content: "We retain information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our policies.",
                },
                {
                  title: "7. Children's Privacy",
                  content: "Our website is not directed toward children under the age of 13. We do not knowingly collect personal information from children under 13.",
                },
                {
                  title: "8. Your Rights",
                  content: "Depending on your location, you may have rights regarding your personal information, including:",
                  items: [
                    "Accessing your data",
                    "Correcting inaccurate information",
                    "Requesting deletion of your data",
                    "Restricting certain processing activities",
                  ],
                  footer: "To exercise these rights, contact us using the information below.",
                },
                {
                  title: "9. Changes to This Privacy Policy",
                  content: "We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date.",
                },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="text-sm font-semibold text-white mb-2">{section.title}</h3>
                  {section.content && (
                    <p className="text-text-secondary text-sm mb-2">{section.content}</p>
                  )}
                  {"sub" in section && section.sub && section.sub.map((s) => (
                    <div key={s.label} className="mb-3">
                      <p className="text-xs font-semibold text-text-primary mb-1.5 uppercase tracking-wide">{s.label}</p>
                      <ul className="space-y-1 pl-3">
                        {s.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                            <span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {"items" in section && section.items && (
                    <ul className="space-y-1 pl-3 mb-2">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                          <span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {"footer" in section && section.footer && (
                    <p className="text-text-muted text-sm mt-2">{section.footer}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
              <button
                onClick={onClose}
                className="btn-primary w-full py-3 text-sm"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
