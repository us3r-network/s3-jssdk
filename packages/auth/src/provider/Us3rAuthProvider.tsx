import { PropsWithChildren } from "react";

import AuthenticationProvider, {
  AuthenticationContextValue,
} from "./AuthenticationContext";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";

export interface Us3rAuthProviderProps extends PropsWithChildren {
  // us3r authorization adapter
  authAdapter?: AuthenticationContextValue;
}

export default function Us3rAuthProvider({
  children,
  authAdapter,
}: Us3rAuthProviderProps) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <AuthenticationProvider authAdapter={authAdapter}>
        {children}
      </AuthenticationProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
