import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  getDefaultWallets,
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
  createClient,
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

const { chains, provider, webSocketProvider } = configureChains(
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

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
  webSocketProvider,
});

const us3rAuthInstance = new Us3rAuth();
type Session = typeof us3rAuthInstance.session;

export type AuthenticationStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated";

export interface Us3rAuthContextValue {
  // did-session
  session: Session;
  // authorization status
  status: AuthenticationStatus;
  // session ready
  ready: boolean;
  // sign in action to open rainbowkit modal
  signIn: () => void;
  // sign out action
  signOut: () => void;
}

const defaultContextValue: Us3rAuthContextValue = {
  session: undefined,
  status: "unauthenticated",
  ready: false,
  signIn: () => {},
  signOut: () => {},
};

const Us3rAuthContext = createContext(defaultContextValue);

function Us3rAuthWrap({ children }: PropsWithChildren) {
  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();
  const [session, setSession] = useState<Session>();
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
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
      if (isReconnected) {
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

  const signIn = useCallback(() => {
    if (openConnectModal) openConnectModal();
  }, [openConnectModal]);

  const signOut = useCallback(() => {
    us3rAuthInstance.removeSession();
    setSession(us3rAuthInstance.session);
    setStatus("unauthenticated");
    disconnect();
  }, [disconnect]);

  return (
    <Us3rAuthContext.Provider
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
    </Us3rAuthContext.Provider>
  );
}

export default function Us3rAuthProvider({ children }: PropsWithChildren) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Us3rAuthWrap>{children}</Us3rAuthWrap>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export function useUs3rAuth() {
  const context = useContext(Us3rAuthContext);
  if (!context) {
    throw Error(
      "useUs3rAuth can only be used within the Us3rAuthProvider component"
    );
  }
  return context;
}
