import { useUs3rAuthWithRainbowkit } from "@us3r-network/auth-with-rainbowkit";
import { DIDSession } from "did-session";
import { useMemo, createContext, useContext, PropsWithChildren } from "react";

export type AuthenticationStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated";

export interface AuthenticationContextValue {
  // did-session
  session: DIDSession | undefined;
  // authorization status
  status: AuthenticationStatus;
  // session ready
  ready: boolean;
  // sign in action
  signIn: () => Promise<void>;
  // sign out action
  signOut: () => void;
}

export const defaultAuthenticationContext: AuthenticationContextValue = {
  session: undefined,
  status: "unauthenticated",
  ready: false,
  signIn: async () => {},
  signOut: () => {},
};

const AuthenticationContext = createContext(defaultAuthenticationContext);

export default function AuthenticationProvider({
  children,
  authAdapter,
}: PropsWithChildren<{
  authAdapter?: AuthenticationContextValue;
}>) {
  const defaultAdapter = useUs3rAuthWithRainbowkit();
  return (
    <AuthenticationContext.Provider
      value={useMemo(
        () => authAdapter || defaultAdapter,
        [authAdapter, defaultAdapter]
      )}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw Error(
      "useAuthentication can only be used within the AuthenticationProvider component"
    );
  }
  return context;
}

export function useIsAuthenticated() {
  const { status, session } = useAuthentication();
  return status === "authenticated" && !!session && session?.isAuthorized();
}

export function useSession() {
  const isAuthenticated = useIsAuthenticated();
  const { session } = useAuthentication();
  return isAuthenticated ? session : undefined;
}
