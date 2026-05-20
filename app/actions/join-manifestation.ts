"use server";

import { revalidatePath } from "next/cache";

import {
  JOIN_COMMITMENT_MAX_LEN,
  JOIN_COMMITMENT_MIN_LEN,
} from "@/lib/manifestations/join-bounds";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

export type JoinManifestationState = { error?: string; success?: string };

export async function joinManifestation(
  _prev: JoinManifestationState | undefined,
  formData: FormData,
): Promise<JoinManifestationState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const manifestationId = String(formData.get("manifestation_id") ?? "").trim();
  const note = String(formData.get("commitment_note") ?? "").trim();
  const affirm = String(formData.get("affirm") ?? "");

  if (!manifestationId) {
    return { error: "Missing manifestation." };
  }

  if (affirm !== "on") {
    return { error: "Please confirm the good-faith checkbox to hold this manifestation." };
  }

  if (
    note.length < JOIN_COMMITMENT_MIN_LEN ||
    note.length > JOIN_COMMITMENT_MAX_LEN
  ) {
    return {
      error: `Your note should be between ${JOIN_COMMITMENT_MIN_LEN} and ${JOIN_COMMITMENT_MAX_LEN} characters.`,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);

  if (!user) {
    return {
      error:
        "No signed-in user reached the server. Enable Anonymous sign-ins in Supabase, reload, then try again.",
    };
  }

  const { data: row, error: rowErr } = await supabase
    .from("manifestations")
    .select("user_id")
    .eq("id", manifestationId)
    .maybeSingle();

  if (rowErr) {
    return { error: rowErr.message };
  }
  if (!row) {
    return { error: "That manifestation could not be found." };
  }

  if (row.user_id === user.id) {
    return {
      error: "You already hold this manifestation as its creator.",
    };
  }

  const { error } = await supabase.from("manifestation_joins").insert({
    user_id: user.id,
    manifestation_id: manifestationId,
    commitment_note: note,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already holding this manifestation." };
    }
    return { error: error.message };
  }

  revalidatePath("/manifestations");
  revalidatePath(`/manifestations/${manifestationId}`);

  return {
    success:
      "You are now holding this manifestation with the group. Thank you for taking it seriously.",
  };
}
