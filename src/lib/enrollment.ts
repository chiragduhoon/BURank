// Bennett University enrollment number validation.
// Format: <school letter><2-digit admission year><program code><4-digit roll>
// e.g. E24CSEU0001 (engineering), A24ARIU0010, S24…
// The admission year must match the student's selected batch ("24-28" → 24).

export const ENROLLMENT_REGEX = /^[A-Z]\d{2}[A-Z]{2,6}\d{4}$/;

// Incoming freshers haven't been issued enrollment numbers yet,
// so the newest batch may register without one.
export const FRESHER_BATCH = "26-30";

export function validateEnrollment(
  enrollmentNo: string,
  yearStudying: string,
): { ok: boolean; message: string } {
  const enrollment = enrollmentNo.trim().toUpperCase();

  if (!ENROLLMENT_REGEX.test(enrollment)) {
    return {
      ok: false,
      message:
        "Invalid enrollment number. Expected format like E24CSEU0001 or A24ARIU0010.",
    };
  }

  const admissionYear = enrollment.slice(1, 3);
  const batchStartYear = yearStudying.trim().slice(0, 2);

  if (batchStartYear && admissionYear !== batchStartYear) {
    return {
      ok: false,
      message: `Enrollment number ${enrollment} doesn't match your batch ${yearStudying} — the year after the first letter should be ${batchStartYear}.`,
    };
  }

  return { ok: true, message: "" };
}
