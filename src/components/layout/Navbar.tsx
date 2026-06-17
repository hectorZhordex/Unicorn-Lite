"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Menu, X, FileText } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/lib/settings-store";
import PrivacyModal from "./PrivacyModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const { settings } = useSettingsStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "py-3"
            : "py-5 bg-transparent"
        )}
        style={scrolled ? {
          background: "rgba(5,5,16,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        } : {}}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={!settings.logoImage ? { background: "linear-gradient(135deg, #7c3aed, #3b82f6)" } : {}}
            >
              {settings.logoImage ? (
                <Image src={settings.logoImage} alt="Logo" width={36} height={36} className="w-full h-full object-cover" />
              ) : (
                <Layers size={18} className="text-white" />
              )}
            </div>
            <span className="text-xl font-bold text-white">
              {settings.logoText}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#artworks" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">
              Browse
            </Link>
            <Link href="/#categories" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">
              Categories
            </Link>
            <Link href="/#trending" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">
              Trending
            </Link>
          </div>

          {/* Right — Privacy Policy button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all text-text-secondary hover:text-white hover:bg-white/5"
            >
              <FileText size={15} />
              Privacy Policy
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5"
              style={{ background: "rgba(5,5,16,0.97)", backdropFilter: "blur(20px)" }}
            >
              <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
                {[
                  ["Browse", "/#artworks"],
                  ["Categories", "/#categories"],
                  ["Trending", "/#trending"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    {label}
                  </Link>
                ))}
                <button
                  onClick={() => { setMobileOpen(false); setPrivacyOpen(true); }}
                  className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-sm text-left flex items-center gap-2"
                >
                  <FileText size={15} />
                  Privacy Policy
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Privacy Modal */}
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
}
