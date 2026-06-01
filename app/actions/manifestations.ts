"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getRequestCountryCode } from "@/lib/geography/request-country";
import {
  queuePendingModerationReview,
  resolveInitialManifestationStatus,
} from "@/lib/moderation/create-flow";
import { parseManifestationFormFields } from "@/lib/manifestations/manifestation-form-fields";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isManifestationEditable } from "@/lib/manifestations/lifecycle";

export type CreateManifestationState = { error?: string };
export type UpdateManifestationState = { error?: string };

const NO_SESSION_ERROR =
  "No signed-in user reached the server. Enable Anonymous sign-ins in Supabase (Authentication → Providers → Anonymous), reload this page, and try again. If it is already on, check the browser still has cookies for this site (not a private window that cleared them).";

export async function createManifestation(
  _prevState: CreateManifestationState | undefined,
  formData: FormData,
): Promise<CreateManifestationState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Copy .env.example to .env.local and add your URL and anon key.",
    };
  }

  const parsed = parseManifestationFormFields(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: NO_SESSION_ERROR };
  }

  const { title, intention, category, endsAt } = parsed;
  const { status, flaggedReason } = resolveInitialManifestationStatus(title, intention);
  const creatorCountry = await getRequestCountryCode();

  const { data: inserted, error } = await supabase
    .from("manifestations")
    .insert({
      user_id: user.id,
      title,
      intention,
      category,
      timeframe: null,
      join_count: 1,
      ends_at: endsAt.toISOString(),
      status,
      moderation_flagged_reason: flaggedReason,
      creator_country: creatorCountry,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (status === "pending") {
    await queuePendingModerationReview({
      manifestationId: inserted.id,
      title,
      intention,
      category,
      flaggedReason: flaggedReason ?? "Flagged for manual review.",
      creator: user,
    });
  }

  revalidatePath("/manifestations");
  revalidatePath("/account");
  redirect(
    status === "pending"
      ? `/manifestations/${inserted.id}`
      : `/manifestations/${inserted.id}?created=1`,
  );
}

export async function updateManifestation(
  _prevState: UpdateManifestationState | undefined,
  formData: FormData,
): Promise<UpdateManifestationState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const manifestationId = String(formData.get("manifestation_id") ?? "").trim();
  if (!manifestationId) {
    return { error: "Missing manifestation." };
  }

  const parsed = parseManifestationFormFields(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: NO_SESSION_ERROR };
  }

  const { data: existing, error: fetchErr } = await supabase
    .from("manifestations")
    .select("user_id, status")
    .eq("id", manifestationId)
    .maybeSingle();

  if (fetchErr) {
    return { error: fetchErr.message };
  }
  if (!existing) {
    return { error: "That manifestation could not be found." };
  }
  if (existing.user_id !== user.id) {
    return { error: "Only the creator can edit this manifestation." };
  }
  if (!isManifestationEditable(existing)) {
    return {
      error: "This manifestation is no longer active and cannot be edited.",
    };
  }

  const { title, intention, category, endsAt } = parsed;

  const { error } = await supabase
    .from("manifestations")
    .update({
      title,
      intention,
      category,
      ends_at: endsAt.toISOString(),
    })
    .eq("id", manifestationId)
    .eq("user_id", user.id)
    .in("status", ["active", "pending"]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/manifestations");
  revalidatePath("/account");
  revalidatePath(`/manifestations/${manifestationId}`);
  revalidatePath(`/manifestations/${manifestationId}/edit`);
  redirect(`/manifestations/${manifestationId}`);
}
