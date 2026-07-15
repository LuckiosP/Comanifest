import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

/** Standard Open Graph image dimensions (also used by Facebook link previews). */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const COLORS = {
  midnight: "#1A1B2E",
  moonlit: "#E5E7EB",
  lavender: "#C7B7FF",
  peach: "#FFDAC1",
  slate: "#94A3B8",
  bright: "#F8FAFC",
};

let logoPromise: Promise<string> | null = null;

/** Transparent white constellation mark, embedded as a data URI (memoized). */
function getLogoDataUri(): Promise<string> {
  if (!logoPromise) {
    logoPromise = readFile(
      join(process.cwd(), "public", "brand", "comanifest-logo-mark-white.png"),
    ).then((data) => `data:image/png;base64,${data.toString("base64")}`);
  }
  return logoPromise;
}

function clampTitle(title: string, max = 96): string {
  const trimmed = title.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1)}…` : trimmed;
}

type OgCardInput = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  footer?: string;
};

/** Render a branded Comanifest Open Graph card as a PNG ImageResponse. */
export async function buildOgCard({
  eyebrow,
  title,
  subtitle,
  footer = "comanifest.org",
}: OgCardInput): Promise<ImageResponse> {
  const logoSrc = await getLogoDataUri();
  const displayTitle = clampTitle(title);
  const titleFontSize = displayTitle.length > 52 ? 56 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: COLORS.midnight,
          backgroundImage: `radial-gradient(1100px 700px at 18% -10%, rgba(199,183,255,0.22), rgba(26,27,46,0) 62%), radial-gradient(900px 700px at 100% 115%, rgba(255,218,193,0.14), rgba(26,27,46,0) 60%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={92} height={92} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: 1,
              color: COLORS.moonlit,
            }}
          >
            Comanifest
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: COLORS.lavender,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: titleFontSize,
              fontWeight: 700,
              lineHeight: 1.12,
              color: COLORS.bright,
            }}
          >
            {displayTitle}
          </div>
          {subtitle ? (
            <div
              style={{
                display: "flex",
                fontSize: 32,
                lineHeight: 1.3,
                color: COLORS.lavender,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 26, color: COLORS.slate }}>
            {footer}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: COLORS.peach }}>
            Collective intention, together
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
