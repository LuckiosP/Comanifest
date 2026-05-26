import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { EditManifestationForm } from "@/app/components/EditManifestationForm";
import { SiteHeader } from "@/app/components/SiteHeader";
import { MANIFEST_EDIT_CTA } from "@/lib/manifestations/intention-copy";
import { getManifestationForEdit } from "@/lib/manifestations/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${MANIFEST_EDIT_CTA} — Comanifest`,
    description: "Update the title, intention, category, or end date.",
  };
}

export default async function EditManifestationPage({ params }: Props) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    redirect("/sign-in?next=/manifestations");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(`/sign-in?next=/manifestations/${id}/edit`);
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    redirect(`/sign-in?next=/manifestations/${id}/edit`);
  }

  const manifestation = await getManifestationForEdit(id, user.id);
  if (!manifestation) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col design-page-shell">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            {MANIFEST_EDIT_CTA}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-300">
            Update the wording or end date for your active manifestation. Only
            you can edit what you started.
          </p>
        </div>

        <EditManifestationForm manifestation={manifestation} />

        <div className="flex flex-wrap gap-4 text-sm font-medium">
          <Link
            href={`/manifestations/${id}`}
            className="text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
          >
            ← Back to manifestation
          </Link>
          <Link
            href="/account"
            className="text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
          >
            My account
          </Link>
        </div>
      </main>
    </div>
  );
}
