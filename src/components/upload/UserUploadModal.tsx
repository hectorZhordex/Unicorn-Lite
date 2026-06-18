"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, Image as ImageIcon, FileArchive, ToggleLeft, ToggleRight } from "lucide-react";
import { useUploadsStore } from "@/lib/uploads-store";
import { useSettingsStore, parseCategories } from "@/lib/settings-store";
import { type Artwork } from "@/types";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UserUploadModal({ open, onClose }: Props) {
  const { addUpload } = useUploadsStore();
  const { settings } = useSettingsStore();
  const categories = parseCategories(settings.categoriesRaw).filter((c) => c.slug !== "all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    resolution: "",
    format: "",
    is_featured: false,
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [downloadFile, setDownloadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setForm({ title: "", description: "", category: "", tags: "", resolution: "", format: "", is_featured: false });
    setPreviewFile(null);
    setDownloadFile(null);
    setPreviewUrl("");
    setDone(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreviewFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewFile) { toast.error("Please upload a preview image."); return; }
    if (!downloadFile) { toast.error("Please upload a download file."); return; }

    setUploading(true);
    await new Promise((r) => setTimeout(r, 1500));

    // Build artwork object — NO username stored or shown
    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + `-${id.slice(-5)}`;

    const newArtwork: Artwork = {
      id,
      title: form.title,
      slug,
      description: form.description,
      preview_url: previewUrl, // object URL stored locally
      download_url: "#",       // in prod: upload to Supabase Storage
      category_id: form.category,
      category: categories.find((c) => c.slug === form.category)
        ? { id: form.category, name: categories.find((c) => c.slug === form.category)!.name, slug: form.category, created_at: new Date().toISOString() }
        : undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      resolution: form.resolution || undefined,
      file_size: downloadFile ? `${(downloadFile.size / 1024 / 1024).toFixed(1)} MB` : undefined,
      file_format: form.format || downloadFile?.name.split(".").pop()?.toUpperCase() || undefined,
      views: 0,
      downloads: 0,
      is_featured: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addUpload(newArtwork);
    setUploading(false);
    setDone(true);
    toast.success("File uploaded successfully!");
    setTimeout(() => { handleClose(); }, 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,5,16,0.88)", backdropFilter: "blur(10px)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(13,13,26,0.98)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <div>
                <h2 className="text-base font-bold text-white">Upload a File</h2>
                <p className="text-xs text-text-muted mt-0.5">Share your design with the community</p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2a55 transparent" }}>
              {done ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
                  >
                    <CheckCircle2 size={32} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">Uploaded Successfully!</h3>
                  <p className="text-text-muted text-sm">Your file is now live on the platform.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Title *</label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Modern Logo Pack"
                      className="input-field"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Brief description of your file..."
                      className="input-field resize-none"
                    />
                  </div>

                  {/* Category + Tags */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Category *</label>
                      <select
                        required
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select...</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Tags</label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        placeholder="logo, modern..."
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Resolution</label>
                      <input
                        type="text"
                        value={form.resolution}
                        onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                        placeholder="3840x2160"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">Format</label>
                      <input
                        type="text"
                        value={form.format}
                        onChange={(e) => setForm({ ...form, format: e.target.value })}
                        placeholder="PSD, AI, PNG"
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Preview Image */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Preview Image *</label>
                    <label className="block cursor-pointer">
                      <input type="file" accept="image/*" onChange={handlePreview} className="hidden" />
                      {previewUrl ? (
                        <div className="relative h-36 rounded-xl overflow-hidden group">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium">Change Image</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-purple-500/50"
                          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.1)" }}
                        >
                          <ImageIcon size={20} className="text-text-muted" />
                          <p className="text-sm text-text-muted">Click to upload preview image</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Download File */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Download File *</label>
                    <label className="block cursor-pointer">
                      <input type="file" onChange={(e) => setDownloadFile(e.target.files?.[0] || null)} className="hidden" />
                      <div
                        className="h-16 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 transition-colors cursor-pointer"
                        style={{
                          background: downloadFile ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
                          borderColor: downloadFile ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)",
                        }}
                      >
                        {downloadFile ? (
                          <><CheckCircle2 size={18} className="text-green-400" /><p className="text-sm text-green-400 font-medium truncate max-w-[240px]">{downloadFile.name}</p></>
                        ) : (
                          <><FileArchive size={18} className="text-text-muted" /><p className="text-sm text-text-muted">Upload ZIP, PSD, AI or any file</p></>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Notice — no username shown */}
                  <div
                    className="flex items-start gap-2.5 p-3 rounded-xl text-xs text-text-muted"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                    Your name will not be shown publicly. Files are listed anonymously on the platform.
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className={`btn-primary w-full py-3.5 text-sm ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2"><Upload size={16} />Upload File</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
