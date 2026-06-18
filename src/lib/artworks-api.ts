// Central API helpers — all data goes through Supabase via API routes

export async function fetchArtworks(params?: {
  category?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const url = new URL("/api/artworks", window.location.origin);
  if (params?.category && params.category !== "all") url.searchParams.set("category", params.category);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.offset) url.searchParams.set("offset", String(params.offset));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch artworks");
  return res.json();
}

export async function createArtwork(data: {
  title: string;
  slug: string;
  description?: string;
  preview_url: string;
  download_url: string;
  category_id?: string;
  tags?: string[];
  resolution?: string;
  file_format?: string;
  is_featured?: boolean;
}) {
  const res = await fetch("/api/artworks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to create artwork");
  }
  return res.json();
}

export async function fetchStats() {
  const res = await fetch("/api/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
