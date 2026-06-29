"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Upload, CheckCircle2, Image as ImageIcon,
  Link as LinkIcon, Cloud, ExternalLink, Info
} from "lucide-react";
import { useSettingsStore, parseCategories } from "@/lib/settings-store";
import { supabase } from "@/lib/supabase";
import { type Artwork } from "@/types";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function UserUploadModal({ open, onClose }: Props) {
  const { settings } = useSettingsStore();
  const categories = parseCategories(settings.categoriesRaw).filter((c) => c.slug !== "all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    resolution: "",
    format: "",
    downloadLink: "",
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(""); // local preview for display
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const reset = () => {
    setForm({ title: "", description: "", category: "", tags: "", resolution: "", format: "", downloadLink: "" });
    setPreviewFile(null);
    setPreviewUrl("");
    setDone(false);
    setUploadProgress("");
  };

  const handleClose = () => { reset(); onClose(); };

  const handlePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Preview image must be under 5MB.");
      return;
    }
    setPreviewFile(f);
    // Use object URL only for local preview display
    setPreviewUrl(URL.createObjectURL(f));
  };

  const isValidUrl = (url: string) => {
    try {
      const u = new URL(url);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch { return false; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!previewFile) { toast.error("Please upload a preview image."); return; }
    if (!form.downloadLink.trim()) { toast.error("Please enter a download link."); return; }
    if (!isValidUrl(form.downloadLink.trim())) { toast.error("Please enter a valid URL (must start with https://)."); return; }

    setUploading(true);
    setUploadProgress("Uploading thumbnail to cloud...");

    try {
      // Upload preview image to Supabase Storage
      const ext = previewFile.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("previews")
        .upload(filePath, previewFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: previewFile.type,
        });

      // Compress + convert to base64 fallback (max 600px, JPEG 75% — keeps it small)
      const compressToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
          const img = new Image();
          const blobUrl = URL.createObjectURL(file);
          img.onload = () => {
            URL.revokeObjectURL(blobUrl);
            const MAX = 600;
            let { width, height } = img;
            if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX; }
            const canvas = document.createElement("canvas");
            canvas.width = width; canvas.height = height;
            canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.75));
          };
          img.onerror = reject;
          img.src = blobUrl;
        });

      if (storageError) {
        console.warn("Supabase storage:", storageError.message);
      }

      setUploadProgress("Saving file info...");

      // Use Supabase CDN URL if available, else compressed base64 (works everywhere)
      let finalPreviewUrl = await compressToBase64(previewFile);
      if (!storageError && storageData) {
        const { data: urlData } = supabase.storage
          .from("previews")
          .getPublicUrl(filePath);
        if (urlData?.publicUrl) {
          finalPreviewUrl = urlData.publicUrl;
        }
      }

      setUploadProgress("Saving to database...");

      // Save to Supabase via API — visible to ALL users immediately
      const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + `-${Date.now()}`;

      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug,
          description: form.description,
          preview_url: finalPreviewUrl,
          download_url: form.downloadLink.trim(),
          category_id: form.category || null,
          tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
          resolution: form.resolution || null,
          file_format: form.format || null,
          is_featured: false,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save to database");
      }

      setUploadProgress("");
      setUploading(false);
      setDone(true);
      toast.success("File uploaded! Visible to all users now.");
      setTimeout(() => { handleClose(); }, 2000);

    } catch (err) {
      setUploading(false);
      setUploadProgress("");
      toast.error("Upload failed. Please try again.");
      console.error(err);
    }
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

            {/* Content */}
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

                  {/* Preview Image → Supabase */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Preview Thumbnail *
                      <span className="ml-2 text-xs text-purple-400 font-normal">Stored in cloud</span>
                    </label>
                    <label className="block cursor-pointer">
                      <input type="file" accept="image/*" onChange={handlePreview} className="hidden" />
                      {previewUrl ? (
                        <div className="relative h-36 rounded-xl overflow-hidden group">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                            <p className="text-white text-sm font-medium">Change Image</p>
                            <p className="text-white/60 text-xs">Max 5MB</p>
                          </div>
                          {/* Supabase badge */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                            style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)", color: "#34d399" }}>
                            <Cloud size={10} />
                            Supabase
                          </div>
                        </div>
                      ) : (
                        <div
                          className="h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:border-purple-500/50"
                          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.1)" }}
                        >
                          <ImageIcon size={22} className="text-text-muted" />
                          <p className="text-sm text-text-muted">Click to upload thumbnail</p>
                          <p className="text-xs text-text-muted">PNG, JPG, WebP — max 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {/* Download Link — external cloud */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">
                      Download Link *
                      <span className="ml-2 text-xs text-blue-400 font-normal">Google Drive / Dropbox / OneDrive / Any link</span>
                    </label>
                    <div className="relative">
                      <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input
                        type="url"
                        required
                        value={form.downloadLink}
                        onChange={(e) => setForm({ ...form, downloadLink: e.target.value })}
                        placeholder="https://drive.google.com/file/d/..."
                        className="input-field pl-10"
                      />
                    </div>

                    {/* Hint box */}
                    <div
                      className="mt-2 flex items-start gap-2.5 p-3 rounded-xl"
                      style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
                    >
                      <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-text-muted space-y-1">
                        <p className="text-blue-300 font-medium">How to get a shareable link:</p>
                        <p><span className="text-white">Google Drive:</span> Right-click file → Share → Anyone with link → Copy link</p>
                        <p><span className="text-white">Dropbox:</span> Click Share → Create link → Copy</p>
                        <p><span className="text-white">OneDrive:</span> Right-click → Share → Copy link</p>
                        <p className="pt-1 text-purple-300">When a visitor completes verification, they will be automatically redirected to this link to download.</p>
                      </div>
                    </div>
                  </div>

                  {/* Anonymous notice */}
                  <div
                    className="flex items-start gap-2.5 p-3 rounded-xl text-xs text-text-muted"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                    Your name will not be shown publicly. Files are listed anonymously on the platform.
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`btn-primary w-full py-3.5 text-sm ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {uploadProgress || "Uploading..."}
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
