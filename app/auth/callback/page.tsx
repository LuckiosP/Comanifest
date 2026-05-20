import Link from "next/link";

import { AuthCallbackClient } from "./CallbackClient";
import { SiteHeader } from "../../components/SiteHeader";

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-full flex-col bg-gradient-to-b from-violet-50/80 via-white to-amber-50/40 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 py-16">
        <AuthCallbackClient />
        <Link
          href="/sign-in"
          className="text-sm font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
        >
          ← Back to sign in
        </Link>
      </main>
    </div>
  );
}
