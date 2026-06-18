import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

const REQUIRED_STEPS = 4;
const MIN_SECONDS = 15;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const artworkId = searchParams.get("artwork_id");
  const sessionId = searchParams.get("session_id");

  if (!artworkId || !sessionId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("verifications")
      .select("*")
      .eq("artwork_id", artworkId)
      .eq("session_id", sessionId)
      .maybeSingle();

    return NextResponse.json({
      steps_completed: data?.steps_completed ?? 0,
      required_steps: REQUIRED_STEPS,
      completed: (data?.steps_completed ?? 0) >= REQUIRED_STEPS,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { artwork_id, session_id, elapsed_seconds } = await req.json();

    if (!artwork_id || !session_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!elapsed_seconds || elapsed_seconds < MIN_SECONDS) {
      return NextResponse.json({
        error: `Insufficient time on sponsor page. Required: ${MIN_SECONDS}s`,
        elapsed: elapsed_seconds
      }, { status: 422 });
    }

    const supabase = createServiceClient();

    // Get or create verification record
    const { data: existing } = await supabase
      .from("verifications")
      .select("*")
      .eq("artwork_id", artwork_id)
      .eq("session_id", session_id)
      .maybeSingle();

    const currentSteps = existing?.steps_completed ?? 0;

    if (currentSteps >= REQUIRED_STEPS) {
      return NextResponse.json({ steps_completed: REQUIRED_STEPS, completed: true, already_done: true });
    }

    const newSteps = currentSteps + 1;
    const completed = newSteps >= REQUIRED_STEPS;

    if (existing) {
      await supabase
        .from("verifications")
        .update({ steps_completed: newSteps, completed, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("verifications").insert([{
        artwork_id, session_id,
        steps_completed: newSteps,
        required_steps: REQUIRED_STEPS,
        completed,
      }]);
    }

    return NextResponse.json({ steps_completed: newSteps, required_steps: REQUIRED_STEPS, completed });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
