"use client";

import { useState } from "react";
import { m as motion } from "framer-motion";
import ArtworkCard from "./ArtworkCard";
import { type Artwork } from "@/types";
import VerificationModal from "@/components/verification/VerificationModal";

interface Props {
  artworks: Artwork[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden glass-card">
      <div className="aspect-[4/3] shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded-lg shimmer w-3/4" />
        <div className="h-3 rounded-full shimmer w-1/3" />
        <div className="flex gap-4">
          <div className="h-3 rounded shimmer w-12" />
          <div className="h-3 rounded shimmer w-12" />
        </div>
      </div>
    </div>
  );
}

export default function ArtworkGrid({ artworks, loading }: Props) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-text-primary mb-2">No files found</h3>
        <p className="text-text-muted text-sm">Try a different search or category</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
      >
        {artworks.map((artwork, index) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            index={index}
            onUnlock={(a) => setSelectedArtwork(a)}
          />
        ))}
      </motion.div>

      {selectedArtwork && (
        <VerificationModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
}
