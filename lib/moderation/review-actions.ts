import { revalidatePath } from "next/cache";

import { createServiceSupabaseClient } from "@/lib/notifications/config";

import { sendModerationApprovedEmailToCreator, sendModerationDeclinedEmailToCreator } from "./emails";
import {
  loadModerationReviewToken,
  markModerationReviewTokenUsed,
} from "./review-tokens";
import type { ModerationReviewResult } from "./types";

const MAX_DECLINE_FEEDBACK_LENGTH = 1000;

type ManifestationReviewRow = {
  id: string;
  title: string;
  status: string;
  user_id: string;
};

async function loadPendingManifestation(
  manifestationId: string,
): Promise<ManifestationReviewRow | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("manifestations")
    .select("id, title, status, user_id")
    .eq("id", manifestationId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as ManifestationReviewRow;
}

async function loadCreatorEmail(userId: string): Promise<string | null> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) {
    return null;
  }

  return data.user?.email?.trim() ?? null;
}

function revalidateManifestationPaths(manifestationId: string): void {
  revalidatePath("/manifestations");
  revalidatePath("/account");
  revalidatePath(`/manifestations/${manifestationId}`);
}

export async function approveManifestationByToken(
  token: string,
  reviewerLabel = "email review",
): Promise<ModerationReviewResult> {
  const tokenState = await loadModerationReviewToken(token);
  if (!tokenState) {
    return { ok: false, error: "This review link is invalid or has expired." };
  }

  const manifestation = await loadPendingManifestation(tokenState.manifestationId);
  if (!manifestation) {
    return { ok: false, error: "That manifestation could not be found." };
  }
  if (manifestation.status !== "pending") {
    return {
      ok: false,
      error:
        manifestation.status === "active"
          ? "This manifestation was already approved."
          : "This manifestation is no longer awaiting review.",
    };
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Server configuration is incomplete." };
  }

  const reviewedAt = new Date().toISOString();
  const { error } = await supabase
    .from("manifestations")
    .update({
      status: "active",
      moderation_reviewed_at: reviewedAt,
      moderation_reviewed_by: reviewerLabel,
    })
    .eq("id", manifestation.id)
    .eq("status", "pending");

  if (error) {
    return { ok: false, error: error.message };
  }

  await markModerationReviewTokenUsed(tokenState.row.id);

  const creatorEmail = await loadCreatorEmail(manifestation.user_id);
  if (creatorEmail) {
    void sendModerationApprovedEmailToCreator({
      to: creatorEmail,
      title: manifestation.title,
      manifestationId: manifestation.id,
    });
  }

  revalidateManifestationPaths(manifestation.id);

  return {
    ok: true,
    manifestationId: manifestation.id,
    title: manifestation.title,
  };
}

export async function declineManifestationByToken(
  token: string,
  feedback: string | null,
  reviewerLabel = "email review",
): Promise<ModerationReviewResult> {
  const tokenState = await loadModerationReviewToken(token);
  if (!tokenState) {
    return { ok: false, error: "This review link is invalid or has expired." };
  }

  const manifestation = await loadPendingManifestation(tokenState.manifestationId);
  if (!manifestation) {
    return { ok: false, error: "That manifestation could not be found." };
  }
  if (manifestation.status !== "pending") {
    return {
      ok: false,
      error: "This manifestation is no longer awaiting review.",
    };
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Server configuration is incomplete." };
  }

  const trimmedFeedback = feedback?.trim().slice(0, MAX_DECLINE_FEEDBACK_LENGTH) || null;
  const reviewedAt = new Date().toISOString();
  const { error } = await supabase
    .from("manifestations")
    .update({
      status: "archived",
      moderation_reviewed_at: reviewedAt,
      moderation_reviewed_by: reviewerLabel,
      moderation_decline_feedback: trimmedFeedback,
    })
    .eq("id", manifestation.id)
    .eq("status", "pending");

  if (error) {
    return { ok: false, error: error.message };
  }

  await markModerationReviewTokenUsed(tokenState.row.id);

  const creatorEmail = await loadCreatorEmail(manifestation.user_id);
  if (creatorEmail) {
    void sendModerationDeclinedEmailToCreator({
      to: creatorEmail,
      title: manifestation.title,
      feedback: trimmedFeedback,
    });
  }

  revalidateManifestationPaths(manifestation.id);

  return {
    ok: true,
    manifestationId: manifestation.id,
    title: manifestation.title,
  };
}
