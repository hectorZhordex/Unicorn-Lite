"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/artwork/HeroSection";
import CategoryFilter from "@/components/artwork/CategoryFilter";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import AuthModal from "@/components/layout/AuthModal";
import UserUploadModal from "@/components/upload/UserUploadModal";
import { type Artwork } from "@/types";
import { ChevronDown, TrendingUp, Sparkles, Upload, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useUploadsStore } from "@/lib/uploads-store";

const GUEST_TIMEOUT = 60; // seconds before blur kicks in

const MOCK_ARTWORKS: Artwork[] = Array.from({ length: 24 }, (_, i) => ({
  id: `art-${i + 1}`,
  title: [
    "Modern Brand Identity Pack", "Neon City Wallpaper", "Corporate Flyer Template",
    "Mobile App Mockup Kit", "Gradient Logo Collection", "Social Media Bundle",
    "Dark UI Components", "Photography Poster", "Business Card Designs",
    "Instagram Story Pack", "Typography Poster Set", "Product Showcase Mockup",
    "Abstract Background Pack", "Event Flyer Design", "Icon Pack Pro",
    "Landing Page Template", "Motion Graphics Kit", "Logo Design Bundle",
    "Resume Template Pro", "Web UI Kit Dark", "Presentation Templates",
    "3D Mockup Collection", "Digital Art Prints", "Font Pack Premium",
  ][i],
  slug: `artwork-${i + 1}`,
  description: "Premium design resource with multiple formats and variations.",
  preview_url: `https://picsum.photos/seed/${i + 10}/800/600`,
  download_url: "#",
  category_id: ["logos","posters","flyers","mockups","wallpapers","social-media","psd-templates"][i % 7],
  category: {
    id: `cat-${i % 7}`,
    name: ["Logos","Posters","Flyers","Mockups","Wallpapers","Social Media","PSD Templates"][i % 7],
    slug: ["logos","posters","flyers","mockups","wallpapers","social-media","psd-templates"][i % 7],
    created_at: new Date().toISOString(),
  },
  tags: ["design", "premium", "template"],
  resolution: "3840x2160",
  file_size: `${(Math.random() * 90 + 10).toFixed(0)} MB`,
  file_format: "PSD, AI, PNG",
  views: Math.floor(Math.random() * 5000 + 500),
  downloads: Math.floor(Math.random() * 2000 + 100),
  is_featured: i < 3,
  is_active: true,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
}));

const PAGE_SIZE = 12;

function HomeContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [guestBlur, setGuestBlur] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentUser } = useAuthStore();
  const { uploads: userUploads } = useUploadsStore();

  // 1-minute guest timer
  useEffect(() => {
    if (currentUser) {
      setGuestBlur(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(() => {
      setGuestBlur(true);
      setAuthOpen(true);
    }, GUEST_TIMEOUT * 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [currentUser]);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearchQuery(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Merge user uploads with mock artworks — no username attached
  const allArtworks = [...userUploads, ...MOCK_ARTWORKS];

  const filtered = allArtworks.filter((a) => {
    const matchCategory = category === "all" || a.category_id === category;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const trending = [...allArtworks].sort((a, b) => b.downloads - a.downloads).slice(0, 6);
  const visible = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => { setDisplayCount((c) => c + PAGE_SIZE); setLoading(false); }, 600);
  };

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q);
    setDisplayCount(PAGE_SIZE);
    document.getElementById("artworks")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCategoryChange = (slug: string) => {
    setCategory(slug);
    setDisplayCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content with blur when guest timer expires */}
      <div className={guestBlur && !currentUser ? "pointer-events-none select-none" : ""}>
        <div style={guestBlur && !currentUser ? { filter: "blur(8px)", transition: "filter 0.5s ease" } : { filter: "none", transition: "filter 0.5s ease" }}>
          <HeroSection onSearch={handleSearch} totalArtworks={allArtworks.length} />

          {/* Upload Banner */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.12))", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <Upload size={18} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {currentUser ? `Welcome, ${currentUser.name}! Share your designs with the community.` : "Have a design to share? Upload your files for free."}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">Files are listed anonymously — your name is never shown publicly.</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (currentUser) {
                    setUploadOpen(true);
                  } else {
                    setAuthOpen(true);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap flex-shrink-0 transition-all"
                style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 4px 15px rgba(124,58,237,0.3)" }}
              >
                <Upload size={15} />
                {currentUser ? "Upload File" : "Sign Up & Upload"}
                <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>

          <CategoryFilter active={category} onChange={handleCategoryChange} />

          {category === "all" && !searchQuery && (
            <section id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}>
                  <TrendingUp size={16} className="text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Trending Now</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c" }}>Hot</span>
              </div>
              <ArtworkGrid artworks={trending} />
            </section>
          )}

          <section id="artworks" className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Sparkles size={16} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {searchQuery ? `Results for "${searchQuery}"` : category === "all" ? "All Files" : category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}
              </h2>
              <span className="text-sm text-text-muted">({filtered.length})</span>
            </div>

            <ArtworkGrid artworks={visible} loading={loading && displayCount === PAGE_SIZE} />

            {hasMore && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
                <button onClick={handleLoadMore} disabled={loading}
                  className="btn-secondary px-8 py-3 flex items-center gap-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <><ChevronDown size={18} />Load More ({filtered.length - displayCount} remaining)</>
                  )}
                </button>
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <Footer />

      {/* Guest timeout auth wall */}
      <AnimatePresence>
        {guestBlur && !currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[55] flex items-center justify-center"
            style={{ background: "rgba(5,5,16,0.7)", backdropFilter: "blur(4px)" }}
          />
        )}
      </AnimatePresence>

      <AuthModal
        open={authOpen}
        onClose={() => { if (currentUser) { setAuthOpen(false); setGuestBlur(false); } }}
        defaultTab="signup"
        forced={guestBlur && !currentUser}
      />
      <UserUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
