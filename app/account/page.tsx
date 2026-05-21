import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ManifestationCard } from "@/app/components/ManifestationCard";
import { SiteHeader } from "@/app/components/SiteHeader";
import { listAccountManifestations } from "@/lib/manifestations/account-queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My account — Comanifest",
  description: "Manifestations you started and those you are holding.",
};

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            My account
          </h1>
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            Add Supabase keys in <code className="rounded bg-white/60 px-1 dark:bg-stone-900">.env.local</code>{" "}
            to see manifestations tied to your session.
          </p>
        </main>
      </div>
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/sign-in?next=/account");
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    redirect("/sign-in?next=/account");
  }

  const { created, holding, hint } = await listAccountManifestations(user.id);

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50 sm:text-3xl">
            My account
          </h1>
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            Manifestations you started and those you are holding with others.
          </p>
        </div>

        {hint ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            {hint}
          </p>
        ) : null}

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              Manifestations I started
            </h2>
            <Link
              href="/manifestations/new"
              className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
            >
              Start another →
            </Link>
          </div>
          {created.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-200 bg-white/60 px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800/30 dark:text-stone-400">
              You have not started a manifestation yet.{" "}
              <Link
                href="/manifestations/new"
                className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
              >
                Manifest something
              </Link>
              .
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {created.map((manifestation) => (
                <li key={manifestation.id}>
                  <ManifestationCard
                    manifestation={manifestation}
                    joinsEnabled={false}
                    showStatus
                    showEditLink
                    showCreatorActions
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
            Manifestations I am holding
          </h2>
          {holding.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-200 bg-white/60 px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:bg-stone-800/30 dark:text-stone-400">
              You are not holding anyone else&apos;s manifestation yet.{" "}
              <Link
                href="/manifestations"
                className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
              >
                Browse the feed
              </Link>
              .
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {holding.map((manifestation) => (
                <li key={manifestation.id}>
                  <ManifestationCard
                    manifestation={manifestation}
                    joinsEnabled={false}
                    withdrawEnabled={
                      !manifestation.id.startsWith("sample-")
                    }
                    showStatus
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
