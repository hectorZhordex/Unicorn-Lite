"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By using our services, website, cloud storage platform, or related products, you agree to comply with these Terms and Conditions and all applicable laws and regulations.",
  },
  {
    title: "2. User Accounts",
    body: "Users may be required to create an account to access certain features of our services. You are responsible for maintaining the security of your account credentials and all activity that occurs under your account.",
  },
  {
    title: "3. Public and Private Storage",
    body: "BlueOrbit offers both public and private cloud services.",
    sub: [
      {
        label: "Public Storage (Free Users)",
        text: "Files uploaded without an active paid storage plan may be stored in public storage areas. By uploading files without a paid plan, you acknowledge and agree that: Uploaded content may be publicly accessible. Uploaded content may appear in public search results within the BlueOrbit platform. Other users may view, access, and download publicly available files. BlueOrbit does not guarantee privacy for content uploaded to public storage. Users should not upload confidential, sensitive, personal, or proprietary information to public storage.",
      },
      {
        label: "Private Storage (Paid Plans)",
        text: "Users with eligible paid plans may access private storage features. Content stored in designated private storage areas is intended to be accessible only to authorized users, subject to the security features provided by the platform.",
      },
    ],
  },
  {
    title: "4. Prohibited Content",
    body: "Users may not upload, store, distribute, or share content that violates any applicable law, infringes copyrights, trademarks, or other intellectual property rights, contains malware, viruses, or harmful code, promotes fraud or illegal activities, or violates the privacy rights of others. BlueOrbit reserves the right to remove content that violates these terms.",
  },
  {
    title: "5. Content Ownership",
    body: "Users retain ownership of content they upload. By uploading content, you grant BlueOrbit a limited license to store, process, display, and distribute the content as necessary to provide the service. For publicly stored content, users grant BlueOrbit permission to display and make such content available through public areas of the platform.",
  },
  {
    title: "6. Service Availability",
    body: "While we strive to maintain uninterrupted service, BlueOrbit does not guarantee continuous availability and may perform maintenance, upgrades, or modifications without prior notice.",
  },
  {
    title: "7. Limitation of Liability",
    body: "BlueOrbit Technologies shall not be liable for any indirect, incidental, consequential, or special damages arising from the use of or inability to use our services. Users are solely responsible for maintaining backups of important data.",
  },
  {
    title: "8. Account Suspension",
    body: "We reserve the right to suspend or terminate accounts that violate these Terms and Conditions or engage in activities that may harm the platform, users, or our services.",
  },
  {
    title: "9. Changes to Terms",
    body: "BlueOrbit may modify these Terms and Conditions at any time. Continued use of the service after changes are posted constitutes acceptance of the updated Terms.",
  },
  {
    title: "10. Governing Law",
    body: "These Terms and Conditions shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.",
  },
  {
    title: "11. Contact Information",
    body: "For questions regarding these Terms and Conditions, please contact BlueOrbit Technologies through the contact methods provided on our website.",
  },
];

export default function TermsModal({ open, onClose }: Props) {
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
              <div>
                <h2 className="text-base font-bold text-white">Terms and Conditions</h2>
                <p className="text-xs text-text-muted mt-0.5">Last Updated: June 18, 2026</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5 text-sm leading-relaxed"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a55 transparent" }}>

              <p className="text-text-muted">
                By accessing or using BlueOrbit Technologies ("BlueOrbit," "we," "our," or "us"), you agree to be bound by these Terms and Conditions.
              </p>

              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-text-secondary">{s.body}</p>
                  {"sub" in s && s.sub && (
                    <div className="mt-3 space-y-3">
                      {s.sub.map((sub) => (
                        <div key={sub.label} className="pl-4 border-l border-white/10">
                          <p className="text-xs font-semibold text-text-primary mb-1 uppercase tracking-wide">{sub.label}</p>
                          <p className="text-text-muted text-sm">{sub.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
              <button onClick={onClose} className="btn-primary w-full py-3 text-sm">
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
