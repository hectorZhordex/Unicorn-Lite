"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard, Files, Upload, Database, Share2,
  DollarSign, BarChart3, CreditCard, Settings, Globe,
  LogOut, Search, Bell, ChevronDown, Menu, X,
  TrendingUp, Eye, Download, HardDrive,
  Zap, ArrowUpRight, Clock, CheckCircle2, Lock,
  Layers
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useSettingsStore } from "@/lib/settings-store";
import { formatNumber } from "@/lib/utils";
import UserUploadModal from "@/components/upload/UserUploadModal";

type DashTab = "dashboard" | "files" | "upload" | "database" | "shared" | "earnings" | "analytics" | "payouts" | "settings";

// Sample earnings data for chart
const EARNINGS_DATA = [
  { day: "Mon", amount: 12 },
  { day: "Tue", amount: 18 },
  { day: "Wed", amount: 22 },
  { day: "Thu", amount: 15 },
  { day: "Fri", amount: 31 },
  { day: "Sat", amount: 27 },
  { day: "Sun", amount: 35 },
];

const RECENT_FILES = [
  { name: "Project_Proposal.pdf", size: "2.4 MB", type: "PDF", visibility: "Public", uploaded: "2 hours ago", downloads: 125, earnings: 8.25 },
  { name: "Database_Structure.sql", size: "1.1 MB", type: "SQL", visibility: "Public", uploaded: "5 hours ago", downloads: 89, earnings: 5.90 },
  { name: "Design_Assets.zip", size: "45.2 MB", type: "ZIP", visibility: "Public", uploaded: "1 day ago", downloads: 210, earnings: 14.00 },
  { name: "Marketing_Plan.docx", size: "3.7 MB", type: "DOCX", visibility: "Private", uploaded: "2 days ago", downloads: 0, earnings: 0 },
  { name: "Presentation.pptx", size: "8.3 MB", type: "PPTX", visibility: "Public", uploaded: "3 days ago", downloads: 67, earnings: 4.45 },
];

const TOP_FILES = [
  { name: "Tutorial_Video.mp4", views: 4256, downloads: 1256, earnings: 256.75 },
  { name: "BlueOrbit_Guide.pdf", views: 3120, downloads: 890, earnings: 189.50 },
  { name: "Design_Assets.zip", views: 2890, downloads: 742, earnings: 156.20 },
  { name: "Project_Proposal.pdf", views: 1450, downloads: 380, earnings: 78.40 },
];

// Simple SVG line chart
function EarningsChart({ data }: { data: typeof EARNINGS_DATA }) {
  const max = Math.max(...data.map((d) => d.amount));
  const w = 500, h = 120, pad = 20;
  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - (d.amount / max) * (h - pad * 2),
  }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${points[0].x},${h - pad} ${polyline} ${points[points.length - 1].x},${h - pad}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#chartGrad)" />
      <polyline points={polyline} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#7c3aed" stroke="#050510" strokeWidth="2" />
      ))}
    </svg>
  );
}

// Storage donut
function StorageDonut({ used, total }: { used: number; total: number }) {
  const pct = used / total;
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg viewBox="0 0 128 128" className="w-32 h-32">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="url(#donutGrad)" strokeWidth="14"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <defs>
        <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
        {Math.round(pct * 100)}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="9">Used</text>
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const [tab, setTab] = useState<DashTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) router.push("/");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const NAV: { id: DashTab; icon: typeof LayoutDashboard; label: string }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "files", icon: Files, label: "Files" },
    { id: "upload", icon: Upload, label: "Upload" },
    { id: "database", icon: Database, label: "Database" },
    { id: "shared", icon: Share2, label: "Shared Files" },
    { id: "earnings", icon: DollarSign, label: "Earnings" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "payouts", icon: CreditCard, label: "Payouts" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={settings.logoImage || "/favicon.png"} alt="Logo" width={32} height={32} className="w-full h-full object-cover" unoptimized />
          </div>
          <span className="font-bold text-white text-lg">{settings.logoText}</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setSidebarOpen(false); if (id === "upload") setUploadOpen(true); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
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

      {/* Sign Out */}
      <div className="p-4 border-t border-white/5">
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 fixed top-0 left-0 bottom-0 z-30"
        style={{ background: "rgb(8,8,20)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 w-56 z-50 md:hidden"
              style={{ background: "rgb(8,8,20)", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-56 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 sm:px-6 py-3.5"
          style={{ background: "rgb(8,8,20)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
            <Menu size={20} />
          </button>

          <div className="flex-1 relative max-w-md hidden sm:block">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input placeholder="Search files, folders, database..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }} />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-purple-500" />
            </button>

            <div className="relative">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">Premium User</p>
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
                    style={{ background: "rgb(13,13,26)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    <button onClick={() => { setUserMenuOpen(false); setTab("settings"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                      <Settings size={14} />Settings
                    </button>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={14} />Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "dashboard" && <DashboardHome user={currentUser} onUpload={() => setUploadOpen(true)} />}
              {tab === "files" && <FilesTab />}
              {tab === "database" && <DatabaseTab />}
              {tab === "shared" && <SharedTab />}
              {tab === "earnings" && <EarningsTab />}
              {tab === "analytics" && <AnalyticsTab />}
              {tab === "payouts" && <PayoutsTab />}
              {tab === "settings" && <SettingsTab user={currentUser} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <UserUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}

/* ─────────────── DASHBOARD HOME ─────────────── */
function DashboardHome({ user, onUpload }: { user: any; onUpload: () => void }) {
  const STATS = [
    { icon: Files, label: "Total Files", value: "1,248", sub: "+12 this week", color: "#7c3aed" },
    { icon: Download, label: "Total Downloads", value: "3,654", sub: "+256 this week", color: "#3b82f6" },
    { icon: Eye, label: "Total Views", value: "18,392", sub: "+1,024 this week", color: "#10b981" },
    { icon: DollarSign, label: "Total Earnings", value: "$1,248.75", sub: "+$96.50 this week", color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-white">Welcome back, {user.name}!</h1>
        <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your account today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {STATS.map(({ icon: Icon, label, value, sub, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 rounded-2xl relative overflow-hidden"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={17} style={{ color }} />
              </div>
              <ArrowUpRight size={14} className="text-slate-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white leading-none">{value}</p>
            <p className="text-xs text-slate-500 mt-1">{label}</p>
            <p className="text-xs mt-1 font-medium" style={{ color }}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Files */}
        <div className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Files</h2>
            <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">View all</button>
          </div>
          <div className="space-y-2.5">
            {RECENT_FILES.slice(0, 4).map((f) => (
              <div key={f.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                  {f.type.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{f.name}</p>
                  <p className="text-xs text-slate-500">{f.size} · {f.uploaded}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${f.visibility === "Public" ? "text-green-400" : "text-slate-500"}`}
                    style={{ background: f.visibility === "Public" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)" }}>
                    {f.visibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Storage */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold text-white mb-4">Storage Usage</h2>
          <div className="flex flex-col items-center mb-4">
            <StorageDonut used={310} total={500} />
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Used Space", value: "310 GB", color: "#7c3aed" },
              { label: "Free Space", value: "190 GB", color: "rgba(255,255,255,0.15)" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  <span className="text-slate-400">{label}</span>
                </div>
                <span className="text-white font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Earnings Chart */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">Earnings Overview</h2>
            <span className="text-xs text-slate-500">This Week</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">$1,248.75</p>
          <p className="text-xs text-slate-500 mb-4">Total Earnings</p>
          <EarningsChart data={EARNINGS_DATA} />
          <div className="flex items-center justify-between mt-2">
            {EARNINGS_DATA.map((d) => (
              <span key={d.day} className="text-xs text-slate-600">{d.day}</span>
            ))}
          </div>
        </div>

        {/* Top Files */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Top Performing Files</h2>
            <button className="text-xs text-purple-400 hover:text-purple-300">View all</button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-4 text-xs text-slate-600 pb-2 border-b border-white/5">
              <span className="col-span-2">File Name</span>
              <span className="text-center">Downloads</span>
              <span className="text-right">Earnings</span>
            </div>
            {TOP_FILES.map((f, i) => (
              <div key={f.name} className="grid grid-cols-4 text-sm items-center">
                <div className="col-span-2 flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-purple-400 w-4">{i + 1}</span>
                  <span className="text-slate-300 truncate text-xs">{f.name}</span>
                </div>
                <span className="text-center text-slate-400 text-xs">{f.downloads.toLocaleString()}</span>
                <span className="text-right text-green-400 text-xs font-medium">${f.earnings.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── FILES TAB ─────────────── */
function FilesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">My Files</h2>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="p-4 border-b border-white/5">
          <div className="grid grid-cols-12 text-xs text-slate-600 font-medium">
            <span className="col-span-4">File Name</span>
            <span className="col-span-2 text-center">Size</span>
            <span className="col-span-2 text-center">Type</span>
            <span className="col-span-2 text-center">Visibility</span>
            <span className="col-span-2 text-right">Earnings</span>
          </div>
        </div>
        {RECENT_FILES.map((f, i) => (
          <div key={f.name} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
            <div className="grid grid-cols-12 items-center text-sm">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
                  {f.type.slice(0, 3)}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate text-xs">{f.name}</p>
                  <p className="text-slate-600 text-xs">{f.uploaded}</p>
                </div>
              </div>
              <span className="col-span-2 text-center text-slate-400 text-xs">{f.size}</span>
              <span className="col-span-2 text-center text-slate-400 text-xs">{f.type}</span>
              <span className="col-span-2 text-center">
                <span className={`text-xs px-2 py-0.5 rounded-full ${f.visibility === "Public" ? "text-green-400" : "text-slate-500"}`}
                  style={{ background: f.visibility === "Public" ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)" }}>
                  {f.visibility}
                </span>
              </span>
              <span className="col-span-2 text-right text-green-400 text-xs font-medium">
                {f.earnings > 0 ? `$${f.earnings.toFixed(2)}` : "—"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── DATABASE TAB ─────────────── */
function DatabaseTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Database</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Database Storage", value: "48.2 GB", max: "250 GB", pct: 19, color: "#7c3aed" },
          { label: "Projects", value: "3", max: "5", pct: 60, color: "#3b82f6" },
          { label: "Records", value: "1.2M", max: "5M", pct: 24, color: "#10b981" },
        ].map(({ label, value, max, pct, color }) => (
          <div key={label} className="p-5 rounded-2xl"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
            <p className="text-xs text-slate-600 mb-3">of {max}</p>
            <div className="h-1.5 rounded-full bg-white/5">
              <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6 text-center"
        style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Database size={32} className="text-purple-400 mx-auto mb-3" />
        <h3 className="text-white font-semibold mb-1">Upgrade Your Database Plan</h3>
        <p className="text-slate-500 text-sm mb-4">Get more storage, projects, and records with a lifetime plan.</p>
        <Link href="/database" className="btn-primary py-2.5 px-6 text-sm inline-flex">View Plans</Link>
      </div>
    </div>
  );
}

/* ─────────────── SHARED FILES TAB ─────────────── */
function SharedTab() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Shared Files</h2>
      <div className="space-y-3">
        {RECENT_FILES.filter((f) => f.visibility === "Public").map((f) => (
          <div key={f.name} className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa" }}>
              {f.type.slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{f.name}</p>
              <p className="text-xs text-slate-500">{f.size} · {f.downloads} downloads · {f.uploaded}</p>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-green-400" />
              <span className="text-xs text-green-400">Public</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── EARNINGS TAB ─────────────── */
function EarningsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Earnings</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Unlocks", value: "12,483", color: "#7c3aed" },
          { label: "Ad Revenue", value: "$524.50", color: "#3b82f6" },
          { label: "RPM", value: "$4.20", color: "#10b981" },
          { label: "Est. Monthly", value: "$785", color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-5 rounded-2xl"
            style={{ background: "rgba(13,13,26,0.9)", border: `1px solid ${color}25` }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Weekly Earnings</h3>
        <EarningsChart data={EARNINGS_DATA} />
        <div className="flex items-center justify-between mt-2">
          {EARNINGS_DATA.map((d) => (
            <div key={d.day} className="text-center">
              <span className="text-xs text-slate-600">{d.day}</span>
              <p className="text-xs text-purple-400 font-medium">${d.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── ANALYTICS TAB ─────────────── */
function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Top Performing Files</h3>
          <div className="space-y-3">
            {TOP_FILES.map((f, i) => (
              <div key={f.name} className="flex items-center gap-3">
                <span className="text-xs font-bold text-purple-400 w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">{f.name}</p>
                  <div className="h-1.5 rounded-full bg-white/5 mt-1">
                    <div className="h-1.5 rounded-full"
                      style={{ width: `${(f.views / TOP_FILES[0].views) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#3b82f6)" }} />
                  </div>
                </div>
                <span className="text-xs text-slate-400">{f.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm font-semibold text-white mb-4">Earnings Per File</h3>
          <div className="space-y-3">
            {TOP_FILES.map((f) => (
              <div key={f.name} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 text-xs truncate flex-1 mr-3">{f.name}</span>
                <span className="text-green-400 font-semibold text-xs">${f.earnings.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Bandwidth Used", value: "1.2 TB", color: "#3b82f6" },
          { label: "Used Storage", value: "310 GB", color: "#7c3aed" },
          { label: "Available", value: "690 GB", color: "#10b981" },
          { label: "Database Usage", value: "48.2 GB", color: "#f59e0b" },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── PAYOUTS TAB ─────────────── */
function PayoutsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Payouts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Available Balance", value: "$524.50", sub: "Ready to withdraw", color: "#10b981" },
          { label: "Pending", value: "$724.25", sub: "Processing (3-5 days)", color: "#f59e0b" },
          { label: "Total Paid", value: "$0.00", sub: "All time payouts", color: "#3b82f6" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="p-5 rounded-2xl"
            style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-600">{sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5"
        style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold text-white mb-4">Payout Method</h3>
        <div className="p-4 rounded-xl text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <CreditCard size={24} className="text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No payout method added yet.</p>
          <p className="text-xs text-slate-600 mt-1">Contact support to set up payouts.</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── SETTINGS TAB ─────────────── */
function SettingsTab({ user }: { user: any }) {
  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-lg font-bold text-white">Settings</h2>
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: "rgba(13,13,26,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-sm font-semibold text-white">Profile</h3>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
          <input defaultValue={user.name} className="input-field" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
          <input defaultValue={user.email} className="input-field" disabled
            style={{ opacity: 0.6, cursor: "not-allowed" }} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Account Type</label>
          <div className="input-field text-sm text-purple-400">Premium User</div>
        </div>
        <button className="btn-primary py-2.5 px-6 text-sm">Save Changes</button>
      </div>
    </div>
  );
}


