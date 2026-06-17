"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, TrendingUp, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  onSearch?: (q: string) => void;
  totalArtworks?: number;
}

export default function HeroSection({ onSearch, totalArtworks = 2400 }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    } else {
      router.push(`/?q=${encodeURIComponent(query)}`);
    }
  };

  const stats = [
    { icon: Sparkles, label: "Premium Assets", value: `${totalArtworks.toLocaleString()}+` },
    { icon: Download, label: "Downloads", value: "120K+" },
    { icon: TrendingUp, label: "Categories", value: "8" },
  ];

  return (
    <section className="relative min-h-[65vh] flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] top-[-100px] left-[-200px]"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)" }} />
      <div className="orb w-[500px] h-[500px] top-[-50px] right-[-150px]"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)" }} />
      <div className="orb w-[300px] h-[300px] bottom-0 left-[50%]"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)", transform: "translateX(-50%)" }} />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa" }}
      >
        <Sparkles size={14} />
        Premium Design Resources — Free
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6 max-w-4xl"
      >
        Download{" "}
        <span className="gradient-text">Premium</span>
        <br />
        Design Assets
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-text-secondary max-w-xl mb-10 leading-relaxed"
      >
        Logos, mockups, PSDs, posters, flyers and more. Unlock for free with quick verification.
      </motion.p>

      {/* Search Bar */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onSubmit={handleSearch}
        className="relative w-full max-w-xl mb-12"
      >
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search logos, mockups, PSD templates..."
            className="input-field pl-12 pr-36 py-4 text-base"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
            }}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
          >
            Search
          </button>
        </div>
      </motion.form>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex items-center gap-8 flex-wrap justify-center"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <Icon size={16} className="text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">{value}</p>
              <p className="text-xs text-text-muted">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
