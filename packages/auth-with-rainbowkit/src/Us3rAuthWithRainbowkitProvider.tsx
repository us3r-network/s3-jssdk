import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  createAuthenticationAdapter,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitAuthenticationProvider,
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

function Us3rAuthWrap({
  children,
  setRainbowAuthenticationStatus,
}: PropsWithChildren & {
  setRainbowAuthenticationStatus: (status: AuthenticationStatus) => void;
}) {
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
      const authStatus = us3rAuthInstance.session?.isAuthorized()
        ? "authenticated"
        : "unauthenticated";
      setStatus(authStatus);
      setRainbowAuthenticationStatus(authStatus);
      setReady(true);
    })();
  }, [setRainbowAuthenticationStatus]);

  useAccount({
    async onConnect({ connector, isReconnected }) {
      if (!us3rAuthInstance || isReconnected) {
        return;
      }
      setStatus("loading");
      setRainbowAuthenticationStatus("unauthenticated");
      try {
        const provider = await connector?.getProvider();
        await us3rAuthInstance.auth("ethereum", {
          provider,
        });
        setStatus("authenticated");
        setRainbowAuthenticationStatus("authenticated");
      } catch (error) {
        setStatus("unauthenticated");
        setRainbowAuthenticationStatus("unauthenticated");
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
    setRainbowAuthenticationStatus("unauthenticated");
    disconnect();
  }, [disconnect, setRainbowAuthenticationStatus]);

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

/**
 * We want to display RainbowKit's UI as much as possible during the Us3rAuth authorization process.
 * Therefore, we need to use RainbowKitAuthenticationProvider.
 * Actually, we don't need the logic of authenticationAdapter because Us3rAuth has its own authorization process.
 * However, authenticationAdapter is a required item, but fortunately,
 * we found that we can skip the logic of authenticationAdapter when getNonce returns an empty string.
 * And the authorization modal prompt will only pop up when RainbowKit's AuthenticationStatus is unauthenticated.
 * Therefore, in authenticationAdapter, we need to return an empty string for getNonce and any value for other options.
 * And during the Us3rAuth authorization process, set AuthenticationStatus to unauthenticated.
 */
const authenticationAdapter = createAuthenticationAdapter({
  getNonce: async () => {
    return "";
  },
  createMessage: () => {
    return "";
  },
  getMessageBody: () => {
    return "";
  },
  verify: async () => {
    return true;
  },
  signOut: async () => {},
});
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

  const [rainbowAuthenticationStatus, setRainbowAuthenticationStatus] =
    useState<AuthenticationStatus>("unauthenticated");
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitAuthenticationProvider
        adapter={authenticationAdapter}
        status={rainbowAuthenticationStatus}
      >
        <RainbowKitProvider
          chains={chains}
          appInfo={{ appName }}
          theme={rainbowkitTheme}
        >
          <Us3rAuthWrap
            setRainbowAuthenticationStatus={setRainbowAuthenticationStatus}
          >
            {children}
          </Us3rAuthWrap>
        </RainbowKitProvider>
      </RainbowKitAuthenticationProvider>
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
