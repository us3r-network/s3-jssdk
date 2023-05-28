import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  configureChains,
  createConfig,
  useAccount,
  useDisconnect,
  WagmiConfig,
} from "wagmi";
import { arbitrum, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import {
  argentWallet,
  trustWallet,
  omniWallet,
  imTokenWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Us3rAuth } from "@us3r-network/auth";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other Wallets",
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      omniWallet({ chains }),
      imTokenWallet({ chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
});

let us3rAuthInstance: Us3rAuth | null = null;
export const getUs3rAuthInstance = () => us3rAuthInstance;

type Session = Us3rAuth["session"];

export type AuthenticationStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated";

export interface AuthenticationContextValue {
  // did-session
  session: Session;
  // authorization status
  status: AuthenticationStatus;
  // session ready
  ready: boolean;
  // sign in action
  signIn: () => Promise<void>;
  // sign out action
  signOut: () => void;
}

const defaultAuthenticationContext: AuthenticationContextValue = {
  session: undefined,
  status: "unauthenticated",
  ready: false,
  signIn: async () => {},
  signOut: () => {},
};
const Us3rAuthWithRainbowkitContext = createContext(
  defaultAuthenticationContext
);

function Us3rAuthWrap({ children }: PropsWithChildren) {
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [session, setSession] = useState<Session>();
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      if (!us3rAuthInstance) {
        us3rAuthInstance = new Us3rAuth();
      }
      await us3rAuthInstance.init();
      setSession(us3rAuthInstance.session);
      setStatus(
        us3rAuthInstance.session?.isAuthorized()
          ? "authenticated"
          : "unauthenticated"
      );
      setReady(true);
    })();
  }, []);

  useAccount({
    async onConnect({ connector, isReconnected }) {
      if (!us3rAuthInstance || isReconnected) {
        return;
      }
      setStatus("loading");
      try {
        const provider = await connector?.getProvider();
        await us3rAuthInstance.auth("ethereum", {
          provider,
        });
        setStatus("authenticated");
      } catch (error) {
        setStatus("unauthenticated");
        disconnect();
      } finally {
        setSession(us3rAuthInstance.session);
      }
    },
  });

  const signIn = useCallback(async () => {
    if (openConnectModal) openConnectModal();
  }, [openConnectModal]);

  const signOut = useCallback(() => {
    if (us3rAuthInstance) {
      us3rAuthInstance.removeSession();
    }
    setSession(undefined);
    setStatus("unauthenticated");
    disconnect();
  }, [disconnect]);

  return (
    <Us3rAuthWithRainbowkitContext.Provider
      value={useMemo(
        () => ({
          session,
          status,
          ready,
          signIn,
          signOut,
        }),
        [session, status, ready, signIn, signOut]
      )}
    >
      {children}
    </Us3rAuthWithRainbowkitContext.Provider>
  );
}

const defaultDarkTheme = darkTheme();
const defaultLightTheme = lightTheme();
type ThemeMode = "light" | "dark";
type ThemeVars = typeof defaultDarkTheme | typeof defaultLightTheme;
export interface Us3rAuthWithRainbowkitProviderProps extends PropsWithChildren {
  appName?: string;
  themeConfig?: {
    mode: ThemeMode;
    darkTheme?: ThemeVars;
    lightTheme?: ThemeVars;
  };
}
export default function Us3rAuthWithRainbowkitProvider({
  children,
  appName,
  themeConfig,
}: Us3rAuthWithRainbowkitProviderProps) {
  const mode = themeConfig?.mode || "dark";
  const darkVars = themeConfig?.darkTheme || defaultDarkTheme;
  const lightVars = themeConfig?.lightTheme || defaultLightTheme;
  const rainbowkitTheme = useMemo(() => {
    return mode === "dark" ? darkVars : lightVars;
  }, [mode, darkVars, lightVars]);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{ appName }}
        theme={rainbowkitTheme}
      >
        <Us3rAuthWrap>{children}</Us3rAuthWrap>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export function useAuthentication() {
  const context = useContext(Us3rAuthWithRainbowkitContext);
  if (!context) {
    throw Error(
      "useAuthentication can only be used within the Us3rAuthWithRainbowkitProvider component"
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
