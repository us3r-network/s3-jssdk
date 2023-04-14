import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";

export { lightTheme, darkTheme };
export type ThemeMode = "light" | "dark";
export type Theme = typeof lightTheme | typeof darkTheme;
export const defaultThemeMode = "light";
export const getTheme = (themeConfig?: {
  mode?: ThemeMode;
  darkTheme?: Theme;
  lightTheme?: Theme;
}) => {
  if (themeConfig?.mode === "dark") {
    return { ...darkTheme, ...themeConfig?.darkTheme };
  }
  return { ...lightTheme, ...themeConfig?.lightTheme };
};
