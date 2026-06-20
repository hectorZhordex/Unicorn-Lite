"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Files, Upload, Database, Share2, Home,
  DollarSign, BarChart3, CreditCard, Settings, Globe,
  LogOut, Search, ChevronDown, Menu, Eye, Download, Plus,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useSettingsStore } from "@/lib/settings-store";
import UserUploadModal from "@/components/upload/UserUploadModal";
import { useUploadsStore } from "@/lib/uploads-store";
import { type Artwork } from "@/types";

type DashTab =
  | "dashboard"
  | "files"
  | "upload"
  | "database"
  | "shared"
  | "earnings"
  | "analytics"
  | "payouts"
  | "settings";

/* ── Storage donut ── */
function StorageDonut({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? used / total : 0;
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg viewBox="0 0 128 128" className="w-28 h-28 sm:w-32 sm:h-32">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke="url(#donutGrad)" strokeWidth="14"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <defs>
        <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
        {Math.round(pct * 100)}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="9">
        Used
      </text>
    </svg>
  );
}

/* ── Empty state ── */
function EmptyState({
  icon: Icon, title, sub, action, onAction,
}: {
  icon: typeof Files;
  title: string;
  sub: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
      >
        <Icon size={22} className="text-purple-400" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-4">{sub}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
          style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
        >
          <Plus size={15} />
          {action}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const { uploads } = useUploadsStore();

  const [tab, setTab] = useState<DashTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) router.push("/");
  }, [currentUser, router]);

  if (!currentUser) return null;

  // ✅ async logout for Supabase
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const userFiles: Artwork[] = uploads;
  const publicFiles = userFiles.filter((f) => f.is_active);
  const totalDownloads = userFiles.reduce((s, f) => s + (f.downloads || 0), 0);
  const totalViews = userFiles.reduce((s, f) => s + (f.views || 0), 0);

  // ✅ "Upload" → "Upload Link"
  const NAV: { id: DashTab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "files",     icon: Files,           label: "Files" },
    { id: "upload",    icon: Upload,           label: "Upload Link" },
    { id: "database",  icon: Database,         label: "Database" },
    { id: "shared",    icon: Share2,           label: "Shared Files" },
    { id: "earnings",  icon: DollarSign,       label: "Earnings" },
    { id: "analytics", icon: BarChart3,        label: "Analytics" },
    { id: "payouts",   icon: CreditCard,       label: "Payouts" },
    { id: "settings",  icon: Settings,         label: "Settings" },
  ];

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 py-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={settings.logoImage || "/favicon.png"} alt="Logo"
                width={32} height={32} className="w-full h-full object-cover" unoptimized
              />
            </div>
            <span className="font-bold text-white text-base sm:text-lg">{settings.logoText}</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-0.5 overflow-y-auto">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 sm:px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Home size={17} />
            Home
          </a>
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setSidebarOpen(false);
                if (id === "upload") setUploadOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-3 sm:px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === id && id !== "upload"
                  ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-52 lg:w-56 fixed top-0 left-0 bottom-0 z-30"
        style={{ background: "rgb(8,8,20)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-52 z-50 md:hidden"
              style={{ background: "rgb(8,8,20)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-52 lg:ml-56 min-w-0">

        {/* Topbar */}
        <div
          className="sticky top-0 z-20 flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3.5"
          style={{ background: "rgb(8,8,20)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 relative max-w-xs sm:max-w-md hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">Basic Account</p>
                </div>
                <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50"
                    style={{ background: "rgb(13,13,26)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => { setUserMenuOpen(false); setTab("settings"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Settings size={14} />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-3 sm:p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "dashboard" && (
                <DashboardHome
                  user={currentUser} files={userFiles}
                  totalDownloads={totalDownloads} totalViews={totalViews}
                  onUpload={() => setUploadOpen(true)}
                />
              )}
              {tab === "files"     && <FilesTab files={userFiles} onUpload={() => setUploadOpen(true)} />}
              {tab === "database"  && <DatabaseTab />}
              {tab === "shared"    && <SharedTab files={publicFiles} />}
              {tab === "earnings"  && <EarningsTab files={userFiles} />}
              {tab === "analytics" && <AnalyticsTab files={userFiles} />}
              {tab === "payouts"   && <PayoutsTab />}
              {tab === "settings"  && <SettingsTab user={currentUser} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <UserUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD HOME
══════════════════════════════════════════════════════════════ */
function DashboardHome({
  user, files, totalDownloads, totalViews, onUpload,
}: {
  user: any; files: Artwork[]; totalDownloads: number; totalViews: number; onUpload: () => void;
}) {
  const stats = [
    { icon: Files,     label: "Total Files", value: files.length.toString(),   color: "#7c3aed" },
    { icon: Download,  label: "Downloads",   value: totalDownloads.toString(), color: "#3b82f6" },
    { icon: Eye,       label: "Views",       value: totalViews.toString(),     color: "#10b981" },
    { icon: DollarSign,label: "Earnings",    value: "$0.00",                   color: "#f59e0b" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white">Welcome back, {user.name}!</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Here is an overview of your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 sm:p-5 rounded-2xl"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}
              >
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Files + Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div
          className="lg:col-span-2 rounded-2xl p-4 sm:p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Files</h2>
            {files.length > 0 && <span className="text-xs text-slate-500">{files.length} total</span>}
          </div>
          {files.length === 0 ? (
            <EmptyState icon={Upload} title="No files yet" sub="Upload your first file to get started." action="Upload File" onAction={onUpload} />
          ) : (
            <div className="space-y-2">
              {files.slice(0, 4).map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}
                  >
                    {(f.file_format || "FILE").slice(0, 3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-white truncate">{f.title}</p>
                    <p className="text-xs text-slate-500">{f.file_size || "—"} · {new Date(f.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full text-green-400 flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>
                    Public
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="rounded-2xl p-4 sm:p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-4">Storage</h2>
          <div className="flex flex-col items-center mb-4">
            <StorageDonut used={0} total={5120} />
          </div>
          <div className="space-y-2">
            {[
              { label: "Used Space", value: "0 GB",  color: "#7c3aed" },
              { label: "Free Space", value: "5 GB",  color: "rgba(255,255,255,0.15)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="text-slate-400">{label}</span>
                </div>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monetization notice */}
      <div
        className="rounded-2xl p-4 sm:p-5"
        style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)" }}
      >
        <div className="flex items-start gap-3">
          <DollarSign size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white mb-0.5">How to start earning</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload files and share them publicly. Once your files reach 500 visits, monetization activates automatically and you start earning revenue from every unlock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FILES TAB
══════════════════════════════════════════════════════════════ */
function FilesTab({ files, onUpload }: { files: Artwork[]; onUpload: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white">My Files</h2>
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-white transition-all"
          style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}
        >
          <Upload size={14} />Upload
        </button>
      </div>

      {files.length === 0 ? (
        <div className="rounded-2xl" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <EmptyState icon={Files} title="No files uploaded yet" sub="Upload your first file to share it with the community and start earning." action="Upload File" onAction={onUpload} />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-4 py-3 border-b border-white/5 hidden sm:grid sm:grid-cols-12 text-xs text-slate-600 font-medium">
            <span className="col-span-5">File Name</span>
            <span className="col-span-2 text-center">Size</span>
            <span className="col-span-2 text-center">Format</span>
            <span className="col-span-2 text-center">Visibility</span>
            <span className="col-span-1 text-right">Downloads</span>
          </div>
          {files.map((f) => (
            <div key={f.id} className="p-3 sm:p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <div className="sm:hidden flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                  {(f.file_format || "FILE").slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.file_size || "—"} · {new Date(f.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full text-green-400 flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)" }}>Public</span>
              </div>
              <div className="hidden sm:grid sm:grid-cols-12 items-center text-sm">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                    {(f.file_format || "FILE").slice(0, 3)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium truncate text-xs">{f.title}</p>
                    <p className="text-slate-600 text-xs">{new Date(f.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="col-span-2 text-center text-slate-400 text-xs">{f.file_size || "—"}</span>
                <span className="col-span-2 text-center text-slate-400 text-xs">{f.file_format || "—"}</span>
                <span className="col-span-2 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full text-green-400" style={{ background: "rgba(16,185,129,0.12)" }}>Public</span>
                </span>
                <span className="col-span-1 text-right text-slate-400 text-xs">{f.downloads || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DATABASE TAB
══════════════════════════════════════════════════════════════ */
function DatabaseTab() {
  return (
    <div className="space-y-5">
      <h2 className="text-base sm:text-lg font-bold text-white">Database</h2>
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <EmptyState icon={Database} title="No database plan active" sub="Upgrade to a lifetime database plan to get storage, projects, and records for your applications." />
        <div className="flex justify-center mt-2">
          <Link href="/database" className="btn-primary py-2.5 px-6 text-sm inline-flex items-center gap-2">
            View Database Plans
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARED FILES TAB
══════════════════════════════════════════════════════════════ */
function SharedTab({ files }: { files: Artwork[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-base sm:text-lg font-bold text-white">Shared Files</h2>
      {files.length === 0 ? (
        <div className="rounded-2xl" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <EmptyState icon={Share2} title="No shared files" sub="Files you upload publicly will appear here." />
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                {(f.file_format || "FILE").slice(0, 3)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{f.title}</p>
                <p className="text-xs text-slate-500">{f.file_size || "—"} · {f.downloads || 0} downloads</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={13} className="text-green-400" />
                <span className="text-xs text-green-400">Public</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   EARNINGS TAB
══════════════════════════════════════════════════════════════ */
function EarningsTab({ files }: { files: Artwork[] }) {
  const totalViews = files.reduce((s, f) => s + (f.views || 0), 0);
  const needsMoreViews = totalViews < 500;

  return (
    <div className="space-y-5">
      <h2 className="text-base sm:text-lg font-bold text-white">Earnings</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Earnings", value: "$0.00", color: "#f59e0b" },
          { label: "Total Unlocks",  value: "0",     color: "#7c3aed" },
          { label: "RPM",            value: "$0.00", color: "#3b82f6" },
          { label: "Est. Monthly",   value: "$0.00", color: "#10b981" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 sm:p-5 rounded-2xl" style={{ background: "rgba(13,13,26,0.9)", border: `1px solid ${color}20` }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-xl sm:text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {needsMoreViews ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <DollarSign size={22} className="text-purple-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Monetization Not Active Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
              Your files need to reach{" "}
              <span className="text-white font-semibold">500 total views</span>{" "}
              before monetization activates automatically.
            </p>
            <div className="max-w-xs mx-auto mb-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{totalViews} views</span>
                <span>500 required</span>
              </div>
              <div className="h-2 rounded-full bg-white/5">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalViews / 500) * 100, 100)}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)" }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-600">{Math.max(0, 500 - totalViews)} more views needed</p>
          </div>
        ) : (
          <EmptyState icon={DollarSign} title="No earnings yet" sub="You have enough views. Earnings will appear as visitors unlock your files." />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ANALYTICS TAB
══════════════════════════════════════════════════════════════ */
function AnalyticsTab({ files }: { files: Artwork[] }) {
  const totalViews     = files.reduce((s, f) => s + (f.views     || 0), 0);
  const totalDownloads = files.reduce((s, f) => s + (f.downloads || 0), 0);

  return (
    <div className="space-y-5">
      <h2 className="text-base sm:text-lg font-bold text-white">Analytics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Files",   value: files.length.toString(),     color: "#7c3aed" },
          { label: "Total Views",   value: totalViews.toString(),       color: "#3b82f6" },
          { label: "Downloads",     value: totalDownloads.toString(),   color: "#10b981" },
          { label: "Storage Used",  value: "0 GB",                     color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Top Performing Files</h3>
        {files.length === 0 ? (
          <EmptyState icon={BarChart3} title="No data available" sub="Upload files to start tracking performance and analytics." />
        ) : (
          <div className="space-y-3">
            {files.slice(0, 5).map((f, i) => {
              const maxViews = Math.max(1, ...files.map((x) => x.views || 0));
              return (
                <div key={f.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-purple-400 w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{f.title}</p>
                    <div className="h-1.5 rounded-full bg-white/5 mt-1">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${Math.min(((f.views || 0) / maxViews) * 100, 100)}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{f.views || 0} views</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAYOUTS TAB
══════════════════════════════════════════════════════════════ */
function PayoutsTab() {
  return (
    <div className="space-y-5">
      <h2 className="text-base sm:text-lg font-bold text-white">Payouts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Available Balance", value: "$0.00", sub: "Nothing to withdraw yet", color: "#10b981" },
          { label: "Pending",           value: "$0.00", sub: "No pending payouts",      color: "#f59e0b" },
          { label: "Total Paid Out",    value: "$0.00", sub: "All time",               color: "#3b82f6" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-600">{sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Payout Method</h3>
        <EmptyState
          icon={CreditCard}
          title="No payout method added"
          sub="Payout methods will be available once your earnings reach the minimum threshold. Contact support to set up payouts."
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS TAB
══════════════════════════════════════════════════════════════ */
function SettingsTab({ user }: { user: any }) {
  return (
    <div className="space-y-5 max-w-xl">
      <h2 className="text-base sm:text-lg font-bold text-white">Settings</h2>
      <div
        className="rounded-2xl p-5 sm:p-6 space-y-4"
        style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h3 className="text-sm font-semibold text-white">Profile</h3>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
          <input defaultValue={user.name} className="input-field text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
          <input
            defaultValue={user.email} className="input-field text-sm" disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Account Type</label>
          <div className="input-field text-sm text-slate-400">Basic</div>
        </div>
        <button className="btn-primary py-2.5 px-6 text-sm">Save Changes</button>
      </div>
    </div>
  );
}
