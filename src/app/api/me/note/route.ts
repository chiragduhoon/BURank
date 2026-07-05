import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateNote } from "@/lib/note";

// Update the signed-in user's own profile note.
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.user?.email?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Please sign in first." },
        { status: 401 },
      );
    }

    const member = await prisma.member.findFirst({ where: { email } });
    if (!member) {
      return NextResponse.json(
        { success: false, message: "Join the leaderboard before setting a note." },
        { status: 404 },
      );
    }

    const body = await req.json();
    const check = validateNote(String(body.note ?? ""));
    if (!check.ok) {
      return NextResponse.json(
        { success: false, message: check.message },
        { status: 400 },
      );
    }

    await prisma.member.update({
      where: { id: member.id },
      data: { note: check.note },
    });

    return NextResponse.json({ success: true, note: check.note });
  } catch (err) {
    console.error("/api/me/note error:", err);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
