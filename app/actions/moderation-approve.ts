"use server";

import { redirect } from "next/navigation";

import { approveManifestationByToken } from "@/lib/moderation/review-actions";

export type ApproveModerationState = { error?: string };

export async function approveManifestationReview(
  _prev: ApproveModerationState | undefined,
  formData: FormData,
): Promise<ApproveModerationState> {
  const token = String(formData.get("token") ?? "").trim();

  if (!token) {
    return { error: "Missing review token." };
  }

  const result = await approveManifestationByToken(token);

  if (!result.ok) {
    return { error: result.error };
  }

  redirect(
    `/moderation/review?approved=1&title=${encodeURIComponent(result.title)}`,
  );
}
