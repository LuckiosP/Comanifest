import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { AdminBreakdownTable } from "@/app/components/AdminBreakdownTable";
import { AdminStatCard } from "@/app/components/AdminStatCard";
import { SiteHeader } from "@/app/components/SiteHeader";
import { isOperatorUser } from "@/lib/admin/access";
import { isAdminDashboardConfigured } from "@/lib/admin/config";
import { fetchAdminDashboardStats } from "@/lib/admin/stats";
import { accountEmailLabel } from "@/lib/auth/session-kind";
import {
  ADMIN_DASHBOARD_LEAD,
  ADMIN_DASHBOARD_TITLE,
  ADMIN_SERVICE_ROLE_HINT,
  ADMIN_STATS_ERROR,
} from "@/lib/manifestations/intention-copy";
import { createServiceSupabaseClient } from "@/lib/notifications/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  createServerSupabaseClient,
  getServerAuthUser,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Operator dashboard",
  robots: { index: false, follow: false },
};

function formatGeneratedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured() || !isAdminDashboardConfigured()) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/sign-in?next=/admin");
  }

  const user = await getServerAuthUser(supabase);
  if (!user) {
    redirect("/sign-in?next=/admin");
  }

  if (!isOperatorUser(user)) {
    notFound();
  }

  const operatorEmail = accountEmailLabel(user);
  const serviceSupabase = createServiceSupabaseClient();
  const statsResult = serviceSupabase
    ? await fetchAdminDashboardStats(serviceSupabase)
    : null;

  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-stone-100/90 via-white to-violet-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
            Private · not linked from the public site
          </p>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50 sm:text-3xl">
            {ADMIN_DASHBOARD_TITLE}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            {ADMIN_DASHBOARD_LEAD}
          </p>
          {operatorEmail ? (
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Signed in as {operatorEmail}
            </p>
          ) : null}
        </div>

        {!serviceSupabase ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            {ADMIN_SERVICE_ROLE_HINT}
          </p>
        ) : statsResult && !statsResult.ok ? (
          <p className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-950 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-100">
            {ADMIN_STATS_ERROR}
            <span className="mt-1 block font-mono text-xs opacity-80">
              {statsResult.error}
            </span>
          </p>
        ) : statsResult?.ok ? (
          <>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Snapshot at {formatGeneratedAt(statsResult.stats.generatedAt)}
            </p>

            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <AdminStatCard
                label="Manifestations"
                value={statsResult.stats.overview.manifestations}
                hint={`${statsResult.stats.overview.manifestationsLast7Days} in the last 7 days`}
              />
              <AdminStatCard
                label="Holds (join rows)"
                value={statsResult.stats.overview.holds}
                hint={`${statsResult.stats.overview.holdsLast7Days} in the last 7 days`}
              />
              <AdminStatCard
                label="Awaiting review"
                value={statsResult.stats.overview.pendingReview}
              />
              <AdminStatCard
                label="Closed with reflection"
                value={statsResult.stats.overview.closedWithReflection}
              />
              {statsResult.stats.traffic ? (
                <>
                  <AdminStatCard
                    label="Traffic (pageviews, 7d)"
                    value={statsResult.stats.traffic.pageviewsLast7Days}
                    hint={
                      statsResult.stats.traffic.missing
                        ? "Traffic table not configured yet (optional drain)."
                        : statsResult.stats.traffic.capped
                          ? "Capped sample (high volume)"
                          : "From Vercel Analytics Drains"
                    }
                  />
                  <AdminStatCard
                    label="Traffic (visitors, 7d)"
                    value={statsResult.stats.traffic.visitorsLast7Days}
                    hint="Approx unique sessions"
                  />
                </>
              ) : null}
              <AdminStatCard
                label="Distinct creators"
                value={statsResult.stats.participants.distinctCreators}
              />
              <AdminStatCard
                label="Distinct holders"
                value={statsResult.stats.participants.distinctHolders}
              />
            </section>

            {statsResult.stats.authUsers ? (
              <section className="grid gap-3 sm:grid-cols-3">
                <AdminStatCard
                  label="Auth accounts"
                  value={statsResult.stats.authUsers.total}
                  hint={
                    statsResult.stats.authUsers.capped
                      ? "Capped at 10k — pagination limit"
                      : "All rows in auth.users"
                  }
                />
                <AdminStatCard
                  label="Email signed in"
                  value={statsResult.stats.authUsers.emailSignedIn}
                />
                <AdminStatCard
                  label="Guest-only sessions"
                  value={statsResult.stats.authUsers.guestOnly}
                />
              </section>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2">
              <AdminBreakdownTable
                title="Manifestations by status"
                rows={statsResult.stats.byStatus}
              />
              <AdminBreakdownTable
                title="Manifestations by category"
                rows={statsResult.stats.byCategory}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <AdminBreakdownTable
                title="Creator country (top 12)"
                rows={statsResult.stats.creatorCountries}
                emptyLabel="No country data yet — set geo migration and deploy on Vercel for edge headers."
              />
              <AdminBreakdownTable
                title="Holder country (top 12)"
                rows={statsResult.stats.holderCountries}
                emptyLabel="No country data yet."
              />
            </div>

            {statsResult.stats.traffic && !statsResult.stats.traffic.missing ? (
              <AdminBreakdownTable
                title="Top pages (pageviews, 7d)"
                rows={statsResult.stats.traffic.topPagesLast7Days}
                emptyLabel="No traffic data yet."
              />
            ) : null}

            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              Country codes are coarse ISO regions from the hosting edge at create/hold
              time — aggregated only, not shown in the public UI. Commitment notes and
              holder text are never listed here.
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}
