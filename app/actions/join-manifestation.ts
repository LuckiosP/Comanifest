"use server";

import { revalidatePath } from "next/cache";

import { getRequestCountryCode } from "@/lib/geography/request-country";
import {
  JOIN_COMMITMENT_MAX_LEN,
  JOIN_COMMITMENT_MIN_LEN,
} from "@/lib/manifestations/join-bounds";
import {
  HOLD_WITHDRAW_SUCCESS,
} from "@/lib/manifestations/intention-copy";
import { notifyCreatorOnNewHold } from "@/lib/notifications/notify-creator";
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
    .select("user_id, status, ends_at")
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

  if (row.status !== "active") {
    return {
      error: "This manifestation is no longer open for new holds.",
    };
  }

  if (new Date(row.ends_at).getTime() < Date.now()) {
    return {
      error: "This manifestation has reached its end date and is closed for new holds.",
    };
  }

  const holderCountry = await getRequestCountryCode();

  const { error } = await supabase.from("manifestation_joins").insert({
    user_id: user.id,
    manifestation_id: manifestationId,
    commitment_note: note,
    holder_country: holderCountry,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You're already holding this manifestation." };
    }
    return { error: error.message };
  }

  revalidatePath("/manifestations");
  revalidatePath("/account");
  revalidatePath(`/manifestations/${manifestationId}`);

  await notifyCreatorOnNewHold(manifestationId, supabase);

  return {
    success:
      "You are now holding this manifestation with the group. Thank you for taking it seriously.",
  };
}

export type WithdrawHoldState = { error?: string; success?: string };

export async function withdrawHold(
  _prev: WithdrawHoldState | undefined,
  formData: FormData,
): Promise<WithdrawHoldState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const manifestationId = String(formData.get("manifestation_id") ?? "").trim();
  const affirm = String(formData.get("affirm_withdraw") ?? "");

  if (!manifestationId) {
    return { error: "Missing manifestation." };
  }

  if (affirm !== "on") {
    return {
      error: "Please confirm you are stepping back from holding this manifestation.",
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
        "No signed-in user reached the server. Reload the page and try again.",
    };
  }

  const { data: joinRow, error: joinErr } = await supabase
    .from("manifestation_joins")
    .select("id")
    .eq("manifestation_id", manifestationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (joinErr) {
    return { error: joinErr.message };
  }
  if (!joinRow) {
    return { error: "You are not holding this manifestation." };
  }

  const { error: rpcError } = await supabase.rpc("withdraw_manifestation_hold", {
    p_manifestation_id: manifestationId,
  });

  if (!rpcError) {
    revalidatePath("/manifestations");
    revalidatePath("/account");
    revalidatePath(`/manifestations/${manifestationId}`);
    return { success: HOLD_WITHDRAW_SUCCESS };
  }

  const rpcMissing =
    rpcError.message.includes("withdraw_manifestation_hold") ||
    rpcError.message.includes("Could not find the function") ||
    rpcError.code === "PGRST202";

  if (!rpcMissing) {
    return { error: rpcError.message };
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("manifestation_joins")
    .delete()
    .eq("id", joinRow.id)
    .eq("user_id", user.id)
    .select("id");

  if (deleteError) {
    return { error: deleteError.message };
  }

  if (!deleted?.length) {
    return {
      error:
        "Could not withdraw your hold. Run docs/supabase/migrations/withdraw-hold.sql in the Supabase SQL Editor (adds delete permission and updates the hold count).",
    };
  }

  revalidatePath("/manifestations");
  revalidatePath("/account");
  revalidatePath(`/manifestations/${manifestationId}`);

  return { success: HOLD_WITHDRAW_SUCCESS };
}
