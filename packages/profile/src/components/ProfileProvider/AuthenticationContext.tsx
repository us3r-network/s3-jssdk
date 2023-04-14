import { Us3rAuth } from "@us3r-network/auth";
import { DIDSession } from "did-session";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";

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

const defaultContextValue: AuthenticationContextValue = {
  session: undefined,
  status: "unauthenticated",
  ready: false,
  signIn: async () => {},
  signOut: () => {},
};

const AuthenticationContext = createContext(defaultContextValue);

const us3rAuth = new Us3rAuth();
export default function AuthenticationProvider({
  children,
  authAdapter,
}: PropsWithChildren<{
  authAdapter?: AuthenticationContextValue;
}>) {
  const [session, setSession] = useState(defaultContextValue.session);
  const [status, setStatus] = useState(defaultContextValue.status);
  const [ready, setReady] = useState(defaultContextValue.ready);

  useEffect(() => {
    if (authAdapter) return;
    (async () => {
      await us3rAuth.init();
      setSession(us3rAuth.session);
      setStatus(
        us3rAuth.session?.isAuthorized() ? "authenticated" : "unauthenticated"
      );
      setReady(true);
    })();
  }, [authAdapter]);

  const signIn = useCallback(async () => {
    setStatus("loading");
    try {
      await us3rAuth.auth("ethereum");
      setStatus("authenticated");
    } catch (error) {
      setStatus("unauthenticated");
    } finally {
      setSession(us3rAuth.session);
    }
  }, []);

  const signOut = useCallback(() => {
    us3rAuth.removeSession();
    setSession(us3rAuth.session);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({
      session,
      status,
      ready,
      signIn,
      signOut,
    }),
    [session, status, ready, signIn, signOut]
  );
  return (
    <AuthenticationContext.Provider
      value={useMemo(() => authAdapter || value, [authAdapter, value])}
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
