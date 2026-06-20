"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2, Database, Shield, Zap, Globe,
  ArrowLeft, Server, HardDrive, Star
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PLANS = [
  {
    name: "Starter Database",
    price: 250,
    highlight: false,
    badge: null,
    description: "Perfect for individuals and small projects getting started.",
    color: "#7c3aed",
    features: [
      "250 GB Database Storage",
      "5 Database Projects",
      "5 Million Records",
      "100 GB File Storage",
      "Daily Backups",
      "SSL Security",
      "Lifetime Access",
      "Basic Support",
    ],
  },
  {
    name: "Professional Database",
    price: 500,
    highlight: true,
    badge: "Most Popular",
    description: "Great for developers and growing businesses.",
    color: "#3b82f6",
    features: [
      "1 TB Database Storage",
      "25 Database Projects",
      "50 Million Records",
      "500 GB File Storage",
      "Automated Backups",
      "Advanced Security",
      "API Access",
      "Priority Support",
      "Lifetime Access",
    ],
  },
  {
    name: "Enterprise Database",
    price: 1000,
    highlight: false,
    badge: null,
    description: "For large-scale apps and enterprise-level needs.",
    color: "#06b6d4",
    features: [
      "5 TB Database Storage",
      "Unlimited Projects",
      "200 Million Records",
      "2 TB File Storage",
      "Unlimited Bandwidth",
      "Daily Backups",
      "Dedicated Resources",
      "Enterprise Security",
      "24/7 Priority Support",
      "Lifetime Access",
    ],
  },
];

const ALL_FEATURES = [
  { icon: Globe, label: "Global Cloud Infrastructure" },
  { icon: Zap, label: "High Performance" },
  { icon: Shield, label: "99.9% Uptime Guarantee" },
  { icon: Shield, label: "Secure & Encrypted Data" },
  { icon: Server, label: "Easy API Integration" },
  { icon: HardDrive, label: "No Recurring Fees" },
];

const COMPARISON = [
  { feature: "Database Storage", starter: "250 GB", pro: "1 TB", enterprise: "5 TB" },
  { feature: "Database Projects", starter: "5", pro: "25", enterprise: "Unlimited" },
  { feature: "Records", starter: "5 Million", pro: "50 Million", enterprise: "200 Million" },
  { feature: "File Storage", starter: "100 GB", pro: "500 GB", enterprise: "2 TB" },
  { feature: "Bandwidth", starter: "2 TB", pro: "10 TB", enterprise: "Unlimited" },
  { feature: "Backups", starter: "Daily", pro: "Automated", enterprise: "Daily" },
  { feature: "Security", starter: "SSL", pro: "Advanced", enterprise: "Enterprise" },
  { feature: "API Access", starter: false, pro: true, enterprise: true },
  { feature: "Priority Support", starter: false, pro: true, enterprise: true },
  { feature: "24/7 Support", starter: false, pro: false, enterprise: true },
  { feature: "Dedicated Resources", starter: false, pro: false, enterprise: true },
  { feature: "Lifetime Access", starter: true, pro: true, enterprise: true },
];

export default function DatabasePage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}>
              <Database size={14} />
              Database Lifetime Plans
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Database{" "}
              <span className="gradient-text">Lifetime Plans</span>
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto mb-6">
              One-time payment. Lifetime access. No monthly fees.
            </p>

            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))", border: "1px solid rgba(124,58,237,0.3)" }}>
              {["One-Time Payment", "No Monthly Fees", "Lifetime Access"].map((t, i) => (
                <span key={t} className="flex items-center gap-2 text-sm font-medium text-white">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-purple-400" />}
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col ${plan.highlight ? "ring-2 ring-blue-500/50" : ""}`}
                style={{
                  background: plan.highlight
                    ? "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.12))"
                    : "rgba(13,13,26,0.8)",
                  border: `1px solid ${plan.highlight ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                  boxShadow: plan.highlight ? "0 0 40px rgba(59,130,246,0.15)" : "none",
                }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-base font-semibold mb-1" style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                    style={{ background: `${plan.color}33`, border: `1px solid ${plan.color}66` }}>
                    LIFETIME PLAN
                  </div>
                  <p className="text-text-muted text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle2 size={15} style={{ color: plan.color, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelected(plan.name)}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  style={{
                    background: plan.highlight
                      ? "linear-gradient(135deg, #7c3aed, #3b82f6)"
                      : `linear-gradient(135deg, ${plan.color}aa, ${plan.color}66)`,
                    border: `1px solid ${plan.color}66`,
                    boxShadow: plan.highlight ? "0 4px 20px rgba(59,130,246,0.3)" : "none",
                  }}
                >
                  {selected === plan.name ? "Selected" : "Choose Plan"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* All Plans Include */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 mb-10"
            style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <h3 className="text-base font-semibold text-white mb-5">All plans include:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALL_FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.15)" }}>
                    <Icon size={13} className="text-purple-400" />
                  </div>
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Need custom plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-2xl p-6 mb-14"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.1))", border: "1px solid rgba(124,58,237,0.25)" }}
          >
            <h3 className="text-base font-semibold text-white mb-1">Need a custom plan?</h3>
            <p className="text-text-muted text-sm mb-4">Contact our team for custom enterprise solutions.</p>
            <button className="btn-secondary py-2.5 px-5 text-sm">Contact Us</button>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Plan Comparison</h2>
            <div className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "rgba(124,58,237,0.12)" }}>
                      <th className="text-left py-4 px-5 text-text-secondary font-medium">Feature</th>
                      {["Starter", "Professional", "Enterprise"].map((h, i) => (
                        <th key={h} className="text-center py-4 px-4 font-semibold"
                          style={{ color: [PLANS[0].color, PLANS[1].color, PLANS[2].color][i] }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature}
                        style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                        <td className="py-3.5 px-5 text-text-secondary">{row.feature}</td>
                        {[row.starter, row.pro, row.enterprise].map((val, j) => (
                          <td key={j} className="py-3.5 px-4 text-center">
                            {typeof val === "boolean" ? (
                              val
                                ? <CheckCircle2 size={16} className="mx-auto" style={{ color: [PLANS[0].color, PLANS[1].color, PLANS[2].color][j] }} />
                                : <span className="text-text-muted">—</span>
                            ) : (
                              <span className="text-white font-medium">{val}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
