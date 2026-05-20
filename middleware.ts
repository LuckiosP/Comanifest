import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

function env(name: string): string | undefined {
  const raw = process.env[name];
  if (raw == null) return undefined;
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // PKCE magic-link callback: avoid running server `getUser()` here. It can
  // read/write the same auth cookies as the browser client while `?code=`
  // is still being exchanged.
  if (request.nextUrl.pathname === "/auth/callback") {
    return response;
  }

  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    return response;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
