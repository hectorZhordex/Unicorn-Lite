"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Upload, Images, BarChart3,
  Download, Eye, Shield, TrendingUp, Plus,
  Edit2, Trash2, ToggleLeft, ToggleRight,
  Star, StarOff, Layers, LogOut, Settings,
  ChevronRight, Clock, Zap, Users
} from "lucide-react";
import { type Artwork } from "@/types";
import { formatNumber, timeAgo } from "@/lib/utils";

// Mock admin data
const MOCK_STATS = {
  total_artworks: 48,
  total_downloads: 12540,
  total_views: 84320,
  total_verifications: 31200,
};

const MOCK_ARTWORKS: Artwork[] = Array.from({ length: 8 }, (_, i) => ({
  id: `art-${i + 1}`,
  title: ["Modern Brand Identity Pack", "Neon City Wallpaper", "Corporate Flyer Template",
    "Mobile App Mockup Kit", "Gradient Logo Collection", "Social Media Bundle",
    "Dark UI Components", "Photography Poster"][i],
  slug: `artwork-${i + 1}`,
  description: "Premium design resource",
  preview_url: `https://picsum.photos/seed/${i + 10}/400/300`,
  download_url: "#",
  category_id: ["logos","posters","flyers","mockups"][i % 4],
  category: {
    id: `cat-${i % 4}`,
    name: ["Logos","Posters","Flyers","Mockups"][i % 4],
    slug: ["logos","posters","flyers","mockups"][i % 4],
    created_at: new Date().toISOString(),
  },
  tags: ["design", "premium"],
  resolution: "4K",
  file_size: `${(Math.random() * 90 + 10).toFixed(0)} MB`,
  file_format: "PSD, AI, PNG",
  views: Math.floor(Math.random() * 5000 + 500),
  downloads: Math.floor(Math.random() * 2000 + 100),
  is_featured: i < 2,
  is_active: i !== 3,
  created_at: new Date(Date.now() - i * 86400000 * 2).toISOString(),
  updated_at: new Date().toISOString(),
}));

type AdminTab = "dashboard" | "artworks" | "upload" | "analytics";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [artworks, setArtworks] = useState(MOCK_ARTWORKS);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Simple client-side auth gate (protect with middleware in prod)
  useEffect(() => {
    const auth = sessionStorage.getItem("artflow_admin_auth");
    if (auth === "true") setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: compare with env var via API route
    if (password === "admin123" || password === process.env.NEXT_PUBLIC_ADMIN_DEMO_PW) {
      sessionStorage.setItem("artflow_admin_auth", "true");
      setAuthenticated(true);
    } else {
      setPwError("Invalid password");
    }
  };

  const toggleActive = (id: string) => {
    setArtworks((prev) => prev.map((a) => a.id === id ? { ...a, is_active: !a.is_active } : a));
  };
  const toggleFeatured = (id: string) => {
    setArtworks((prev) => prev.map((a) => a.id === id ? { ...a, is_featured: !a.is_featured } : a));
  };
  const deleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md glass-card rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
              <Layers size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">ArtFlow Admin</h1>
            <p className="text-text-muted text-sm mt-1">Sign in to manage your platform</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
                placeholder="Enter admin password"
                className="input-field"
              />
              {pwError && <p className="text-red-400 text-xs mt-1">{pwError}</p>}
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              <Shield size={18} />
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-4">
            Demo password: <code className="text-purple-400">admin123</code>
          </p>
        </motion.div>
      </div>
    );
  }

  const navItems: { id: AdminTab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "artworks", icon: Images, label: "Artworks" },
    { id: "upload", icon: Upload, label: "Upload" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
  ];

  const statCards = [
    { icon: Images, label: "Total Artworks", value: MOCK_STATS.total_artworks, color: "#7c3aed", delta: "+3 this week" },
    { icon: Download, label: "Downloads", value: formatNumber(MOCK_STATS.total_downloads), color: "#3b82f6", delta: "+842 today" },
    { icon: Eye, label: "Total Views", value: formatNumber(MOCK_STATS.total_views), color: "#10b981", delta: "+2.1K today" },
    { icon: Zap, label: "Verifications", value: formatNumber(MOCK_STATS.total_verifications), color: "#f59e0b", delta: "+1.2K today" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 glass border-r border-border fixed top-0 left-0 bottom-0 z-30">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
              <Layers size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text">ArtFlow</span>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={17} />
              {label}
              {tab === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
            <Settings size={17} />
            View Site
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem("artflow_admin_auth"); setAuthenticated(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-60">
        {/* Topbar */}
        <div className="sticky top-0 z-20 glass border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white capitalize">
              {tab === "dashboard" ? "Dashboard" :
               tab === "artworks" ? "Manage Artworks" :
               tab === "upload" ? "Upload Artwork" : "Analytics"}
            </h1>
            <p className="text-xs text-text-muted">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setTab("upload")} className="btn-primary py-2 px-4 text-sm">
              <Plus size={16} />
              New Artwork
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* DASHBOARD TAB */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({ icon: Icon, label, value, color, delta }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <span className="text-xs text-green-400 flex items-center gap-1">
                        <TrendingUp size={11} />{delta}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-text-muted mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Artworks */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Clock size={16} className="text-purple-400" />
                    Recent Uploads
                  </h2>
                  <button onClick={() => setTab("artworks")} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {artworks.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={a.preview_url} alt={a.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white line-clamp-1">{a.title}</p>
                        <p className="text-xs text-text-muted">{timeAgo(a.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{formatNumber(a.downloads)}</p>
                        <p className="text-xs text-text-muted">downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ARTWORKS TAB */}
          {tab === "artworks" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {artworks.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={a.preview_url} alt={a.title} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white line-clamp-1">{a.title}</h3>
                        {a.is_featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-yellow-400"
                            style={{ background: "rgba(234,179,8,0.15)" }}>Featured</span>
                        )}
                        {!a.is_active && (
                          <span className="text-xs px-2 py-0.5 rounded-full text-red-400"
                            style={{ background: "rgba(239,68,68,0.15)" }}>Disabled</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span>{a.category?.name}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Eye size={11} />{formatNumber(a.views)}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Download size={11} />{formatNumber(a.downloads)}</span>
                        <span>·</span>
                        <span>{timeAgo(a.created_at)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleFeatured(a.id)}
                        title={a.is_featured ? "Unfeature" : "Feature"}
                        className="p-2 rounded-lg transition-colors hover:bg-yellow-500/10"
                      >
                        {a.is_featured
                          ? <Star size={15} className="text-yellow-400 fill-yellow-400" />
                          : <StarOff size={15} className="text-text-muted hover:text-yellow-400" />}
                      </button>
                      <button
                        onClick={() => toggleActive(a.id)}
                        title={a.is_active ? "Disable" : "Enable"}
                        className="p-2 rounded-lg transition-colors hover:bg-purple-500/10"
                      >
                        {a.is_active
                          ? <ToggleRight size={18} className="text-green-400" />
                          : <ToggleLeft size={18} className="text-text-muted" />}
                      </button>
                      <Link href={`/artwork/${a.slug}`}
                        className="p-2 rounded-lg transition-colors hover:bg-blue-500/10 text-text-muted hover:text-blue-400">
                        <Edit2 size={15} />
                      </Link>
                      {deleteConfirm === a.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => deleteArtwork(a.id)}
                            className="px-2 py-1 rounded-lg text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20">
                            Confirm
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded-lg text-xs text-text-muted hover:bg-white/5">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(a.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-text-muted hover:text-red-400">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD TAB */}
          {tab === "upload" && <UploadForm />}

          {/* ANALYTICS TAB */}
          {tab === "analytics" && <AnalyticsView stats={MOCK_STATS} artworks={artworks} />}
        </div>
      </div>
    </div>
  );
}

function UploadForm() {
  const [form, setForm] = useState({
    title: "", description: "", category: "", tags: "",
    resolution: "", format: "PSD, AI, PNG", is_featured: false,
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreviewFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    // Simulate upload
    await new Promise((r) => setTimeout(r, 2000));
    setUploading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Upload size={18} className="text-purple-400" />
          Upload New Artwork
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
              <input type="text" required value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field" placeholder="Modern Brand Identity Pack" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
              <textarea rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none" placeholder="Describe the artwork..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Category *</label>
              <select required value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field">
                <option value="">Select category</option>
                {["Logos","Posters","Flyers","Wallpapers","Mockups","Social Media","PSD Templates"].map((c) => (
                  <option key={c} value={c.toLowerCase().replace(" ", "-")}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags</label>
              <input type="text" value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input-field" placeholder="logo, brand, modern" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Resolution</label>
              <input type="text" value={form.resolution}
                onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                className="input-field" placeholder="3840×2160" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">File Format</label>
              <input type="text" value={form.format}
                onChange={(e) => setForm({ ...form, format: e.target.value })}
                className="input-field" placeholder="PSD, AI, PNG" />
            </div>
          </div>

          {/* Preview Image Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Preview Image *</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handlePreview} className="hidden" required />
              {previewUrl ? (
                <div className="relative h-40 rounded-xl overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Change Image</p>
                  </div>
                </div>
              ) : (
                <div className="h-32 rounded-xl border-2 border-dashed border-border hover:border-purple-500/50 flex flex-col items-center justify-center gap-2 transition-colors"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <Upload size={24} className="text-text-muted" />
                  <p className="text-sm text-text-muted">Click to upload preview image</p>
                  <p className="text-xs text-text-muted">PNG, JPG, WebP</p>
                </div>
              )}
            </label>
          </div>

          {/* Download File Upload */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Download File *</label>
            <label className="block cursor-pointer">
              <input type="file" onChange={(e) => setDownloadFile(e.target.files?.[0] || null)} className="hidden" required />
              <div className={`h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                downloadFile ? "border-green-500/50 bg-green-500/5" : "border-border hover:border-purple-500/50"
              }`} style={{ background: downloadFile ? undefined : "rgba(255,255,255,0.02)" }}>
                {downloadFile ? (
                  <>
                    <CheckCircle2 size={20} className="text-green-400" />
                    <p className="text-sm text-green-400 font-medium">{downloadFile.name}</p>
                  </>
                ) : (
                  <>
                    <FileArchiveIcon />
                    <p className="text-sm text-text-muted">Upload ZIP, PSD, AI file</p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
              className="transition-all"
            >
              {form.is_featured
                ? <ToggleRight size={28} className="text-purple-400" />
                : <ToggleLeft size={28} className="text-text-muted" />}
            </button>
            <div>
              <p className="text-sm font-medium text-white">Feature on Homepage</p>
              <p className="text-xs text-text-muted">Show in the featured section</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`btn-primary w-full py-4 text-base ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 size={20} />
                Uploaded Successfully!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload size={18} />
                Upload Artwork
              </span>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function FileArchiveIcon() {
  return <Download size={20} className="text-text-muted" />;
}

// Inline import for CheckCircle2 in UploadForm
import { CheckCircle2 } from "lucide-react";

function AnalyticsView({ stats, artworks }: { stats: typeof MOCK_STATS; artworks: Artwork[] }) {
  const topArtworks = [...artworks].sort((a, b) => b.downloads - a.downloads);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Downloads */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Download size={16} className="text-blue-400" />
            Top Downloads
          </h3>
          <div className="space-y-3">
            {topArtworks.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-muted w-5">{i + 1}</span>
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={a.preview_url} alt={a.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white line-clamp-1">{a.title}</p>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${(a.downloads / topArtworks[0].downloads) * 100}%`,
                        background: "linear-gradient(90deg, #7c3aed, #3b82f6)"
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-semibold text-white">{formatNumber(a.downloads)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-purple-400" />
            Category Breakdown
          </h3>
          {["Logos","Posters","Flyers","Mockups"].map((cat, i) => {
            const count = artworks.filter((a) => a.category?.name === cat).length;
            const pct = (count / artworks.length) * 100;
            const colors = ["#7c3aed","#3b82f6","#10b981","#f59e0b"];
            return (
              <div key={cat} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{cat}</span>
                  <span className="text-white font-medium">{count} artworks</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: colors[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Estimate */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400" />
          Revenue Estimates (Monetag)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Today", verifications: 1200, rpm: 2.5 },
            { label: "This Week", verifications: 8400, rpm: 2.5 },
            { label: "This Month", verifications: 31200, rpm: 2.5 },
            { label: "Total", verifications: stats.total_verifications, rpm: 2.5 },
          ].map(({ label, verifications, rpm }) => (
            <div key={label} className="p-4 rounded-xl text-center"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs text-text-muted mb-1">{label}</p>
              <p className="text-xl font-bold text-green-400">
                ${((verifications / 1000) * rpm).toFixed(2)}
              </p>
              <p className="text-xs text-text-muted mt-1">{formatNumber(verifications)} verifs</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3">* Estimate based on $2.50 RPM. Actual revenue varies by traffic quality.</p>
      </div>
    </div>
  );
}
