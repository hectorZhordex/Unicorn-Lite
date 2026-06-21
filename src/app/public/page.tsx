"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/artwork/HeroSection";
import CategoryFilter from "@/components/artwork/CategoryFilter";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import AuthModal from "@/components/layout/AuthModal";
import UserUploadModal from "@/components/upload/UserUploadModal";
import AnnouncementModal from "@/components/layout/AnnouncementModal";
import { type Artwork } from "@/types";
import { ChevronDown, TrendingUp, Sparkles, Upload, ArrowRight, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const GUEST_TIMEOUT = 60;
const PAGE_SIZE = 12;

function PublicContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [guestBlur, setGuestBlur] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const { currentUser } = useAuthStore();
  const timerRef = { current: null as ReturnType<typeof setTimeout> | null };

  const fetchArtworks = useCallback(async (cat: string, q: string, reset = false) => {
    if (reset) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat && cat !== "all") params.set("category", cat);
      if (q) params.set("q", q);
      params.set("limit", String(PAGE_SIZE));
      params.set("offset", reset ? "0" : String(offset));

      const res = await fetch(`/api/artworks?${params.toString()}`);
      const json = await res.json();
      if (reset) { setArtworks(json.artworks || []); setOffset(PAGE_SIZE); }
      else { setArtworks((prev) => [...prev, ...(json.artworks || [])]); setOffset((o) => o + PAGE_SIZE); }
      setTotal(json.total || json.artworks?.length || 0);
    } catch {}
    finally { setLoading(false); setLoadingMore(false); }
  }, [offset]);

  useEffect(() => { setOffset(0); fetchArtworks(category, searchQuery, true); }, [category, searchQuery]); // eslint-disable-line
  useEffect(() => {
    const q = searchParams.get("q"); const cat = searchParams.get("category");
    if (q) setSearchQuery(q); if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    if (currentUser) { setGuestBlur(false); return; }
    const t = setTimeout(() => { setGuestBlur(true); setAuthOpen(true); }, GUEST_TIMEOUT * 1000);
    return () => clearTimeout(t);
  }, [currentUser]);

  const handleLoadMore = () => { setLoadingMore(true); fetchArtworks(category, searchQuery, false); };
  const handleSearch = useCallback((q: string) => { setSearchQuery(q); document.getElementById("files")?.scrollIntoView({ behavior: "smooth" }); }, []);
  const handleCategoryChange = (slug: string) => setCategory(slug);
  const handleUploadDone = () => { setUploadOpen(false); fetchArtworks(category, searchQuery, true); };

  const trending = [...artworks].sort((a, b) => b.downloads - a.downloads).slice(0, 6);
  const hasMore = artworks.length < total;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className={guestBlur && !currentUser ? "pointer-events-none select-none" : ""}
        style={guestBlur && !currentUser ? { filter: "blur(8px)", transition: "filter 0.5s ease" } : { filter: "none", transition: "filter 0.5s ease" }}>

        <HeroSection onSearch={handleSearch} totalArtworks={total || artworks.length} />

        {/* Upload Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.12))", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Upload size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {currentUser ? `Welcome, ${currentUser.name}! Share your designs.` : "Have a file to share? Upload and earn revenue."}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Files are listed anonymously. Your name is never shown publicly.</p>
              </div>
            </div>
            <button onClick={() => currentUser ? setUploadOpen(true) : setAuthOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}>
              <Upload size={15} />
              {currentUser ? "Upload File" : "Sign Up & Upload"}
              <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>

        <CategoryFilter active={category} onChange={handleCategoryChange} />

        {category === "all" && !searchQuery && trending.length > 0 && (
          <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}>
                <TrendingUp size={16} className="text-orange-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Trending Now</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>Top</span>
            </div>
            <ArtworkGrid artworks={trending} />
          </section>
        )}

        <section id="files" className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Sparkles size={16} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {searchQuery ? `Results for "${searchQuery}"` : category === "all" ? "Public Files" : category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}
              </h2>
              {!loading && <span className="text-sm text-slate-500">({total})</span>}
            </div>
            <button onClick={() => fetchArtworks(category, searchQuery, true)}
              className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>

          <ArtworkGrid artworks={artworks} loading={loading} />

          {hasMore && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
              <button onClick={handleLoadMore} disabled={loadingMore}
                className="btn-secondary px-8 py-3 flex items-center gap-2">
                {loadingMore
                  ? <><div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />Loading...</>
                  : <><ChevronDown size={18} />Load More ({total - artworks.length} remaining)</>}
              </button>
            </motion.div>
          )}

          {!loading && artworks.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-white mb-2">No files yet</h3>
              <p className="text-slate-500 text-sm">Be the first to upload a file.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />

      <AnimatePresence>
        {guestBlur && !currentUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[55]" style={{ background: "rgba(5,5,16,0.7)" }} />
        )}
      </AnimatePresence>

      <AuthModal open={authOpen}
        onClose={() => { if (currentUser) { setAuthOpen(false); setGuestBlur(false); } }}
        defaultTab="signup" forced={guestBlur && !currentUser} />
      <UserUploadModal open={uploadOpen} onClose={handleUploadDone} />
      <AnnouncementModal />
    </div>
  );
}

export default function PublicPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <PublicContent />
    </Suspense>
  );
}
