import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

// Allow larger bodies for base64 preview images
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const slug = searchParams.get("slug");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const supabase = createServiceClient();

    let query = supabase
      .from("artworks")
      .select(`*, category:categories(id, name, slug)`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (slug) {
      query = query.eq("slug", slug);
    }
    if (category && category !== "all") {
      query = query.eq("categories.slug", category);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ artworks: [], total: 0, error: error.message }, { status: 200 });
    }

    return NextResponse.json({ artworks: data || [], total: count || data?.length || 0 });
  } catch (err: any) {
    console.error("Server error:", err.message);
    return NextResponse.json({ artworks: [], total: 0, error: err.message }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title, slug, description, preview_url, download_url,
      category_id, tags, resolution, file_format, is_featured,
    } = body;

    if (!title || !preview_url || !download_url) {
      return NextResponse.json({ error: "title, preview_url and download_url are required" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Resolve category_id from slug if needed
    let resolvedCategoryId = category_id;
    if (category_id && !category_id.match(/^[0-9a-f-]{36}$/i)) {
      // It's a slug, not a UUID — look it up
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category_id)
        .maybeSingle();
      resolvedCategoryId = cat?.id || null;
    }

    const { data, error } = await supabase
      .from("artworks")
      .insert([{
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + `-${Date.now()}`,
        description: description || "",
        preview_url,
        download_url,
        category_id: resolvedCategoryId || null,
        tags: tags || [],
        resolution: resolution || null,
        file_format: file_format || null,
        is_featured: is_featured || false,
        is_active: true,
        views: 0,
        downloads: 0,
      }])
      .select(`*, category:categories(id, name, slug)`)
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ artwork: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
