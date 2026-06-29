import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { artwork_id } = await req.json();
    if (!artwork_id) return NextResponse.json({ error: "artwork_id required" }, { status: 400 });

    const supabase = createServiceClient();

    // Get current downloads then increment by 1
    const { data: artwork } = await supabase
      .from("artworks")
      .select("downloads")
      .eq("id", artwork_id)
      .single();

    const currentDownloads = artwork?.downloads || 0;

    await supabase
      .from("artworks")
      .update({ downloads: currentDownloads + 1 })
      .eq("id", artwork_id);

    return NextResponse.json({ success: true, downloads: currentDownloads + 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
