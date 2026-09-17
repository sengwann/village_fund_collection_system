import "server-only";

const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_RESOLUTION_NOTE_LENGTH = 5;
const MAX_RESOLUTION_NOTE_LENGTH = 500;

export type ValidationResult =
  | { ok: true; data: string }
  | { ok: false; error: string };

export function validateDisputeDescription(raw: string): ValidationResult {
  const description = raw.trim();
  if (!description || description.length < MIN_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      error: `Description is required (minimum ${MIN_DESCRIPTION_LENGTH} characters).`,
    };
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      error: `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters.`,
    };
  }
  return { ok: true, data: description };
}

export function validateResolutionNote(raw: string): ValidationResult {
  const note = raw.trim();
  if (!note || note.length < MIN_RESOLUTION_NOTE_LENGTH) {
    return {
      ok: false,
      error: `Resolution note is required (minimum ${MIN_RESOLUTION_NOTE_LENGTH} characters).`,
    };
  }
  if (note.length > MAX_RESOLUTION_NOTE_LENGTH) {
    return {
      ok: false,
      error: `Resolution note must be at most ${MAX_RESOLUTION_NOTE_LENGTH} characters.`,
    };
  }
  return { ok: true, data: note };
}
