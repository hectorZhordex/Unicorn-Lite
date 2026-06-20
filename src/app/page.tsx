"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Cloud, Shield, Zap, Globe, Database, Upload,
  DollarSign, Lock, Server, ArrowRight, Check,
  Users, FileText, TrendingUp, Star, ChevronRight,
  Play, Layers
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/lib/auth-store";

function HomeContent() {
  const router = useRouter();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    if (currentUser) router.push("/dashboard");
  }, [currentUser, router]);

  const FEATURES = [
    { icon: Cloud, title: "Cloud File Storage", desc: "Store, access, and manage your files securely from anywhere in the world with our high-performance cloud infrastructure.", color: "#7c3aed" },
    { icon: Shield, title: "End-to-End Security", desc: "Your data is encrypted at rest and in transit. Private files are accessible only by you, protected by enterprise-grade security controls.", color: "#3b82f6" },
    { icon: DollarSign, title: "Creator Monetization", desc: "Upload and share files publicly. Earn revenue every time a visitor unlocks your content through our built-in verification and ad system.", color: "#10b981" },
    { icon: Globe, title: "Global CDN Delivery", desc: "Files are distributed across our global network ensuring fast access for every visitor regardless of their location.", color: "#f59e0b" },
    { icon: Database, title: "Database Hosting", desc: "Lifetime database plans with generous storage, millions of records, and full API access for your applications.", color: "#06b6d4" },
    { icon: Server, title: "Scalable Infrastructure", desc: "Built for reliability. Our platform scales automatically to handle growing traffic, storage needs, and database demands.", color: "#ec4899" },
  ];

  const STEPS = [
    { n: "01", title: "Create your account", desc: "Sign up for free in seconds. No credit card required to get started with file hosting and public sharing." },
    { n: "02", title: "Upload your files", desc: "Upload any file type — documents, designs, videos, archives. Choose public or private visibility for each file." },
    { n: "03", title: "Share and earn", desc: "Share your public files. Every time a visitor unlocks your content, you earn revenue automatically through our monetization system." },
  ];

  const STATS = [
    { value: "120K+", label: "Files Hosted" },
    { value: "8,400+", label: "Active Creators" },
    { value: "$284K+", label: "Creator Earnings" },
    { value: "99.9%", label: "Uptime" },
  ];

  const PRICING_PREVIEW = [
    { name: "Free", price: "$0", features: ["5 GB Storage", "Public File Sharing", "Basic Analytics", "Community Support"], highlight: false },
    { name: "Professional", price: "$500", period: "Lifetime", features: ["1 TB Database", "500 GB File Storage", "API Access", "Priority Support"], highlight: true },
    { name: "Enterprise", price: "$1,000", period: "Lifetime", features: ["5 TB Database", "2 TB File Storage", "Dedicated Resources", "24/7 Support"], highlight: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">
        {/* Orbs */}
        <div className="absolute top-0 left-[-20%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />
        <div className="absolute top-[-10%] right-[-15%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-[40%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-7"
            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
            <Star size={13} fill="currentColor" />
            The Cloud Platform for Creators and Businesses
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight text-white mb-6">
            Store. Share.{" "}
            <br className="hidden sm:block" />
            <span style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #34d399 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Earn.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            BlueOrbit is a U.S.-based cloud storage and creator monetization platform. Upload files, host databases, share content globally, and earn revenue — all in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/public" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 6px 30px rgba(124,58,237,0.4)" }}>
              <Upload size={18} />
              Start for Free
              <ArrowRight size={16} />
            </Link>
            <Link href="/database" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <Database size={18} />
              View Database Plans
            </Link>
          </div>

          {/* Hero visual — dashboard preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 40px 120px rgba(124,58,237,0.2), 0 0 0 1px rgba(255,255,255,0.04)" }}
          >
            {/* Fake dashboard preview */}
            <div className="bg-[#0d0d1a] p-0">
              {/* top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4 h-6 rounded-lg bg-white/5" />
              </div>
              {/* content */}
              <div className="flex">
                {/* sidebar */}
                <div className="hidden sm:block w-40 border-r border-white/5 p-3 space-y-1">
                  {["Dashboard","Files","Upload","Earnings","Analytics"].map((item, i) => (
                    <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                      style={{ background: i === 0 ? "rgba(124,58,237,0.2)" : "transparent", color: i === 0 ? "#a78bfa" : "#475569" }}>
                      <div className="w-2.5 h-2.5 rounded-sm bg-current opacity-60" />
                      {item}
                    </div>
                  ))}
                </div>
                {/* main */}
                <div className="flex-1 p-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[["1,248", "Total Files","#7c3aed"],["3,654","Downloads","#3b82f6"],["18,392","Views","#10b981"],["$1,248","Earnings","#f59e0b"]].map(([v,l,c]) => (
                      <div key={l} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="text-base font-bold" style={{ color: c as string }}>{v}</div>
                        <div className="text-xs text-slate-600">{l}</div>
                      </div>
                    ))}
                  </div>
                  {/* chart fake */}
                  <div className="h-24 rounded-xl flex items-end gap-1 p-3"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    {[40,60,45,80,55,90,75].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm"
                        style={{ height: `${h}%`, background: `linear-gradient(to top, #7c3aed, #3b82f6)`, opacity: 0.6 + i * 0.05 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Everything you need in one platform
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From secure file storage to creator monetization — BlueOrbit brings all your cloud needs under one roof.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300"
                style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 sm:px-6"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.04), rgba(59,130,246,0.04))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How it works</h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">Start earning from your files in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }, i) => (
              <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[40%] h-px"
                    style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.5), transparent)" }} />
                )}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl font-black"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
                  {n}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY / TRUST (Mega.io style) ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
              <Lock size={12} />
              Privacy First
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
              Your files, your control.
              <br />Your data stays private.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Private files are encrypted and accessible only by you. Public files are served globally through our CDN for maximum performance. You decide what's shared and what stays locked.
            </p>
            <ul className="space-y-3">
              {[
                "SSL/TLS encryption for all transfers",
                "Private files never appear in public listings",
                "Granular access controls per file",
                "Audit logs for all file access events",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.2)" }}>
                    <Check size={12} className="text-green-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative">
            <div className="rounded-2xl p-6 space-y-3"
              style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Storage Overview</p>
              {[
                { label: "Documents & Files", pct: 45, color: "#7c3aed", size: "310 GB" },
                { label: "Database Storage", pct: 20, color: "#3b82f6", size: "48 GB" },
                { label: "Shared & Public", pct: 30, color: "#10b981", size: "125 GB" },
                { label: "Backups", pct: 5, color: "#f59e0b", size: "12 GB" },
              ].map(({ label, pct, color, size }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>{label}</span><span style={{ color }}>{size}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-white/5 flex justify-between text-sm">
                <span className="text-slate-500">Total Used</span>
                <span className="text-white font-semibold">495 GB of 1 TB</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="py-20 px-4 sm:px-6"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.05), rgba(6,182,212,0.05))" }}>
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-400 text-lg">One-time payment. Lifetime access. No hidden fees.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PRICING_PREVIEW.map(({ name, price, period, features, highlight }) => (
            <motion.div key={name} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              className={`rounded-2xl p-6 flex flex-col ${highlight ? "ring-2 ring-blue-500/40" : ""}`}
              style={{
                background: highlight ? "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(124,58,237,0.1))" : "rgba(13,13,26,0.8)",
                border: highlight ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}>
              <p className="text-sm font-semibold text-slate-400 mb-1">{name}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-extrabold text-white">{price}</span>
                {period && <span className="text-xs text-slate-500 mb-1">/{period}</span>}
              </div>
              <ul className="space-y-2 mt-4 flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <Check size={12} className="text-purple-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/database"
                className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all block"
                style={highlight
                  ? { background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff" }
                  : { background: "rgba(255,255,255,0.06)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
                {name === "Free" ? "Get Started" : "View Plan"}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
              Start building on BlueOrbit today
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of creators and businesses who trust BlueOrbit for cloud storage, file hosting, and earning revenue from their content.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/public" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", boxShadow: "0 6px 30px rgba(124,58,237,0.4)" }}>
                Explore Public Files
                <ArrowRight size={16} />
              </Link>
              <Link href="/database" className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                View Database Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
