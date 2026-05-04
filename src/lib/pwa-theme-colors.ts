export const LIGHT_DEFAULT_THEME_COLOR = "#f0eeff";
export const DARK_DEFAULT_THEME_COLOR = "#122033";

export const LIGHT_DASHBOARD_THEME_COLOR = "#ede8ff";
export const DARK_DASHBOARD_THEME_COLOR = "#16283D";

export function getPwaThemeColor(
  resolvedTheme: "light" | "dark",
  pathname?: string | null,
) {
  const isDashboardRoute = pathname?.startsWith("/dashboard") ?? false;

  if (isDashboardRoute) {
    return resolvedTheme === "light"
      ? LIGHT_DASHBOARD_THEME_COLOR
      : DARK_DASHBOARD_THEME_COLOR;
  }

  return resolvedTheme === "light"
    ? LIGHT_DEFAULT_THEME_COLOR
    : DARK_DEFAULT_THEME_COLOR;
}
