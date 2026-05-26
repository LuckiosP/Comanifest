import { createHash, randomBytes } from "node:crypto";

import { createServiceSupabaseClient } from "@/lib/notifications/config";

const TOKEN_BYTES = 32;
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateModerationReviewToken(): string {
  return randomBytes(TOKEN_BYTES).toString("hex");
}

export async function storeModerationReviewToken(
  manifestationId: string,
): Promise<string | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  const token = generateModerationReviewToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const { error } = await supabase.from("moderation_review_tokens").upsert(
    {
      manifestation_id: manifestationId,
      token: hashToken(token),
      expires_at: expiresAt,
      used_at: null,
    },
    { onConflict: "manifestation_id" },
  );

  if (error) {
    return null;
  }

  return token;
}

type TokenRow = {
  id: string;
  manifestation_id: string;
  expires_at: string;
  used_at: string | null;
};

export async function loadModerationReviewToken(
  token: string,
): Promise<{ row: TokenRow; manifestationId: string } | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("moderation_review_tokens")
    .select("id, manifestation_id, expires_at, used_at")
    .eq("token", hashToken(token))
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as TokenRow;
  if (row.used_at) {
    return null;
  }
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }

  return { row, manifestationId: row.manifestation_id };
}

export async function markModerationReviewTokenUsed(tokenId: string): Promise<void> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("moderation_review_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("id", tokenId);
}
