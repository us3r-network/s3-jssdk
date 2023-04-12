import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";

export { lightTheme, darkTheme };
export type ThemeType = "light" | "dark";
export type Theme = typeof lightTheme | typeof darkTheme;
export const defaultThemeType = "light";
export const getTheme = (themeConfig?: {
  themeType?: ThemeType;
  darkTheme?: Theme;
  lightTheme?: Theme;
}) => {
  if (themeConfig?.themeType === "dark") {
    return { ...darkTheme, ...themeConfig?.darkTheme };
  }
  return { ...lightTheme, ...themeConfig?.lightTheme };
};
