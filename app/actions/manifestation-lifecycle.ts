"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  isManifestationArchivable,
  isManifestationDeletable,
} from "@/lib/manifestations/lifecycle";
import { MANIFEST_ARCHIVE_SUCCESS } from "@/lib/manifestations/intention-copy";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";
import type { ManifestationStatus } from "@/lib/types/manifestation";

export type ManifestationLifecycleState = { error?: string; success?: string };

const NO_SESSION_ERROR =
  "No signed-in user reached the server. Reload the page and try again.";

type CreatorManifestationRow = {
  user_id: string;
  status: ManifestationStatus;
  join_count: number;
};

async function loadCreatorManifestation(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  manifestationId: string,
  userId: string,
): Promise<
  | { ok: true; row: CreatorManifestationRow }
  | { ok: false; error: string }
> {
  const { data, error } = await supabase
    .from("manifestations")
    .select("user_id, status, join_count")
    .eq("id", manifestationId)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }
  if (!data) {
    return { ok: false, error: "That manifestation could not be found." };
  }
  if (data.user_id !== userId) {
    return { ok: false, error: "Only the creator can manage this manifestation." };
  }
  if (data.status === "deleted") {
    return { ok: false, error: "This manifestation has already been deleted." };
  }

  return { ok: true, row: data as CreatorManifestationRow };
}

function revalidateManifestationPaths(manifestationId: string) {
  revalidatePath("/manifestations");
  revalidatePath("/account");
  revalidatePath(`/manifestations/${manifestationId}`);
  revalidatePath(`/manifestations/${manifestationId}/edit`);
}

export async function archiveManifestation(
  _prev: ManifestationLifecycleState | undefined,
  formData: FormData,
): Promise<ManifestationLifecycleState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const manifestationId = String(formData.get("manifestation_id") ?? "").trim();
  const affirm = String(formData.get("affirm_archive") ?? "");

  if (!manifestationId) {
    return { error: "Missing manifestation." };
  }
  if (affirm !== "on") {
    return { error: "Please confirm before archiving this manifestation." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: NO_SESSION_ERROR };
  }

  const loaded = await loadCreatorManifestation(
    supabase,
    manifestationId,
    user.id,
  );
  if (!loaded.ok) {
    return { error: loaded.error };
  }

  if (!isManifestationArchivable(loaded.row)) {
    return { error: "Only active manifestations can be archived." };
  }

  const { error } = await supabase
    .from("manifestations")
    .update({ status: "archived" })
    .eq("id", manifestationId)
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    return { error: error.message };
  }

  revalidateManifestationPaths(manifestationId);
  return { success: MANIFEST_ARCHIVE_SUCCESS };
}

export async function deleteManifestation(
  _prev: ManifestationLifecycleState | undefined,
  formData: FormData,
): Promise<ManifestationLifecycleState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const manifestationId = String(formData.get("manifestation_id") ?? "").trim();
  const affirm = String(formData.get("affirm_delete") ?? "");

  if (!manifestationId) {
    return { error: "Missing manifestation." };
  }
  if (affirm !== "on") {
    return { error: "Please confirm before deleting this manifestation." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    return { error: NO_SESSION_ERROR };
  }

  const loaded = await loadCreatorManifestation(
    supabase,
    manifestationId,
    user.id,
  );
  if (!loaded.ok) {
    return { error: loaded.error };
  }

  if (!isManifestationDeletable(loaded.row)) {
    return {
      error:
        "Others are still holding this manifestation. Archive it first, or wait until they withdraw, before deleting.",
    };
  }

  const { error } = await supabase
    .from("manifestations")
    .update({ status: "deleted" })
    .eq("id", manifestationId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidateManifestationPaths(manifestationId);
  redirect("/account");
}
