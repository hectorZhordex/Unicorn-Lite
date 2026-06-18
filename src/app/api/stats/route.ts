import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();

    const [artworksRes, downloadsRes, verificationsRes, viewsRes] = await Promise.all([
      supabase.from("artworks").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("downloads").select("id", { count: "exact", head: true }),
      supabase.from("verifications").select("id", { count: "exact", head: true }).eq("completed", true),
      supabase.from("artworks").select("views").eq("is_active", true),
    ]);

    const totalViews = (viewsRes.data || []).reduce((sum: number, a: any) => sum + (a.views || 0), 0);

    // Top artworks by downloads
    const { data: topArtworks } = await supabase
      .from("artworks")
      .select("id, title, downloads, views, preview_url, category:categories(name)")
      .eq("is_active", true)
      .order("downloads", { ascending: false })
      .limit(8);

    // Recent downloads
    const { data: recentDownloads } = await supabase
      .from("downloads")
      .select("id, artwork_id, created_at, artwork:artworks(title)")
      .order("created_at", { ascending: false })
      .limit(5);

    return NextResponse.json({
      total_artworks: artworksRes.count || 0,
      total_downloads: downloadsRes.count || 0,
      total_verifications: verificationsRes.count || 0,
      total_views: totalViews,
      top_artworks: topArtworks || [],
      recent_downloads: recentDownloads || [],
    });
  } catch (err: any) {
    return NextResponse.json({
      total_artworks: 0,
      total_downloads: 0,
      total_verifications: 0,
      total_views: 0,
      top_artworks: [],
      recent_downloads: [],
      error: err.message,
    });
  }
}
