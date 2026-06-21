import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | BlueOrbit Technologies",
  description:
    "Learn how BlueOrbit Technologies collects, uses, stores, and protects your personal information when you use our cloud storage and file hosting platform.",
  openGraph: {
    title: "Privacy Policy | BlueOrbit Technologies",
    description:
      "BlueOrbit Technologies Privacy Policy — data collection, usage, storage, sharing, and your rights as a user.",
    type: "website",
  },
};

/* ── Shared content (same data as PrivacyModal SECTIONS) ── */
const SECTIONS = [
  {
    title: "1. Introduction",
    body: 'BlueOrbit Technologies ("BlueOrbit," "we," "our," or "us") is committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains how we collect, use, store, share, and protect your information when you use our cloud storage, file hosting, content sharing, and creator monetization platform. By using BlueOrbit services, you agree to the practices described in this Privacy Policy.',
  },
  {
    title: "2. Information We Collect",
    body: "We collect the following types of information:",
    items: [
      "Account Information: Your name, email address, username, and login credentials when you create an account.",
      "Uploaded Content: Files, documents, images, videos, and any other data you upload or store on our platform.",
      "Usage Data: Information about how you interact with our services, including IP address, device type, browser type, pages visited, file access events, and timestamps.",
      "Payment and Earnings Information: Billing details, payout preferences, transaction history, and earnings data for users participating in our creator monetization system.",
      "Verification and Traffic Data: Data collected through our visitor unlock and verification system, including completion events, session identifiers, and referral information used for fraud prevention and earnings validation.",
      "Cookies and Tracking Data: Information collected through cookies, pixels, and similar technologies for session management, analytics, and advertising purposes.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: "We use collected data to:",
    items: [
      "Provide, operate, and maintain our cloud storage and file hosting services.",
      "Enable public and private file sharing features.",
      "Process and manage creator earnings, payouts, and monetization activities.",
      "Detect and prevent fraud, invalid traffic, automated abuse, and policy violations.",
      "Analyze platform performance and improve user experience.",
      "Comply with legal obligations and enforce our Terms and Conditions.",
      "Communicate with users regarding account activity, earnings updates, and platform announcements.",
    ],
  },
  {
    title: "4. Public and Private File Storage",
    body: "BlueOrbit offers both public and private storage options.",
    sub: [
      {
        label: "Public Files",
        text: "Files uploaded to public storage areas or shared via public links may be accessible to any visitor on or off the platform. Public files may appear in platform discovery features and search results. Users who share files publicly accept that their content may be viewed, accessed, or downloaded by third parties. You are solely responsible for ensuring that publicly shared content does not contain sensitive, confidential, or proprietary information.",
      },
      {
        label: "Private Files",
        text: "Files designated as private are restricted to your account and authorized users only. BlueOrbit implements security controls to protect private files, but no system can be guaranteed to be completely secure. You are responsible for maintaining the confidentiality of your account credentials.",
      },
    ],
  },
  {
    title: "5. Creator Monetization and Earnings Data",
    body: "If you participate in our creator monetization program, we collect and process additional data including traffic volume, verification completion rates, earnings calculations, payout eligibility status, and payment method details. This data is used to calculate and process earnings, detect fraudulent or invalid activity, and maintain the integrity of the monetization system. Earnings data may be reviewed by our trust and safety team as part of fraud prevention operations.",
  },
  {
    title: "6. Cookies and Advertising",
    body: "BlueOrbit uses cookies and similar tracking technologies to manage user sessions, analyze platform traffic, serve advertising through our verification and unlock system, and improve service quality. Our advertising partners and verification providers may independently collect data according to their own privacy policies. You may disable cookies through your browser settings, though this may affect certain platform features.",
  },
  {
    title: "7. Data Sharing",
    body: "We do not sell your personal information. We may share limited data only in the following circumstances:",
    items: [
      "With service providers who assist in operating our platform, including cloud infrastructure, payment processing, and analytics providers.",
      "With advertising and verification partners who operate through our content unlock system.",
      "To comply with applicable laws, regulations, or government requests.",
      "To investigate, prevent, or address fraud, security incidents, or policy violations.",
      "In connection with a merger, acquisition, or sale of company assets, with appropriate confidentiality protections.",
    ],
  },
  {
    title: "8. Data Security",
    body: "BlueOrbit implements industry-standard security measures to protect your data, including encrypted connections, secure server infrastructure, and access controls. However, no method of internet transmission or electronic storage is completely secure, and we cannot guarantee absolute security of your data.",
  },
  {
    title: "9. Data Retention",
    body: "We retain your data for as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce our agreements. Upon account deletion, we will remove your personal data within a reasonable timeframe, subject to applicable legal retention requirements. Uploaded content will be permanently deleted upon account closure or upon your explicit request.",
  },
  {
    title: "10. Your Rights",
    body: "Depending on your location, you may have the following rights regarding your personal information:",
    items: [
      "Access and review the personal data we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of your personal data and account.",
      "Object to or restrict certain types of data processing.",
      "Request a portable copy of your data.",
    ],
    footer: "To exercise any of these rights, please contact us through our official support channels.",
  },
  {
    title: "11. Children's Privacy",
    body: "BlueOrbit is not directed toward individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take immediate steps to delete it.",
  },
  {
    title: "12. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time to reflect changes in our services, legal obligations, or industry practices. Updated versions will be posted on this page with a revised effective date. Continued use of our platform after changes are posted constitutes your acceptance of the updated policy.",
  },
  {
    title: "13. Contact Us",
    body: "If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact BlueOrbit Technologies through our official support channels available on our website.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ background: "rgb(8,8,20)" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 sm:px-8 py-4 border-b border-white/5"
        style={{ background: "rgba(8,8,20,0.95)", backdropFilter: "blur(12px)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-purple-400 uppercase mb-3">
            Legal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">Last Updated: June 18, 2026</p>
          <div className="h-px bg-white/5 mt-6" />
        </div>

        {/* Intro */}
        <p className="text-slate-400 text-[15px] leading-relaxed mb-10">
          BlueOrbit Technologies is committed to protecting your privacy. This policy applies
          to our cloud storage, file hosting, content sharing, and creator monetization
          services.
        </p>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-semibold text-white mb-2">{s.title}</h2>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-3">{s.body}</p>

              {"items" in s && s.items && (
                <ul className="space-y-2 mb-3">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-slate-400 text-[15px] leading-relaxed"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                        style={{ background: "#7c3aed" }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {"sub" in s && s.sub && (
                <div className="mt-3 space-y-4">
                  {s.sub.map((sub) => (
                    <div key={sub.label} className="pl-4 border-l-2 border-purple-500/30">
                      <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">
                        {sub.label}
                      </p>
                      <p className="text-slate-400 text-[15px] leading-relaxed">{sub.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {"footer" in s && s.footer && (
                <p className="text-slate-500 text-sm mt-3">{s.footer}</p>
              )}
            </section>
          ))}
        </div>

        {/* Related links */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 text-sm">
          <Link href="/about" className="text-purple-400 hover:text-purple-300 transition-colors">
            About Us →
          </Link>
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
