"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Menu, X, LogOut, ChevronDown, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/lib/settings-store";
import { useAuthStore } from "@/lib/auth-store";
import PrivacyModal from "./PrivacyModal";
import AboutModal from "./AboutModal";
import TermsModal from "./TermsModal";
import AuthModal from "./AuthModal";
import UserUploadModal from "@/components/upload/UserUploadModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { settings } = useSettingsStore();
  const { currentUser, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setAuthOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn("fixed top-0 left-0 right-0 z-40 transition-all duration-300", scrolled ? "py-3" : "py-5 bg-transparent")}
        style={scrolled ? { background: "rgba(5,5,16,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" } : {}}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={!settings.logoImage ? { background: "linear-gradient(135deg, #7c3aed, #3b82f6)" } : {}}>
              {settings.logoImage
                ? <Image src={settings.logoImage} alt="Logo" width={36} height={36} className="w-full h-full object-cover" />
                : <Layers size={18} className="text-white" />}
            </div>
            <span className="text-xl font-bold text-white">{settings.logoText}</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/#artworks" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Browse</Link>
            <Link href="/#categories" className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Categories</Link>
            <button onClick={() => setAboutOpen(true)} className="text-text-secondary hover:text-white transition-colors text-sm font-medium">About Us</button>
            <button onClick={() => setTermsOpen(true)} className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Terms</button>
            <button onClick={() => setPrivacyOpen(true)} className="text-text-secondary hover:text-white transition-colors text-sm font-medium">Privacy Policy</button>
          </div>

          {/* Right — Auth */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setUploadOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}
                >
                  <Upload size={14} />
                  Upload
                </button>
                <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all text-white"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                  <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
                      style={{ background: "rgba(13,13,26,0.98)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
                    >
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-text-muted truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </div>
            ) : (
              <>
                <button onClick={() => openAuth("login")}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  Sign In
                </button>
                <button onClick={() => openAuth("signup")}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors">
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
                {[["Browse", "/#artworks"], ["Categories", "/#categories"]].map(([label, href]) => (
                  <Link key={label} href={href} onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-sm">
                    {label}
                  </Link>
                ))}
                {[["About Us", () => { setAboutOpen(true); setMobileOpen(false); }],
                  ["Terms", () => { setTermsOpen(true); setMobileOpen(false); }],
                  ["Privacy Policy", () => { setPrivacyOpen(true); setMobileOpen(false); }]
                ].map(([label, fn]) => (
                  <button key={label as string} onClick={fn as () => void}
                    className="px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-medium text-sm text-left">
                    {label as string}
                  </button>
                ))}
                <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2">
                  {currentUser ? (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { setUploadOpen(true); setMobileOpen(false); }}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}
                      >
                        <Upload size={15} />Upload a File
                      </button>
                      <div className="px-4 py-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-white">{currentUser.name}</p>
                          <p className="text-xs text-text-muted">{currentUser.email}</p>
                        </div>
                        <button onClick={() => { logout(); setMobileOpen(false); }}
                          className="text-red-400 text-sm flex items-center gap-1">
                          <LogOut size={14} />Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => openAuth("login")}
                        className="px-4 py-3 rounded-xl text-center text-sm font-medium text-white hover:bg-white/5 transition-colors border border-white/10">
                        Sign In
                      </button>
                      <button onClick={() => openAuth("signup")}
                        className="px-4 py-3 rounded-xl text-center text-sm font-semibold text-white transition-all"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
                        Sign Up Free
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Modals */}
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
      <UserUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <UserUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
