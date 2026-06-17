"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Download, Lock, ArrowRight, Heart, Star } from "lucide-react";
import { type Artwork } from "@/types";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  artwork: Artwork;
  onUnlock?: (artwork: Artwork) => void;
  index?: number;
}

export default function ArtworkCard({ artwork, onUnlock, index = 0 }: Props) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative group rounded-2xl overflow-hidden glass-card glass-card-hover cursor-pointer"
    >
      {/* Featured Badge */}
      {artwork.is_featured && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-300"
          style={{ background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.3)" }}>
          <Star size={10} fill="currentColor" />
          Featured
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
      >
        <Heart
          size={14}
          className={cn("transition-colors", liked ? "text-red-400 fill-red-400" : "text-white/70")}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
        <Image
          src={artwork.preview_url}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay always */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Hover Popup from bottom */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 p-4"
            >
              <div className="flex flex-col gap-2">
                <Link
                  href={`/artwork/${artwork.slug}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <Eye size={15} />
                  View Details
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => onUnlock?.(artwork)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 4px 15px rgba(124,58,237,0.4)" }}
                >
                  <Lock size={15} />
                  Unlock Download
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text-primary text-sm leading-snug line-clamp-1 flex-1">{artwork.title}</h3>
        </div>

        {/* Category */}
        {artwork.category && (
          <span className="inline-block text-xs px-2.5 py-1 rounded-full mb-3"
            style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>
            {artwork.category.name}
          </span>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1"><Eye size={12} />{formatNumber(artwork.views)}</span>
          <span className="flex items-center gap-1"><Download size={12} />{formatNumber(artwork.downloads)}</span>
        </div>
      </div>
    </motion.div>
  );
}
