export type Theme = "light" | "dark";

const themeMap: Record<Theme, string> = {
  dark: "dark",
  light: "emerald",
};

export const renderTheme = (theme: Theme) => {
  document.documentElement.setAttribute("data-theme", themeMap[theme]);
};

export const getCurrerntTheme = (): Theme =>
  (window.localStorage.getItem("theme") as Theme | null) ?? "light";

export const changeTheme = (theme: Theme) =>
  window.localStorage.setItem("theme", theme);
