"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Eye, Download, Heart, Share2,
  Tag, Monitor, FileArchive, Layers, Lock,
  CheckCircle2, Maximize2
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import VerificationModal from "@/components/verification/VerificationModal";
import { type Artwork } from "@/types";
import { formatNumber } from "@/lib/utils";

// Mock — replace with Supabase fetch
async function getArtwork(slug: string): Promise<Artwork | null> {
  const idx = parseInt(slug.split("-")[1]) - 1;
  if (isNaN(idx)) return null;
  return {
    id: `art-${idx + 1}`,
    title: [
      "Modern Brand Identity Pack", "Neon City Wallpaper", "Corporate Flyer Template",
      "Mobile App Mockup Kit", "Gradient Logo Collection", "Social Media Bundle",
    ][idx % 6],
    slug,
    description: "A comprehensive premium design resource featuring multiple variations, formats, and styles. Perfect for both personal and commercial projects. Includes fully layered PSD files, vector-based AI files, and high-resolution PNG exports. All elements are well-organized and easy to customize.",
    preview_url: `https://picsum.photos/seed/${idx + 10}/1200/800`,
    download_url: "#",
    category_id: ["logos","posters","flyers","mockups"][idx % 4],
    category: {
      id: `cat-${idx % 4}`,
      name: ["Logos","Posters","Flyers","Mockups"][idx % 4],
      slug: ["logos","posters","flyers","mockups"][idx % 4],
      created_at: new Date().toISOString(),
    },
    tags: ["design", "premium", "template", "vector", "psd", "professional"],
    resolution: "3840×2160",
    file_size: "48.5 MB",
    file_format: "PSD, AI, PNG, ZIP",
    views: Math.floor(Math.random() * 5000 + 500),
    downloads: Math.floor(Math.random() * 2000 + 100),
    is_featured: idx < 2,
    is_active: true,
    created_at: new Date(Date.now() - idx * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export default function ArtworkPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    getArtwork(slug).then((a) => {
      setArtwork(a);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-[4/3] rounded-2xl shimmer" />
            <div className="space-y-4">
              <div className="h-8 rounded-xl shimmer w-3/4" />
              <div className="h-4 rounded shimmer w-1/3" />
              <div className="h-20 rounded-xl shimmer" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl shimmer" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">Artwork not found</h1>
          <Link href="/" className="btn-primary mt-4">Go Home</Link>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Monitor, label: "Resolution", value: artwork.resolution || "4K" },
    { icon: FileArchive, label: "File Size", value: artwork.file_size || "N/A" },
    { icon: Layers, label: "Format", value: artwork.file_format || "ZIP" },
    { icon: Eye, label: "Views", value: formatNumber(artwork.views) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-text-muted mb-8"
        >
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <ArrowLeft size={15} />
            Back
          </Link>
          <span>/</span>
          {artwork.category && (
            <>
              <Link href={`/?category=${artwork.category.slug}`}
                className="hover:text-white transition-colors">{artwork.category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-primary line-clamp-1">{artwork.title}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl overflow-hidden glass-card group">
              <Image
                src={artwork.preview_url}
                alt={artwork.title}
                width={900}
                height={600}
                className="w-full object-cover"
              />
              <button
                onClick={() => setFullscreen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}
              >
                <Maximize2 size={18} className="text-white" />
              </button>
            </div>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {artwork.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Title & Category */}
            <div>
              {artwork.category && (
                <Link href={`/?category=${artwork.category.slug}`}
                  className="inline-block text-xs px-3 py-1 rounded-full mb-3 hover:opacity-80 transition-opacity"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.3)" }}>
                  {artwork.category.name}
                </Link>
              )}
              <h1 className="text-2xl font-bold text-white leading-tight mb-3">{artwork.title}</h1>
              <p className="text-text-secondary text-sm leading-relaxed">{artwork.description}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Eye size={15} />
                <span>{formatNumber(artwork.views)} views</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Download size={15} />
                <span>{formatNumber(artwork.downloads)} downloads</span>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={13} className="text-purple-400" />
                    <span className="text-xs text-text-muted font-medium">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary w-full py-4 text-base"
              >
                <Lock size={18} />
                Unlock Download
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLiked(!liked)}
                  className="btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  <Heart size={16} className={liked ? "fill-red-400 text-red-400" : ""} />
                  {liked ? "Saved" : "Save"}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                  className="btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>

            {/* Verification Info */}
            <div className="p-4 rounded-xl"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <p className="text-xs font-medium text-purple-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 size={13} />
                How to Download
              </p>
              <ol className="space-y-1">
                {["Click Unlock Download", "Visit sponsor (15 sec each)", "Complete 4 steps", "Download instantly"].map((step, i) => (
                  <li key={i} className="text-xs text-text-muted flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                      style={{ background: "rgba(124,58,237,0.3)", color: "#a78bfa" }}>{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Fullscreen Preview */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setFullscreen(false)}
        >
          <Image
            src={artwork.preview_url}
            alt={artwork.title}
            width={1400}
            height={900}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        </div>
      )}

      {/* Verification Modal */}
      {showModal && (
        <VerificationModal artwork={artwork} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
