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
    body: "By accessing or using BlueOrbit Technologies' platform, website, cloud storage services, file hosting features, or creator monetization system, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree to these terms, you may not use our services.",
  },
  {
    title: "2. Eligibility and Account Registration",
    body: "You must be at least 13 years of age to use BlueOrbit. By creating an account, you represent that all information provided is accurate and current. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. BlueOrbit is not liable for any loss or damage resulting from unauthorized access to your account.",
  },
  {
    title: "3. Acceptable Use",
    body: "You agree to use BlueOrbit only for lawful purposes and in a manner consistent with these Terms. You may not use our platform to:",
    items: [
      "Upload, store, or distribute content that violates any applicable local, national, or international law or regulation.",
      "Upload or share copyrighted material without explicit authorization from the rights holder.",
      "Distribute malware, viruses, ransomware, spyware, or any other harmful or malicious code.",
      "Engage in fraud, phishing, scams, or deceptive practices of any kind.",
      "Upload content that is defamatory, obscene, or violates the privacy or rights of any third party.",
      "Attempt to gain unauthorized access to BlueOrbit systems, infrastructure, or other user accounts.",
      "Use automated bots, scripts, or tools to generate artificial traffic or inflate download or verification statistics.",
    ],
  },
  {
    title: "4. Content Ownership and License",
    body: "You retain full ownership of all content you upload to BlueOrbit. By uploading content, you grant BlueOrbit a limited, non-exclusive, royalty-free license to store, process, display, and distribute your content as necessary to operate and provide our services. For publicly shared content, you grant BlueOrbit the right to make such content accessible to other users and visitors through platform features and shared links.",
  },
  {
    title: "5. Public File Sharing",
    body: "Files designated as public or shared via public links may be accessible to any user or visitor on or off the BlueOrbit platform. By sharing content publicly, you acknowledge and accept that:",
    items: [
      "Your files may be viewed, accessed, or downloaded by third parties.",
      "Your files may appear in platform discovery features.",
      "BlueOrbit does not guarantee the privacy or confidentiality of publicly shared content.",
      "You are solely responsible for determining whether your content is appropriate for public sharing.",
    ],
  },
  {
    title: "6. Creator Monetization System",
    body: "BlueOrbit provides a creator monetization system that allows eligible users to earn revenue when visitors access or unlock their publicly shared content through our supported verification and advertising mechanisms.",
    sub: [
      {
        label: "Eligibility",
        text: "To participate in the monetization program, users must comply with all platform policies, maintain an account in good standing, and meet any minimum traffic or engagement thresholds established by BlueOrbit.",
      },
      {
        label: "Earnings Calculation",
        text: "Earnings are calculated based on verified visitor interactions with your content. BlueOrbit reserves the right to adjust, withhold, or remove earnings in cases of invalid traffic, fraudulent activity, automated or bot-generated interactions, policy violations, or any form of abuse of the monetization system.",
      },
      {
        label: "Payouts",
        text: "Payouts are processed according to the minimum thresholds and payment schedules defined by BlueOrbit. We reserve the right to delay or withhold payouts pending fraud investigation or policy review. BlueOrbit is not liable for losses arising from delayed or withheld earnings due to policy violations or fraudulent activity.",
      },
      {
        label: "Program Changes",
        text: "BlueOrbit reserves the right to modify, suspend, or terminate the creator monetization program at any time. Participation in the program does not constitute a guaranteed income or employment relationship.",
      },
    ],
  },
  {
    title: "7. Prohibited Content",
    body: "The following types of content are strictly prohibited on BlueOrbit:",
    items: [
      "Content that infringes any intellectual property rights, including copyright, trademark, or trade secrets.",
      "Illegal content of any kind, including content that promotes or facilitates criminal activity.",
      "Adult, explicit, or sexually explicit content unless otherwise expressly permitted by BlueOrbit in writing.",
      "Content containing malware, viruses, or any software designed to damage or gain unauthorized access to systems.",
      "Content that promotes hate, discrimination, or violence against individuals or groups.",
      "Spam, deceptive links, or misleading content designed to manipulate users.",
    ],
    footer: "BlueOrbit reserves the right to remove any content that violates these prohibitions without prior notice.",
  },
  {
    title: "8. Account Suspension and Termination",
    body: "BlueOrbit reserves the right to suspend, restrict, or permanently terminate any account that violates these Terms and Conditions, engages in fraudulent or abusive behavior, generates invalid traffic, or poses a risk to the security or integrity of our platform or other users. Upon termination, access to your account and stored files will be removed. Earnings associated with terminated accounts may be forfeited in cases of policy violations.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, BlueOrbit Technologies shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from your use of or inability to use our services. This includes, but is not limited to, loss of data, loss of earnings, or service interruptions. You are solely responsible for maintaining backups of any important content stored on the platform.",
  },
  {
    title: "10. Service Availability",
    body: "BlueOrbit strives to maintain continuous and reliable service availability. However, we do not guarantee uninterrupted access and may perform scheduled or emergency maintenance, upgrades, or modifications without prior notice. BlueOrbit is not liable for any loss or inconvenience arising from temporary service unavailability.",
  },
  {
    title: "11. Intellectual Property",
    body: "All platform software, design elements, trademarks, logos, and proprietary technology associated with BlueOrbit Technologies are the exclusive property of BlueOrbit and are protected by applicable intellectual property laws. You may not reproduce, copy, or use any BlueOrbit intellectual property without express written permission.",
  },
  {
    title: "12. Changes to Terms",
    body: "BlueOrbit may modify these Terms and Conditions at any time. Updated terms will be posted on this page with a revised effective date. Your continued use of the platform after changes are posted constitutes your acceptance of the updated Terms and Conditions.",
  },
  {
    title: "13. Governing Law",
    body: "These Terms and Conditions are governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in the United States.",
  },
  {
    title: "14. Contact Information",
    body: "For questions, concerns, or legal inquiries regarding these Terms and Conditions, please contact BlueOrbit Technologies through the official support channels provided on our website.",
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
                These Terms and Conditions govern your use of BlueOrbit Technologies' cloud storage, file hosting, content sharing, and creator monetization platform. Please read them carefully before using our services.
              </p>

              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{s.title}</h3>
                  <p className="text-text-secondary mb-2">{s.body}</p>
                  {"items" in s && s.items && (
                    <ul className="space-y-1.5 pl-3 mb-2">
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
                  {"footer" in s && s.footer && (
                    <p className="text-text-muted text-sm mt-2 italic">{s.footer}</p>
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
