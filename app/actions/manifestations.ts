"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  isEndDateOnOrAfterToday,
  parseEndDateInput,
} from "@/lib/manifestations/dates";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ManifestationCategory } from "@/lib/types/manifestation";

const CATEGORIES: ManifestationCategory[] = [
  "weather",
  "global",
  "personal",
  "sports",
  "wellbeing",
  "symbolic",
  "other",
];

export type CreateManifestationState = { error?: string };

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

  const title = String(formData.get("title") ?? "").trim();
  const intention = String(formData.get("intention") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const endsAtInput = String(formData.get("ends_at") ?? "").trim();

  if (title.length < 3 || title.length > 200) {
    return { error: "Title should be between 3 and 200 characters." };
  }
  if (intention.length < 10 || intention.length > 2000) {
    return { error: "Intention should be between 10 and 2000 characters." };
  }
  if (!CATEGORIES.includes(category as ManifestationCategory)) {
    return { error: "Pick a valid category." };
  }

  if (!isEndDateOnOrAfterToday(endsAtInput)) {
    return {
      error: "Choose an end date from today onward — when this manifestation closes.",
    };
  }

  const endsAt = parseEndDateInput(endsAtInput);
  if (!endsAt) {
    return { error: "End date is not valid." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Could not connect to Supabase." };
  }

  const user = await getServerAuthUser(supabase);

  if (!user) {
    return {
      error:
        "No signed-in user reached the server. Enable Anonymous sign-ins in Supabase (Authentication → Providers → Anonymous), reload this page, and try again. If it is already on, check the browser still has cookies for this site (not a private window that cleared them).",
    };
  }

  const { error } = await supabase.from("manifestations").insert({
    user_id: user.id,
    title,
    intention,
    category,
    timeframe: null,
    join_count: 1,
    ends_at: endsAt.toISOString(),
    status: "active",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/manifestations");
  revalidatePath("/account");
  redirect("/manifestations");
}
