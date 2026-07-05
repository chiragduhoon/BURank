import { NextResponse } from "next/server";
import { getLastMagicLink } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Dev-only helper: returns the most recent magic sign-in link so the
// sign-in page can offer a direct "open link" button when no email
// service is configured. Returns 404 in production.
export async function GET() {
  const link = getLastMagicLink();
  if (!link) {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  return NextResponse.json(link);
}
