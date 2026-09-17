import "server-only";

const MIN_REJECTION_NOTE_LENGTH = 5;
const MAX_REJECTION_NOTE_LENGTH = 500;

export type RejectionNoteValidationResult =
  | { ok: true; data: string }
  | { ok: false; error: string };

export function validateRejectionNote(
  rawNote: string,
): RejectionNoteValidationResult {
  const note = rawNote.trim();

  if (!note || note.length < MIN_REJECTION_NOTE_LENGTH) {
    return {
      ok: false,
      error: `Rejection reason is required (minimum ${MIN_REJECTION_NOTE_LENGTH} characters).`,
    };
  }

  if (note.length > MAX_REJECTION_NOTE_LENGTH) {
    return {
      ok: false,
      error: `Rejection reason must be at most ${MAX_REJECTION_NOTE_LENGTH} characters.`,
    };
  }

  return { ok: true, data: note };
}
