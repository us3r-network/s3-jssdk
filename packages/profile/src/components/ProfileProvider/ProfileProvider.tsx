import { PropsWithChildren, ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { getTheme, Theme, ThemeMode } from "../../themes";
import AuthenticationProvider, {
  AuthenticationContextValue,
} from "./AuthenticationContext";
import ProfileStateProvider from "./ProfileStateContext";

export interface ProfileProviderProps extends PropsWithChildren {
  // ceramic host
  ceramicHost: string;
  // authorization adapter
  authAdapter?: AuthenticationContextValue;
  // theme config
  themeConfig?: {
    mode?: ThemeMode;
    darkTheme?: Theme;
    lightTheme?: Theme;
  };
}

export default function ProfileProvider({
  children,
  ceramicHost,
  authAdapter,
  themeConfig,
}: ProfileProviderProps) {
  if (!ceramicHost) throw Error("ceramicHost is required");

  return (
    <AuthenticationProvider authAdapter={authAdapter}>
      <ProfileStateProvider ceramicHost={ceramicHost}>
        <ThemeProvider theme={getTheme(themeConfig)}>{children}</ThemeProvider>
      </ProfileStateProvider>
    </AuthenticationProvider>
  );
}
