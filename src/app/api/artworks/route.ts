import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "24");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("artworks")
      .select(`*, category:categories(id, name, slug)`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== "all") {
      query = query.eq("categories.slug", category);
    }
    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return NextResponse.json({ artworks: data, total: count });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch artworks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Admin-only: upload artwork
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const supabase = createServiceClient();
    const { data, error } = await supabase.from("artworks").insert([body]).select().single();
    if (error) throw error;
    return NextResponse.json({ artwork: data });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 });
  }
}
