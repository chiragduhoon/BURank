import { NextRequest, NextResponse } from "next/server";
import { setQuestionOfTheWeek } from "@/lib/sheets";

export const dynamic = "force-dynamic";

// Runs daily via Vercel Cron (see vercel.json): pulls LeetCode's official
// Daily Challenge and sets it as the Question of the Day, resetting First Blood.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: `query { activeDailyCodingChallengeQuestion { link question { title difficulty } } }`,
      }),
      cache: "no-store",
    });

    const json = await res.json();
    const daily = json?.data?.activeDailyCodingChallengeQuestion;
    if (!daily?.link) {
      return NextResponse.json(
        { success: false, message: "Could not fetch LeetCode daily challenge" },
        { status: 502 },
      );
    }

    const url = `https://leetcode.com${daily.link}`;
    const ok = await setQuestionOfTheWeek(url);

    return NextResponse.json({
      success: ok,
      question: daily.question?.title,
      difficulty: daily.question?.difficulty,
      url,
    });
  } catch (err) {
    console.error("/api/cron/qotd error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
