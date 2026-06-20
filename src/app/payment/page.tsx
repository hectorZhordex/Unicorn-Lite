"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CreditCard, Lock, Shield, CheckCircle2, AlertCircle, ArrowLeft, X } from "lucide-react";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get("plan") || "Professional Database";
  const price = searchParams.get("price") || "500";

  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "", email: "" });
  const [processing, setProcessing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const formatCard = (val: string) => val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  const formatExpiry = (val: string) => val.replace(/\D/g, "").replace(/^(.{2})(.*)/, "$1/$2").slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);
    setShowVerifyModal(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(5,5,16,0.95)" }}>
        <Link href="/database" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          Back to Plans
        </Link>
        <div className="flex items-center gap-2 text-sm font-medium"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", padding: "6px 14px", borderRadius: "20px" }}>
          <Lock size={13} />
          Secure Payment
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6 sticky top-8"
              style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">Order Summary</h2>

              <div className="flex items-start gap-4 pb-5 mb-5 border-b border-white/5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(59,130,246,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <Shield size={20} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{plan}</p>
                  <p className="text-xs text-slate-500 mt-0.5">BlueOrbit Technologies</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#34d399" }}>
                    Lifetime Access
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span><span>${price}.00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Processing Fee</span><span>$0.00</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax</span><span>$0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold pt-4 border-t border-white/5">
                <span className="text-white">Total</span>
                <span className="gradient-text">${price}.00</span>
              </div>

              <div className="mt-5 space-y-2">
                {["256-bit SSL Encryption", "One-time payment only", "Instant activation", "Lifetime access guaranteed"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl p-6 sm:p-8"
              style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <h1 className="text-xl font-bold text-white mb-1">Complete your purchase</h1>
              <p className="text-sm text-slate-500 mb-7">Enter your payment details below</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                  <input type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com" className="input-field" />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Card Number</label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input type="text" required value={form.card}
                      onChange={(e) => setForm({ ...form, card: formatCard(e.target.value) })}
                      placeholder="1234 5678 9012 3456" className="input-field pl-10"
                      maxLength={19} />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Cardholder Name</label>
                  <input type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe" className="input-field" />
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Expiry Date</label>
                    <input type="text" required value={form.expiry}
                      onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                      placeholder="MM/YY" className="input-field" maxLength={5} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">CVV</label>
                    <input type="text" required value={form.cvv}
                      onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      placeholder="123" className="input-field" maxLength={4} />
                  </div>
                </div>

                {/* Security badges */}
                <div className="flex items-center gap-4 py-3 px-4 rounded-xl"
                  style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                  <Lock size={14} className="text-green-400 flex-shrink-0" />
                  <p className="text-xs text-slate-400">Your payment information is encrypted with 256-bit SSL and is never stored on our servers.</p>
                </div>

                <button type="submit" disabled={processing}
                  className={`btn-primary w-full py-4 text-base font-bold ${processing ? "opacity-70 cursor-not-allowed" : ""}`}>
                  {processing ? (
                    <span className="flex items-center gap-2 justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 justify-center">
                      <Lock size={18} />
                      Pay ${price}.00 — Lifetime Access
                    </span>
                  )}
                </button>

                <p className="text-center text-xs text-slate-600">
                  By completing this purchase you agree to BlueOrbit's Terms and Conditions.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Required Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(5,5,16,0.9)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{
                background: "rgba(13,13,26,0.98)",
                border: "1px solid rgba(239,68,68,0.3)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(239,68,68,0.08)",
              }}
            >
              {/* Top bar */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #ef4444, #f97316)" }} />

              <div className="p-8 text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  <AlertCircle size={30} className="text-red-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-3">Verification Required</h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  Your payment was received, but your account requires verification before a database plan can be activated.
                </p>

                <div className="p-4 rounded-xl text-left mb-5"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    To protect our platform and ensure compliance, all database plan subscribers must complete account verification. Please contact our support team through the official BlueOrbit support channels to complete your verification and activate your plan.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Link href="/"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
                    Go to Home
                  </Link>
                  <Link href="/database"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                    <ArrowLeft size={15} />
                    Back to Plans
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
