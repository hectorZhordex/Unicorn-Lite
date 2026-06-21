import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | BlueOrbit Technologies",
  description:
    "BlueOrbit Technologies is a U.S.-based cloud storage, file hosting, and digital content distribution platform built for individuals, creators, and businesses worldwide.",
  openGraph: {
    title: "About Us | BlueOrbit Technologies",
    description:
      "Learn about BlueOrbit Technologies — secure cloud storage, file hosting, and creator monetization for individuals and businesses worldwide.",
    type: "website",
  },
};

export default function AboutPage() {
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
            Company
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">About Us</h1>
          <div className="h-px bg-white/5" />
        </div>

        {/* Content */}
        <article className="space-y-6 text-[15px] leading-relaxed text-slate-300">
          <p className="text-white font-semibold text-lg">
            Welcome to BlueOrbit Technologies
          </p>

          <p>
            BlueOrbit Technologies is a U.S.-based cloud storage, file hosting, and digital
            content distribution platform built for individuals, creators, and businesses
            worldwide. We provide secure, scalable, and high-performance cloud infrastructure
            that enables users to upload, store, organize, and share digital files from anywhere
            in the world.
          </p>

          <p>
            Our platform is designed to make cloud storage accessible, fast, and reliable.
            Whether you are an individual looking for a secure place to store your files, a
            creator distributing digital content to a global audience, or a business requiring
            dependable cloud infrastructure, BlueOrbit is built to meet your needs.
          </p>

          <p>
            BlueOrbit supports both public and private file hosting. Public files can be shared
            through unique links and discovered by other users on the platform. Private files
            remain restricted to the account holder, protected by our secure cloud
            infrastructure and access controls.
          </p>

          <p>
            One of the core features of BlueOrbit is our creator monetization system. Creators
            who upload and share content publicly can earn revenue when visitors access or unlock
            their files through our platform&apos;s supported advertising and verification
            mechanisms. Our reward system is designed to fairly compensate content creators for
            the traffic and engagement their uploads generate.
          </p>

          <p>
            We are committed to maintaining a secure, transparent, and trustworthy environment
            for all users. Our infrastructure is built on modern cloud technologies designed for
            high availability, data integrity, and performance. We continuously invest in
            improving our platform, expanding our services, and supporting our growing global
            community of creators and users.
          </p>

          <p>
            BlueOrbit Technologies operates under U.S. law and maintains compliance with
            applicable regulations governing cloud services, data privacy, and digital content
            distribution.
          </p>

          <div className="pt-4 border-t border-white/5">
            <p className="text-white font-semibold">BlueOrbit Technologies</p>
            <p className="text-slate-500">Powering Your Digital Universe.</p>
          </div>
        </article>

        {/* Related links */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4 text-sm">
          <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
            Terms of Service →
          </Link>
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </main>
  );
}
