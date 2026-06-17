"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/artwork/HeroSection";
import CategoryFilter from "@/components/artwork/CategoryFilter";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import { type Artwork } from "@/types";
import { ChevronDown, TrendingUp, Sparkles } from "lucide-react";

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
    "3D Mockup Collection", "Digital Art Prints", "Font Pack Premium"
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

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("category");
    if (q) setSearchQuery(q);
    if (cat) setCategory(cat);
  }, [searchParams]);

  const filtered = MOCK_ARTWORKS.filter((a) => {
    const matchCategory = category === "all" || a.category_id === category;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const trending = [...MOCK_ARTWORKS].sort((a, b) => b.downloads - a.downloads).slice(0, 6);
  const visible = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayCount((c) => c + PAGE_SIZE);
      setLoading(false);
    }, 600);
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

      <HeroSection onSearch={handleSearch} totalArtworks={MOCK_ARTWORKS.length} />

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
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : category === "all"
                ? "All Artworks"
                : category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")}
            </h2>
            <span className="text-sm text-text-muted">({filtered.length})</span>
          </div>
        </div>

        <ArtworkGrid artworks={visible} loading={loading && displayCount === PAGE_SIZE} />

        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn-secondary px-8 py-3 flex items-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                <>
                  <ChevronDown size={18} />
                  Load More ({filtered.length - displayCount} remaining)
                </>
              )}
            </button>
          </motion.div>
        )}
      </section>

      <Footer />
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
