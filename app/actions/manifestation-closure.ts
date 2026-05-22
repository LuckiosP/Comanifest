"use server";

import { revalidatePath } from "next/cache";

import { isManifestationClosable } from "@/lib/manifestations/lifecycle";
import {
  MANIFEST_CLOSE_SUCCESS,
} from "@/lib/manifestations/intention-copy";
import {
  parseReflectionSuccessChoice,
  REFLECTION_MAX_LEN,
  REFLECTION_MIN_LEN,
  reflectionSuccessToDb,
} from "@/lib/manifestations/reflection-bounds";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

export type CloseManifestationState = { error?: string; success?: string };

const NO_SESSION_ERROR =
  "No signed-in user reached the server. Reload the page and try again.";

function revalidateManifestationPaths(manifestationId: string) {
  revalidatePath("/manifestations");
  revalidatePath("/account");
  revalidatePath(`/manifestations/${manifestationId}`);
  revalidatePath(`/manifestations/${manifestationId}/edit`);
}

export async function closeManifestation(
  _prev: CloseManifestationState | undefined,
  formData: FormData,
): Promise<CloseManifestationState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const manifestationId = String(formData.get("manifestation_id") ?? "").trim();
  const reflection = String(formData.get("creator_reflection") ?? "").trim();
  const successRaw = String(formData.get("reflection_success") ?? "").trim();
  const affirm = String(formData.get("affirm_close") ?? "");

  if (!manifestationId) {
    return { error: "Missing manifestation." };
  }
  if (affirm !== "on") {
    return { error: "Please confirm before closing this manifestation." };
  }

  if (
    reflection.length < REFLECTION_MIN_LEN ||
    reflection.length > REFLECTION_MAX_LEN
  ) {
    return {
      error: `Your reflection should be between ${REFLECTION_MIN_LEN} and ${REFLECTION_MAX_LEN} characters.`,
    };
  }

  const successChoice = parseReflectionSuccessChoice(successRaw);
  if (!successChoice) {
    return { error: "Choose how this landed for you." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: NO_SESSION_ERROR };
  }

  const { data, error: loadError } = await supabase
    .from("manifestations")
    .select("user_id, status")
    .eq("id", manifestationId)
    .maybeSingle();

  if (loadError) {
    return { error: loadError.message };
  }
  if (!data) {
    return { error: "That manifestation could not be found." };
  }
  if (data.user_id !== user.id) {
    return { error: "Only the creator can close this manifestation." };
  }
  if (!isManifestationClosable(data)) {
    return { error: "This manifestation is already closed or removed." };
  }

  const { error } = await supabase
    .from("manifestations")
    .update({
      status: "archived",
      creator_reflection: reflection,
      creator_reflection_success: reflectionSuccessToDb(successChoice),
      reflected_at: new Date().toISOString(),
    })
    .eq("id", manifestationId)
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    return { error: error.message };
  }

  revalidateManifestationPaths(manifestationId);
  return { success: MANIFEST_CLOSE_SUCCESS };
}
