import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { artwork_id } = await req.json();
    if (!artwork_id) return NextResponse.json({ error: "artwork_id required" }, { status: 400 });

    const supabase = createServiceClient();

    // Get current views then increment by 1
    const { data: artwork } = await supabase
      .from("artworks")
      .select("views")
      .eq("id", artwork_id)
      .single();

    const currentViews = artwork?.views || 0;

    await supabase
      .from("artworks")
      .update({ views: currentViews + 1 })
      .eq("id", artwork_id);

    return NextResponse.json({ success: true, views: currentViews + 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
