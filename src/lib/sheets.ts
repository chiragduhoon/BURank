// Data layer for the leaderboard roster and app settings.
// Originally backed by a Google Sheet + Apps Script; now backed by the
// local database via Prisma. Function names are kept for compatibility
// with the API routes that import them.

import { SheetEntry } from "@/types";
import { prisma } from "@/lib/prisma";

const QOTW_URL_KEY = "qotw_url";
const QOTW_TIMESTAMP_KEY = "qotw_timestamp";
const FIRST_BLOOD_KEY = "first_blood";

async function getSetting(key: string): Promise<string> {
  const row = await prisma.appSetting.findUnique({ where: { key } });
  return row?.value ?? "";
}

async function setSetting(key: string, value: string): Promise<void> {
  await prisma.appSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

/** Reads all leaderboard members from the database. */
export async function fetchUsernamesFromSheet(): Promise<SheetEntry[]> {
  try {
    const members = await prisma.member.findMany({
      orderBy: { addedAt: "asc" },
    });

    return members.map((m) => ({
      username: m.username.toLowerCase(),
      email: m.email.toLowerCase(),
      addedAt: m.addedAt.toISOString(),
      yearStudying: m.yearStudying,
      enrollmentNo: m.enrollmentNo ?? "",
      note: m.note,
    }));
  } catch (err) {
    console.error("fetchUsernamesFromSheet error:", err);
    return [];
  }
}

/** Adds a new member to the leaderboard. */
export async function addUsernameToSheet(
  username: string,
  email: string,
  yearStudying: string,
  enrollmentNo: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const clean = username.toLowerCase().trim();

    const existing = await prisma.member.findUnique({
      where: { username: clean },
    });
    if (existing) {
      return {
        success: false,
        message: "This username is already on the leaderboard.",
      };
    }

    await prisma.member.create({
      data: {
        username: clean,
        email: email.toLowerCase().trim(),
        yearStudying,
        // null (not "") when absent — the unique index allows multiple NULLs
        enrollmentNo: enrollmentNo || null,
      },
    });

    return { success: true, message: "Added to leaderboard!" };
  } catch (err) {
    console.error("addUsernameToSheet error:", err);
    return { success: false, message: "Failed to save to database." };
  }
}

export async function deleteUserFromSheet(username: string): Promise<boolean> {
  try {
    const result = await prisma.member.deleteMany({
      where: { username: username.toLowerCase().trim() },
    });
    return result.count > 0;
  } catch (err) {
    console.error("deleteUserFromSheet error:", err);
    return false;
  }
}

export async function setQuestionOfTheWeek(qotw_url: string): Promise<boolean> {
  try {
    await setSetting(QOTW_URL_KEY, qotw_url);
    await setSetting(QOTW_TIMESTAMP_KEY, qotw_url ? new Date().toISOString() : "");
    await setSetting(FIRST_BLOOD_KEY, ""); // reset winner for the new question
    return true;
  } catch (err) {
    console.error("setQuestionOfTheWeek error:", err);
    return false;
  }
}

export async function setFirstBlood(username: string): Promise<boolean> {
  try {
    await setSetting(FIRST_BLOOD_KEY, username);
    return true;
  } catch (err) {
    console.error("setFirstBlood error:", err);
    return false;
  }
}

export async function getQuestionOfTheWeek(): Promise<{
  qotw_url: string;
  qotw_timestamp: string;
  first_blood: string;
}> {
  try {
    const [qotw_url, qotw_timestamp, first_blood] = await Promise.all([
      getSetting(QOTW_URL_KEY),
      getSetting(QOTW_TIMESTAMP_KEY),
      getSetting(FIRST_BLOOD_KEY),
    ]);
    return { qotw_url, qotw_timestamp, first_blood };
  } catch {
    return { qotw_url: "", qotw_timestamp: "", first_blood: "" };
  }
}
