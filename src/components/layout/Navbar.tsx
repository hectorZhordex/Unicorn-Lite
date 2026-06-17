"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Search, Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled ? "glass border-b border-border py-3" : "py-5 bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
            <Layers size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">ArtFlow</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#artworks" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Browse</Link>
          <Link href="/#categories" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Categories</Link>
          <Link href="/#trending" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Trending</Link>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5">
            <Zap size={15} />
            Admin
          </Link>
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
            className="md:hidden glass border-t border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
              <Link href="/#artworks" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium">
                Browse
              </Link>
              <Link href="/#categories" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium">
                Categories
              </Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium">
                Admin Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
