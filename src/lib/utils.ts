import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("artflow_session");
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem("artflow_session", sessionId);
  }
  return sessionId;
}

export function timeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export const CATEGORIES = [
  { name: "All", slug: "all", icon: "🎨" },
  { name: "Logos", slug: "logos", icon: "✏️" },
  { name: "Posters", slug: "posters", icon: "🖼️" },
  { name: "Flyers", slug: "flyers", icon: "📄" },
  { name: "Wallpapers", slug: "wallpapers", icon: "🖥️" },
  { name: "Mockups", slug: "mockups", icon: "📱" },
  { name: "Social Media", slug: "social-media", icon: "📸" },
  { name: "PSD Templates", slug: "psd-templates", icon: "📁" },
];

export const VERIFICATION_STEPS = 4;
export const VERIFICATION_TIMER = 15; // seconds
export const MONETAG_SMARTLINK = process.env.NEXT_PUBLIC_MONETAG_SMARTLINK || "https://example.com/sponsor";
