"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
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
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="relative group rounded-2xl overflow-hidden glass-card cursor-pointer"
      style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
      whileHover={{ y: -3 }}
    >
      {/* Featured Badge */}
      {artwork.is_featured && (
        <div
          className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold text-yellow-300"
          style={{ background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.3)" }}
        >
          <Star size={10} fill="currentColor" />
          Featured
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
        style={{ background: "rgba(0,0,0,0.55)" }}
      >
        <Heart
          size={14}
          className={cn("transition-colors", liked ? "text-red-400 fill-red-400" : "text-white/80")}
        />
      </button>

      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-surface-2">
        <Image
          src={artwork.preview_url}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient overlay — always visible on mobile, stronger on hover for desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Action buttons — ALWAYS visible at bottom (works on touch + desktop) */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex flex-col gap-2">
            <Link
              href={`/artwork/${artwork.slug}`}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Eye size={14} />
              View Details
              <ArrowRight size={13} />
            </Link>
            <button
              onClick={() => onUnlock?.(artwork)}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                boxShadow: "0 4px 15px rgba(124,58,237,0.5)",
              }}
            >
              <Lock size={14} />
              Unlock Download
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-semibold text-text-primary text-base leading-snug line-clamp-1 mb-2.5">
          {artwork.title}
        </h3>

        {artwork.category && (
          <span
            className="inline-block text-xs px-3 py-1.5 rounded-full mb-3"
            style={{
              background: "rgba(124,58,237,0.15)",
              color: "#a78bfa",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            {artwork.category.name}
          </span>
        )}

        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5"><Eye size={13} />{formatNumber(artwork.views)}</span>
          <span className="flex items-center gap-1.5"><Download size={13} />{formatNumber(artwork.downloads)}</span>
        </div>
      </div>
    </motion.div>
  );
}
