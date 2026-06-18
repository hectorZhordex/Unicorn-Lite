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
    title: "1. Introduction",
    body: "This Privacy Policy explains how we collect, use, store, and protect your information when you use our website, cloud storage platform, and related services. By using BlueOrbit services, you agree to the practices described in this Privacy Policy.",
  },
  {
    title: "2. Information We Collect",
    body: "We may collect the following types of information:",
    items: [
      "Account Information: Name, email address, and login credentials.",
      "Uploaded Content: Files, documents, images, and other data you upload to our cloud platform.",
      "Usage Data: Information about how you interact with our services (e.g., log data, IP address, device type, browser type).",
      "Payment Information: If you subscribe to paid plans, billing details may be collected through secure third-party payment providers.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: "We use collected data to:",
    items: [
      "Provide and maintain cloud storage services.",
      "Enable public and private file storage features.",
      "Process transactions and manage subscriptions.",
      "Improve platform performance and user experience.",
      "Ensure security, prevent abuse, and enforce our Terms and Conditions.",
    ],
  },
  {
    title: "4. Public and Private Storage",
    body: "BlueOrbit offers both public and private cloud storage.",
    sub: [
      {
        label: "Public Storage (Free Users)",
        text: "Files uploaded without an active paid plan may be stored in public storage areas. By using public storage, you understand and agree that your uploaded files may be publicly accessible, your files may be searchable within the BlueOrbit platform, and other users may view, access, and download your publicly shared content. You are responsible for ensuring that you do not upload sensitive or confidential data to public storage.",
      },
      {
        label: "Private Storage (Paid Users)",
        text: "Private storage is designed for restricted access. Files stored in private areas are intended to be accessible only by you or authorized users under your account. We implement security measures to protect private data, but no system can be guaranteed 100% secure.",
      },
    ],
  },
  {
    title: "5. Data Sharing",
    body: "We do not sell your personal data. We may share limited information only with service providers (e.g., hosting, payment processing), to comply with legal obligations or government requests, or to protect the security and integrity of our platform.",
  },
  {
    title: "6. Data Security",
    body: "We use industry-standard security measures to protect your data, including encryption, secure servers, and access controls. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
  },
  {
    title: "7. Data Retention",
    body: "We retain your data for as long as necessary to provide services or comply with legal obligations. Users may request deletion of their account and associated data.",
  },
  {
    title: "8. Your Rights",
    body: "Depending on your location, you may have rights to:",
    items: [
      "Access your personal data.",
      "Request correction or deletion of your data.",
      "Object to certain types of data processing.",
      "Request data portability.",
    ],
  },
  {
    title: "9. Cookies",
    body: "BlueOrbit may use cookies and similar technologies to improve user experience, analyze traffic, and maintain session functionality. You can disable cookies in your browser settings, but some features may not function properly.",
  },
  {
    title: "10. Third-Party Services",
    body: "We may use third-party services for analytics, hosting, or payments. These providers may collect limited information necessary to perform their services.",
  },
  {
    title: "11. Children's Privacy",
    body: "BlueOrbit does not knowingly collect data from children under the age of 13. If we become aware of such data, we will take steps to delete it.",
  },
  {
    title: "12. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.",
  },
  {
    title: "13. Contact Us",
    body: "If you have questions about this Privacy Policy, please contact BlueOrbit Technologies through our official support channels.",
  },
];

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
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">Privacy Policy</h2>
                <p className="text-xs text-text-muted mt-0.5">Last Updated: June 18, 2026</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5 text-sm leading-relaxed"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a55 transparent" }}>

              <p className="text-text-muted">
                BlueOrbit Technologies ("BlueOrbit," "we," "our," or "us") is committed to protecting your privacy and handling your data in a transparent and secure manner.
              </p>

              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-text-secondary mb-2">{s.body}</p>
                  {"items" in s && s.items && (
                    <ul className="space-y-1 pl-3">
                      {s.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-text-muted">
                          <span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {"sub" in s && s.sub && (
                    <div className="mt-2 space-y-3">
                      {s.sub.map((sub) => (
                        <div key={sub.label} className="pl-4 border-l border-white/10">
                          <p className="text-xs font-semibold text-text-primary mb-1 uppercase tracking-wide">{sub.label}</p>
                          <p className="text-text-muted">{sub.text}</p>
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
