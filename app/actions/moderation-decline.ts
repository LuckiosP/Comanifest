"use server";

import { redirect } from "next/navigation";

import { declineManifestationByToken } from "@/lib/moderation/review-actions";

export type DeclineModerationState = { error?: string };

export async function declineManifestationReview(
  _prev: DeclineModerationState | undefined,
  formData: FormData,
): Promise<DeclineModerationState> {
  const token = String(formData.get("token") ?? "").trim();
  const feedback = String(formData.get("feedback") ?? "").trim();

  if (!token) {
    return { error: "Missing review token." };
  }

  const result = await declineManifestationByToken(
    token,
    feedback.length > 0 ? feedback : null,
  );

  if (!result.ok) {
    return { error: result.error };
  }

  redirect(
    `/moderation/review?declined=1&title=${encodeURIComponent(result.title)}`,
  );
}
