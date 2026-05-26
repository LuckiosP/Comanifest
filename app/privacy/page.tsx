import Link from "next/link";
import type { Metadata } from "next";

import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Privacy policy — Comanifest",
  description:
    "How Comanifest collects, uses, and protects your information when you manifest, hold, and browse the community.",
};

const sectionClass =
  "rounded-2xl border border-stone-200/90 bg-white/70 p-5 dark:border-stone-700/80 dark:bg-stone-800/40";
const headingClass = "font-semibold text-stone-900 dark:text-stone-50";
const bodyClass = "mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-col design-page-shell">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Privacy policy
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-300">
            Comanifest is built for collective intention — not surveillance. This
            page explains what we collect, why, and what stays private.
          </p>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            Effective date: 25 May 2026
          </p>
        </div>

        <div className="flex flex-col gap-6 text-stone-700 dark:text-stone-200">
          <section className={sectionClass}>
            <h2 className={headingClass}>Who we are</h2>
            <p className={bodyClass}>
              Comanifest (&quot;we&quot;, &quot;us&quot;) runs the website and
              service at{" "}
              <Link
                href="/"
                className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
              >
                comanifest.org
              </Link>{" "}
              (and related subdomains). If you have questions about this policy,
              contact us at{" "}
              <a
                href="mailto:hello@comanifest.org"
                className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
              >
                hello@comanifest.org
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>What we collect</h2>
            <div className={`${bodyClass} flex flex-col gap-3`}>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Account and session data.
                </strong>{" "}
                When you browse or participate, we create or use a Supabase auth
                session. You may use the site as an anonymous guest, or sign in
                with email via a one-time magic link. If you sign in, we store
                your email address and a user identifier tied to your activity.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Manifestations you start.
                </strong>{" "}
                When you manifest something new, we store the title, intention,
                category, end date, optional timeframe text, and related metadata
                (such as when it was created and how many people are holding it).
                Manifestation content is{" "}
                <strong className="text-stone-800 dark:text-stone-100">
                  public
                </strong>{" "}
                and visible in the feed, search, and share links.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Holds and commitment notes.
                </strong>{" "}
                When you hold someone else&apos;s manifestation, we store your
                private commitment note and link it to your account. Commitment
                notes are{" "}
                <strong className="text-stone-800 dark:text-stone-100">
                  not shown to other users
                </strong>{" "}
                and are not included in hold-update emails to creators.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Notification preferences.
                </strong>{" "}
                If you sign in with email, you can choose how often creators
                receive hold updates (instant, daily, weekly, or off). We store
                that preference with your account.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Creator reflections.
                </strong>{" "}
                After a manifestation ends, creators may add a reflection. That
                text is stored and shown on the manifestation page when provided.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Technical data.
                </strong>{" "}
                We use cookies and similar storage to keep you signed in. Our
                hosting and database providers may log standard request data
                (such as IP address, browser type, and timestamps) for security
                and reliability. When you manifest or hold, we may store an
                approximate country code derived from your connection (for
                aggregated community statistics only — never shown on your public
                profile or manifestation page). When bot protection is enabled, Cloudflare
                Turnstile may process interaction signals to help block abuse.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>How we use your information</h2>
            <ul className={`${bodyClass} list-disc space-y-2 pl-5`}>
              <li>Run the service — manifest, hold, browse, search, and account pages.</li>
              <li>Link your activity to your session or email account.</li>
              <li>
                Send transactional email: magic-link sign-in and, if you opt in,
                hold-update notifications to manifestation creators.
              </li>
              <li>Protect the community from spam and abuse.</li>
              <li>Maintain, secure, and improve the platform.</li>
            </ul>
            <p className={`${bodyClass} mt-3`}>
              We do not sell your personal information. We do not use your data
              for third-party advertising.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>What is public vs private</h2>
            <div className={`${bodyClass} flex flex-col gap-3`}>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Public:
                </strong>{" "}
                manifestation titles, intentions, categories, end dates, hold
                counts, creator reflections, and aggregate community activity.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Private to you:
                </strong>{" "}
                your commitment notes when holding someone else&apos;s
                manifestation, and your notification preferences.
              </p>
              <p>
                <strong className="text-stone-800 dark:text-stone-100">
                  Not displayed to others:
                </strong>{" "}
                your email address and internal user identifier. Other users
                cannot browse a list of who is holding a manifestation.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Service providers</h2>
            <p className={bodyClass}>
              We use trusted processors to operate Comanifest. They handle data
              only on our instructions and for the purposes described here:
            </p>
            <ul className={`${bodyClass} mt-2 list-disc space-y-2 pl-5`}>
              <li>
                <strong className="text-stone-800 dark:text-stone-100">
                  Supabase
                </strong>{" "}
                — authentication, database, and row-level security.
              </li>
              <li>
                <strong className="text-stone-800 dark:text-stone-100">
                  Vercel
                </strong>{" "}
                — application hosting and delivery.
              </li>
              <li>
                <strong className="text-stone-800 dark:text-stone-100">
                  Resend
                </strong>{" "}
                — transactional email (sign-in links and hold updates).
              </li>
              <li>
                <strong className="text-stone-800 dark:text-stone-100">
                  Cloudflare Turnstile
                </strong>{" "}
                — optional bot protection for anonymous sign-in.
              </li>
            </ul>
            <p className={`${bodyClass} mt-3`}>
              Each provider has its own privacy practices. Where they process
              data outside your country, appropriate safeguards may apply under
              their terms and applicable law.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Cookies and local storage</h2>
            <p className={bodyClass}>
              We use essential cookies and browser storage to maintain your
              Supabase session and keep you signed in. These are necessary for
              the site to work. We do not use analytics or advertising cookies
              at this time.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>How long we keep data</h2>
            <p className={bodyClass}>
              We retain account and content data while your account exists and
              as needed to operate the service. If you delete your account or
              ask us to remove personal data, we will delete or anonymise it
              where we can, except where we must keep certain records for legal,
              security, or backup reasons. Public manifestations may remain
              visible until archived or removed under our community guidelines.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Your choices and rights</h2>
            <div className={`${bodyClass} flex flex-col gap-3`}>
              <p>
                You can browse without signing in with email. You can withdraw a
                hold from your account page. Email users can change notification
                frequency in{" "}
                <Link
                  href="/account"
                  className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
                >
                  My account
                </Link>
                .
              </p>
              <p>
                Depending on where you live, you may have rights to access,
                correct, delete, or restrict use of your personal data, or to
                object to certain processing. To exercise these rights, email{" "}
                <a
                  href="mailto:hello@comanifest.org"
                  className="font-medium text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
                >
                  hello@comanifest.org
                </a>
                . We will respond within a reasonable time.
              </p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Children</h2>
            <p className={bodyClass}>
              Comanifest is not directed at children under 13 (or the minimum
              age required in your jurisdiction). We do not knowingly collect
              personal information from children. If you believe a child has
              provided us data, contact us and we will take appropriate steps.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Changes to this policy</h2>
            <p className={bodyClass}>
              We may update this policy as the product evolves. When we make
              material changes, we will post the revised version on this page
              and update the effective date above.
            </p>
          </section>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-6 text-sm font-medium text-stone-800 transition hover:border-violet-300 dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-100"
          >
            ← Home
          </Link>
          <Link
            href="/guidelines"
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-6 text-sm font-medium text-stone-800 transition hover:border-violet-300 dark:border-stone-600 dark:bg-stone-800/80 dark:text-stone-100"
          >
            Community guidelines
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
