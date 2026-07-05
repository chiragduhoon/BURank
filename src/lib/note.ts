// Validation for member profile notes (public trash-talk/status field).

export const NOTE_MAX_LENGTH = 250;

// Links are the worst abuse vector (spam/phishing) — reject outright.
const LINK_PATTERN = /(https?:\/\/|www\.|\w+\.(com|in|org|net|io|dev|app|xyz|ly)\b)/i;

// Lazy-90% profanity blocklist; admin can clear anything that slips through.
const BLOCKED_WORDS = [
  "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "slut",
  "whore", "nigger", "nigga", "faggot", "retard", "rape", "chutiya",
  "bhosdi", "madarchod", "behenchod", "bhenchod", "randi", "gandu",
  "lund", "lauda", "chodu", "harami",
];

export function validateNote(raw: string): {
  ok: boolean;
  note: string;
  message: string;
} {
  const note = raw.replace(/\s+/g, " ").trim();

  if (note.length > NOTE_MAX_LENGTH) {
    return {
      ok: false,
      note,
      message: `Note must be ${NOTE_MAX_LENGTH} characters or fewer.`,
    };
  }

  if (LINK_PATTERN.test(note)) {
    return { ok: false, note, message: "Links aren't allowed in notes." };
  }

  const lower = note.toLowerCase();
  if (BLOCKED_WORDS.some((w) => lower.includes(w))) {
    return { ok: false, note, message: "Keep it clean — that word isn't allowed." };
  }

  return { ok: true, note, message: "" };
}
