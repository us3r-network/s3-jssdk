import {
  getDefaultConfig
} from "@rainbow-me/rainbowkit";
import { _chains, _transports } from "@rainbow-me/rainbowkit/dist/config/getDefaultConfig";
import { http } from "wagmi";
import {
  arbitrum,
  arbitrumGoerli,
  base,
  baseGoerli,
  bsc,
  bscTestnet,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  zora,
  zoraTestnet,
} from "wagmi/chains";

export const defaultChains = [
  mainnet,
  polygon,
  bsc,
  optimism,
  arbitrum,
  base,
  zora,
  goerli,
  polygonMumbai,
  bscTestnet,
  arbitrumGoerli,
  optimismGoerli,
  baseGoerli,
  zoraTestnet
];

export const getDefaultWagmiConfig = () => {
  return getDefaultConfig({
    appName: 'Us3rAuth',
    projectId: '',
    chains: [mainnet],
    transports: {
      [mainnet.id]: http(),
    },
  })
};

export const getWagmiConfigByProjectId = (
  projectId: string,
  appName: string,
  chains?: _chains,
) => {
  if (!projectId) {
    throw new Error("projectId is required");
  }
  if (!appName) {
    throw new Error("appName is required");
  }
  if (!chains) {
    chains = defaultChains as unknown as _chains;
  }
  const transports:_transports = chains.reduce((acc, chain) => {
    acc = {...acc, [chain.id] : http()};
    return acc;
  }, {});
  return getDefaultConfig({
    appName,
    projectId,
    chains: chains as _chains,
    transports
  })
};
