import { NextResponse } from "next/server";

import {
  DESIGN_THEME_COOKIE,
  getDesignTheme,
  isDesignPreviewEnabled,
  parseDesignThemeId,
} from "@/lib/design-themes";

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export async function GET(request: Request) {
  if (!isDesignPreviewEnabled()) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { searchParams } = new URL(request.url);
  const themeParam = searchParams.get("theme");
  const redirectTo = safeRedirectPath(searchParams.get("redirect"));

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  if (!themeParam || themeParam === "clear" || themeParam === "default") {
    response.cookies.delete(DESIGN_THEME_COOKIE);
    return response;
  }

  const themeId = parseDesignThemeId(themeParam);
  if (!themeId) {
    return NextResponse.redirect(new URL("/design-preview", request.url));
  }

  response.cookies.set(DESIGN_THEME_COOKIE, themeId, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export async function POST(request: Request) {
  if (!isDesignPreviewEnabled()) {
    return NextResponse.json({ error: "Design preview is disabled." }, { status: 404 });
  }

  const body = (await request.json()) as { theme?: string };
  const theme = getDesignTheme(body.theme ?? null);

  const response = NextResponse.json({
    ok: true,
    theme: theme?.id ?? null,
  });

  if (!theme) {
    response.cookies.delete(DESIGN_THEME_COOKIE);
    return response;
  }

  response.cookies.set(DESIGN_THEME_COOKIE, theme.id, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
