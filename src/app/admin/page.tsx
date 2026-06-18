"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Upload, Images, BarChart3,
  Download, Eye, Shield, TrendingUp, Plus,
  Edit2, Trash2, ToggleLeft, ToggleRight,
  Star, StarOff, Layers, LogOut, Settings,
  ChevronRight, Clock, Zap, AlertTriangle,
  CheckCircle2, Save, RefreshCw, Type, Image as ImageIcon,
  List, FileText, Search
} from "lucide-react";
import { type Artwork } from "@/types";
import { formatNumber, timeAgo } from "@/lib/utils";
import { useSettingsStore, parseCategories } from "@/lib/settings-store";
import toast from "react-hot-toast";

const ADMIN_PASSWORD = "admin@@@900";

// Stats and artworks loaded from Supabase in the component

type AdminTab = "dashboard" | "artworks" | "upload" | "analytics" | "settings";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [stats, setStats] = useState({ total_artworks: 0, total_downloads: 0, total_views: 0, total_verifications: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load real data from Supabase
  useEffect(() => {
    if (!authenticated) return;
    // Fetch artworks
    fetch("/api/artworks?limit=50")
      .then((r) => r.json())
      .then((d) => setArtworks(d.artworks || []))
      .catch(() => {});
    // Fetch stats
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, [authenticated]);

  useEffect(() => {
    const auth = sessionStorage.getItem("artflow_admin_auth");
    if (auth === "true") setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("artflow_admin_auth", "true");
      setAuthenticated(true);
    } else {
      setPwError("Incorrect password");
    }
  };

  const toggleActive = (id: string) =>
    setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, is_active: !a.is_active } : a)));
  const toggleFeatured = (id: string) =>
    setArtworks((prev) => prev.map((a) => (a.id === id ? { ...a, is_featured: !a.is_featured } : a)));
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
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}
            >
              <Layers size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
                placeholder="Enter password"
                className="input-field"
                autoComplete="current-password"
              />
              {pwError && <p className="text-red-400 text-xs mt-1.5">{pwError}</p>}
            </div>
            <button type="submit" className="btn-primary w-full py-3">
              <Shield size={18} />
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const navItems: { id: AdminTab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "artworks", icon: Images, label: "Artworks" },
    { id: "upload", icon: Upload, label: "Upload" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Site Settings" },
  ];

  const statCards = [
    { icon: Images, label: "Total Files", value: statsLoading ? "..." : stats.total_artworks, color: "#7c3aed" },
    { icon: Download, label: "Downloads", value: statsLoading ? "..." : formatNumber(stats.total_downloads), color: "#3b82f6" },
    { icon: Eye, label: "Total Views", value: statsLoading ? "..." : formatNumber(stats.total_views), color: "#10b981" },
    { icon: Zap, label: "Verifications", value: statsLoading ? "..." : formatNumber(stats.total_verifications), color: "#f59e0b" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-white/5 fixed top-0 left-0 bottom-0 z-30"
        style={{ background: "rgba(5,5,16,0.95)", backdropFilter: "blur(20px)" }}>
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
              <Layers size={16} className="text-white" />
            </div>
            <span className="font-bold gradient-text">BlueOrbit</span>
          </Link>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/5 transition-colors">
            <Eye size={17} />
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

      {/* Main */}
      <div className="flex-1 md:ml-60 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-20 border-b border-white/5 px-4 sm:px-6 py-4 flex items-center justify-between"
          style={{ background: "rgba(5,5,16,0.95)", backdropFilter: "blur(20px)" }}>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white capitalize">
              {navItems.find((n) => n.id === tab)?.label}
            </h1>
            <p className="text-xs text-text-muted hidden sm:block">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={() => setTab("upload")} className="btn-primary py-2 px-3 sm:px-4 text-sm">
            <Plus size={16} />
            <span className="hidden sm:inline">New File</span>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statCards.map(({ icon: Icon, label, value, color }, i) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }} className="glass-card rounded-2xl p-4 sm:p-5">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                        <Icon size={17} style={{ color }} />
                      </div>

                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
                    <p className="text-xs text-text-muted mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Clock size={16} className="text-purple-400" />
                    Recent Uploads
                  </h2>
                  <button onClick={() => setTab("artworks")} className="text-xs text-purple-400 hover:text-purple-300">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {artworks.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={a.preview_url} alt={a.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{a.title}</p>
                        <p className="text-xs text-text-muted">{timeAgo(a.created_at)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-white">{formatNumber(a.downloads)}</p>
                        <p className="text-xs text-text-muted">downloads</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ARTWORKS */}
          {tab === "artworks" && (
            <div className="space-y-3">
              {artworks.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={a.preview_url} alt={a.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-white truncate">{a.title}</h3>
                      {a.is_featured && (
                        <span className="text-xs px-2 py-0.5 rounded-full text-yellow-400 flex-shrink-0"
                          style={{ background: "rgba(234,179,8,0.15)" }}>Featured</span>
                      )}
                      {!a.is_active && (
                        <span className="text-xs px-2 py-0.5 rounded-full text-red-400 flex-shrink-0"
                          style={{ background: "rgba(239,68,68,0.15)" }}>Disabled</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-text-muted flex-wrap">
                      <span>{a.category?.name}</span>
                      <span className="hidden sm:flex items-center gap-1"><Eye size={11} />{formatNumber(a.views)}</span>
                      <span className="flex items-center gap-1"><Download size={11} />{formatNumber(a.downloads)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleFeatured(a.id)} className="p-2 rounded-lg hover:bg-yellow-500/10 transition-colors">
                      {a.is_featured
                        ? <Star size={15} className="text-yellow-400 fill-yellow-400" />
                        : <StarOff size={15} className="text-text-muted" />}
                    </button>
                    <button onClick={() => toggleActive(a.id)} className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors">
                      {a.is_active
                        ? <ToggleRight size={18} className="text-green-400" />
                        : <ToggleLeft size={18} className="text-text-muted" />}
                    </button>
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
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-text-muted hover:text-red-400">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* UPLOAD */}
          {tab === "upload" && <UploadForm />}

          {/* ANALYTICS */}
          {tab === "analytics" && <AnalyticsView stats={stats} artworks={artworks} />}

          {/* SETTINGS */}
          {tab === "settings" && <SiteSettingsPanel />}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── SITE SETTINGS PANEL ─────────────────────────── */
function SiteSettingsPanel() {
  const { settings, updateSettings, resetSettings, clearAllData } = useSettingsStore();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearAll = () => {
    clearAllData();
    setClearConfirm(false);
    setLocal({ ...settings });
    window.location.reload();
  };

  const sections = [
    {
      id: "logo",
      icon: ImageIcon,
      label: "Logo & Brand",
      color: "#7c3aed",
      fields: [
        { key: "logoText", label: "Logo Text", placeholder: "ArtFlow", type: "text" },
        { key: "logoImage", label: "Logo Image", placeholder: "", type: "logo-upload" },
      ],
    },
    {
      id: "hero",
      icon: Type,
      label: "Homepage Hero",
      color: "#3b82f6",
      fields: [
        { key: "heroHeadlineLine1", label: "Headline Line 1", placeholder: "Download Premium", type: "text" },
        { key: "heroHeadlineLine2", label: "Headline Line 2 (gradient)", placeholder: "Design Assets", type: "text" },
        { key: "heroSubtitle", label: "Subtitle Text", placeholder: "Logos, mockups...", type: "textarea" },
      ],
    },
    {
      id: "search",
      icon: Search,
      label: "Search Bar",
      color: "#06b6d4",
      fields: [
        { key: "searchPlaceholder", label: "Search Placeholder Text", placeholder: "Search", type: "text" },
      ],
    },
    {
      id: "footer",
      icon: FileText,
      label: "Footer",
      color: "#10b981",
      fields: [
        { key: "footerTagline", label: "Footer Tagline", placeholder: "Premium design resources...", type: "textarea" },
        { key: "footerCopyright", label: "Copyright Text", placeholder: "ArtFlow. All rights reserved.", type: "text" },
      ],
    },
    {
      id: "categories",
      icon: List,
      label: "Categories",
      color: "#f59e0b",
      fields: [
        {
          key: "categoriesRaw",
          label: "Categories (one per line: Name|slug)",
          placeholder: "All|all\nLogos|logos",
          type: "textarea-lg",
          hint: "Format: Category Name|category-slug — one per line",
        },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Ad Layer Toggle — shown at the top, outside save flow */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <Zap size={17} className="text-purple-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Monetization Ad Layer</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-sm font-medium text-white">
              {local.adLayerEnabled ? "Ad Layer Enabled" : "Ad Layer Disabled"}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {local.adLayerEnabled
                ? "Visitors must complete verification before downloading."
                : "Downloads redirect directly to the link — no verification shown."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const updated = { ...local, adLayerEnabled: !local.adLayerEnabled };
              setLocal(updated);
              updateSettings({ adLayerEnabled: updated.adLayerEnabled });
            }}
            className="flex-shrink-0 transition-all"
          >
            {local.adLayerEnabled
              ? <ToggleRight size={32} className="text-purple-400" />
              : <ToggleLeft size={32} className="text-text-muted" />}
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2 px-1">
          Applies to all files site-wide. Changes take effect immediately.
        </p>
      </motion.div>

      {/* Save bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Site Settings</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setLocal({ ...settings }); resetSettings(); }}
            className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
          >
            <RefreshCw size={15} />
            Reset
          </button>
          <button
            onClick={handleSave}
            className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
          >
            {saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      {sections.map(({ id, icon: Icon, label, color, fields }) => (
        <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
              <Icon size={17} style={{ color }} />
            </div>
            <h3 className="text-base font-semibold text-white">{label}</h3>
          </div>

          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {field.label}
              </label>
              {field.type === "text" ? (
                <input
                  type="text"
                  value={local[field.key as keyof typeof local]}
                  onChange={(e) => setLocal({ ...local, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="input-field"
                />
              ) : field.type === "textarea" ? (
                <textarea
                  rows={3}
                  value={local[field.key as keyof typeof local]}
                  onChange={(e) => setLocal({ ...local, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="input-field resize-none"
                />
              ) : field.type === "logo-upload" ? (
                <LogoUploader
                  value={local.logoImage}
                  onChange={(val) => setLocal({ ...local, logoImage: val })}
                />
              ) : (
                <textarea
                  rows={10}
                  value={local[field.key as keyof typeof local]}
                  onChange={(e) => setLocal({ ...local, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="input-field resize-none font-mono text-xs"
                />
              )}
              {"hint" in field && field.hint && (
                <p className="text-xs text-text-muted mt-1">{field.hint}</p>
              )}
            </div>
          ))}
        </motion.div>
      ))}

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-5 border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertTriangle size={17} className="text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-white">Danger Zone</h3>
        </div>
        <p className="text-sm text-text-muted mb-4">
          This will clear all site settings, verification progress, and cached data. This cannot be undone.
        </p>

        <AnimatePresence>
          {clearConfirm ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <p className="text-sm text-red-300 flex-1">Are you sure? This will reset everything.</p>
              <button onClick={handleClearAll}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors">
                Yes, Clear All
              </button>
              <button onClick={() => setClearConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm text-text-muted hover:bg-white/5 transition-colors">
                Cancel
              </button>
            </motion.div>
          ) : (
            <button onClick={() => setClearConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 transition-all"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertTriangle size={16} />
              Clear All Site Data
            </button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* inline icon helper used in UploadForm */
function ExternalLinkIcon() {
  return (
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ─────────────────────────── LOGO UPLOADER ─────────────────────────── */
function LogoUploader({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
          style={!value
            ? { background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }
            : { border: "1px solid rgba(255,255,255,0.1)" }
          }
        >
          {value ? (
            <img src={value} alt="Logo preview" className="w-full h-full object-cover" />
          ) : (
            <Layers size={24} className="text-white" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white mb-1">
            {value ? "Custom logo uploaded" : "Using default icon"}
          </p>
          <p className="text-xs text-text-muted">
            Recommended: Square image, at least 64x64px. PNG or SVG with transparent background.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <label className="flex-1 cursor-pointer">
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <div
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.3)",
              color: "#a78bfa",
            }}
          >
            <Upload size={15} />
            Upload Logo Image
          </div>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-red-400 hover:bg-red-500/10"
            style={{ border: "1px solid rgba(239,68,68,0.3)" }}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── UPLOAD FORM ─────────────────────────── */
function UploadForm() {
  const [form, setForm] = useState({
    title: "", description: "", category: "", tags: "",
    resolution: "", format: "PSD, AI, PNG", is_featured: false,
    downloadLink: "",
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setPreviewFile(f); setPreviewUrl(URL.createObjectURL(f)); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.downloadLink.trim()) { toast.error("Please enter a download link."); return; }
    setUploading(true);
    try {
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + `-${Date.now()}`;
      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug,
          description: form.description,
          preview_url: previewUrl || "https://picsum.photos/seed/admin/800/600",
          download_url: form.downloadLink.trim(),
          category_id: form.category || null,
          tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
          resolution: form.resolution || null,
          file_format: form.format || null,
          is_featured: form.is_featured,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      setUploading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      toast.success("File saved to database!");
    } catch (err: any) {
      setUploading(false);
      toast.error(err.message || "Upload failed.");
    }
  };

  const { settings } = useSettingsStore();
  const categories = parseCategories(settings.categoriesRaw).filter((c) => c.slug !== "all");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-5 sm:p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Upload size={18} className="text-purple-400" />
          Upload New File
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-field" placeholder="Modern Brand Identity Pack" />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none" placeholder="Describe the file..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Category *</label>
              <select required value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
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
                className="input-field" placeholder="3840x2160" />
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
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Preview Thumbnail *</label>
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
                <div className="h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-purple-500/50 flex flex-col items-center justify-center gap-2 transition-colors"
                  style={{ background: "rgba(255,255,255,0.02)" }}>
                  <Upload size={22} className="text-text-muted" />
                  <p className="text-sm text-text-muted">Click to upload preview thumbnail</p>
                </div>
              )}
            </label>
          </div>

          {/* Download Link — external cloud storage */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Download Link *
              <span className="ml-2 text-xs text-blue-400 font-normal">Google Drive / Dropbox / OneDrive / Any link</span>
            </label>
            <div className="relative">
              <ExternalLinkIcon />
              <input
                type="url"
                required
                value={form.downloadLink}
                onChange={(e) => setForm({ ...form, downloadLink: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
                className="input-field pl-10"
              />
            </div>
            <div className="mt-2 p-3 rounded-xl text-xs text-text-muted"
              style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <p className="text-blue-300 font-medium mb-1">How to get a shareable link:</p>
              <p><span className="text-white">Google Drive:</span> Right-click file → Share → Anyone with link → Copy</p>
              <p><span className="text-white">Dropbox:</span> Click Share → Create link → Copy</p>
              <p className="mt-1 text-purple-300">When a visitor completes verification, they are redirected to this link automatically.</p>
            </div>
          </div>

          {/* Featured */}
          <div className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            onClick={() => setForm({ ...form, is_featured: !form.is_featured })}>
            <button type="button">
              {form.is_featured
                ? <ToggleRight size={28} className="text-purple-400" />
                : <ToggleLeft size={28} className="text-text-muted" />}
            </button>
            <div>
              <p className="text-sm font-medium text-white">Feature on Homepage</p>
              <p className="text-xs text-text-muted">Show in the featured section</p>
            </div>
          </div>

          <button type="submit" disabled={uploading}
            className={`btn-primary w-full py-4 text-base ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}>
            {uploading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2"><CheckCircle2 size={20} />Uploaded Successfully!</span>
            ) : (
              <span className="flex items-center gap-2"><Upload size={18} />Upload Artwork</span>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────── ANALYTICS ─────────────────────────── */
interface StatsType { total_artworks: number; total_downloads: number; total_views: number; total_verifications: number; }
function AnalyticsView({ stats, artworks }: { stats: StatsType; artworks: Artwork[] }) {
  const topArtworks = [...artworks].sort((a, b) => b.downloads - a.downloads);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Download size={16} className="text-blue-400" />Top Downloads
          </h3>
          <div className="space-y-3">
            {topArtworks.map((a, i) => (
              <div key={a.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-text-muted w-5">{i + 1}</span>
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={a.preview_url} alt={a.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{a.title}</p>
                  <div className="w-full bg-white/5 rounded-full h-1 mt-1">
                    <div className="h-1 rounded-full"
                      style={{ width: `${(a.downloads / topArtworks[0].downloads) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)" }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-white flex-shrink-0">{formatNumber(a.downloads)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-purple-400" />Category Breakdown
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
                  <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: colors[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-green-400" />Revenue Estimates
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Today", verifications: 1200 },
            { label: "This Week", verifications: 8400 },
            { label: "This Month", verifications: 31200 },
            { label: "Total", verifications: stats.total_verifications },
          ].map(({ label, verifications }) => (
            <div key={label} className="p-4 rounded-xl text-center"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <p className="text-xs text-text-muted mb-1">{label}</p>
              <p className="text-xl font-bold text-green-400">${((verifications / 1000) * 2.5).toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-1">{formatNumber(verifications)} verifs</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3">Estimate based on $2.50 RPM. Actual revenue varies.</p>
      </div>
    </div>
  );
}


