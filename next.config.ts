import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // Removed optimizePackageImports entirely — Next.js 15's barrel
  // optimization generates eval() calls which are blocked by CSP headers,
  // causing all framer-motion animations to silently stay at opacity:0 (blank page).
};

export default nextConfig;
