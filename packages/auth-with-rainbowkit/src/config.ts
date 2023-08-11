import {
  connectorsForWallets,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  omniWallet,
  imTokenWallet,
  metaMaskWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig } from "wagmi";
import { arbitrum, goerli, mainnet, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

export const getDefaultWagmiConfig = () => {
  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [metaMaskWallet({ chains, walletConnectVersion: "1" })],
    },
    {
      groupName: "Other",
      wallets: [
        argentWallet({ chains, walletConnectVersion: "1" }),
        omniWallet({ chains, walletConnectVersion: "1" }),
        imTokenWallet({ chains, walletConnectVersion: "1" }),
      ],
    },
  ]);

  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });
};

export const getWagmiConfigByProjectId = (
  projectId: string,
  appName: string
) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }
  if (!appName) {
    throw new Error("appName is required");
  }
  const { wallets } = getDefaultWallets({
    appName,
    projectId,
    chains,
  });

  const connectors = connectorsForWallets([
    ...wallets,
    {
      groupName: "Other",
      wallets: [
        argentWallet({ projectId, chains }),
        trustWallet({ projectId, chains }),
        omniWallet({ projectId, chains }),
        imTokenWallet({ projectId, chains }),
      ],
    },
  ]);

  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });
};
