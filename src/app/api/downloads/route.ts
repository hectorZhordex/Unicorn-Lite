import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { artwork_id, session_id } = await req.json();
    if (!artwork_id || !session_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Verify unlocked
    const { data: verification } = await supabase
      .from("verifications")
      .select("completed")
      .eq("artwork_id", artwork_id)
      .eq("session_id", session_id)
      .maybeSingle();

    if (!verification?.completed) {
      return NextResponse.json({ error: "Not verified" }, { status: 403 });
    }

    // Record download
    await supabase.from("downloads").insert([{ artwork_id, session_id }]);

    // Increment download count
    await supabase.rpc("increment_downloads", { artwork_id });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
