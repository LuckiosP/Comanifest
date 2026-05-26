import type { ModerationFlagResult } from "./types";

/** Rules-first educated guess — flags only ambiguous / risky content. Most posts pass. */
const HARM_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /\b(kill|murder|assassinate)\b/i,
    reason: "language suggesting harm to people",
  },
  {
    pattern: /\b(hurt|harm|injure|attack)\s+(him|her|them|you|people|someone)\b/i,
    reason: "language targeting harm at someone",
  },
  {
    pattern: /\b(curse|hex|jinx)\b/i,
    reason: "punitive or curse-like language",
  },
  {
    pattern: /\b(revenge|payback|punish|suffer|get what they deserve)\b/i,
    reason: "punitive or revenge-focused language",
  },
  {
    pattern: /\b(die|death to|drop dead)\b/i,
    reason: "language wishing ill on others",
  },
  {
    pattern: /\b(rig the election|suppress votes|steal the election)\b/i,
    reason: "political manipulation language",
  },
  {
    pattern: /\b(hate\s+(all|every)\s+\w+)\b/i,
    reason: "broad exclusion or demeaning language",
  },
];

const EXCLUSION_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /\b(exclude|ban|keep out)\s+(all|every|those)\b/i,
    reason: "exclusionary language toward a group",
  },
];

export function assessManifestationContent(
  title: string,
  intention: string,
): ModerationFlagResult {
  const text = `${title}\n${intention}`.trim();
  const reasons = new Set<string>();

  for (const { pattern, reason } of HARM_PATTERNS) {
    if (pattern.test(text)) {
      reasons.add(reason);
    }
  }

  for (const { pattern, reason } of EXCLUSION_PATTERNS) {
    if (pattern.test(text)) {
      reasons.add(reason);
    }
  }

  return {
    flagged: reasons.size > 0,
    reasons: [...reasons],
  };
}

export function formatModerationFlagReason(reasons: string[]): string {
  if (reasons.length === 0) {
    return "Flagged for manual review.";
  }
  return reasons.join("; ");
}
