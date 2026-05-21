const DATE_INPUT_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Parse `YYYY-MM-DD` from a form field into an ISO end-of-day UTC timestamp. */
export function parseEndDateInput(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!DATE_INPUT_RE.test(trimmed)) {
    return null;
  }

  const [year, month, day] = trimmed.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }

  return candidate;
}

/** Today at UTC midnight — compare against end-date calendar days. */
export function utcTodayStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function isEndDateOnOrAfterToday(endDateInput: string): boolean {
  const endsAt = parseEndDateInput(endDateInput);
  if (!endsAt) {
    return false;
  }
  const endDayStart = new Date(
    Date.UTC(endsAt.getUTCFullYear(), endsAt.getUTCMonth(), endsAt.getUTCDate()),
  );
  return endDayStart >= utcTodayStart();
}

export function formatManifestationDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** `YYYY-MM-DD` for `<input type="date" min="…">` in the viewer's local timezone. */
export function localTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Map a stored ISO timestamp to `YYYY-MM-DD` for `<input type="date">`. */
export function isoToDateInputValue(iso: string): string {
  const d = new Date(iso);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
