export const DESIGN_THEME_COOKIE = "comanifest-design-theme";

export type DesignThemeId =
  | "cosmic-indigo"
  | "warm-dawn"
  | "electric-teal";

export type DesignTheme = {
  id: DesignThemeId;
  label: string;
  description: string;
};

export const DESIGN_THEMES: DesignTheme[] = [
  {
    id: "cosmic-indigo",
    label: "Cosmic indigo",
    description: "Midnight and lavender — deeper, dreamier",
  },
  {
    id: "warm-dawn",
    label: "Warm dawn",
    description: "Peach, rose, and amber — softer human warmth",
  },
  {
    id: "electric-teal",
    label: "Electric teal",
    description: "Teal and mint — synchronicity and flow",
  },
];

const DESIGN_THEME_IDS = new Set<string>(DESIGN_THEMES.map((theme) => theme.id));

export function isDesignPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_DESIGN_PREVIEW === "true"
  );
}

export function parseDesignThemeId(value: string | undefined | null): DesignThemeId | null {
  if (!value || !DESIGN_THEME_IDS.has(value)) {
    return null;
  }

  return value as DesignThemeId;
}

export function getDesignTheme(value: string | undefined | null): DesignTheme | null {
  const id = parseDesignThemeId(value);
  if (!id) {
    return null;
  }

  return DESIGN_THEMES.find((theme) => theme.id === id) ?? null;
}
