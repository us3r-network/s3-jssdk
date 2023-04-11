import { DIDSession } from "did-session";
import { SolanaWebAuth, getAccountIdByNetwork } from "@didtools/pkh-solana";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";

export const SessionKey = "did";
export const SessionAuthWithKey = "session-auth-with";

export type BlockChain = "ethereum" | "solana";

type EthereumAuthConfig = {
  provider?: any;
  chainId?: string;
  resources?: string[];
};

type SolanaAuthConfig = {
  provider?: any;
  network?: "mainnet" | "testnet" | "devnet";
  resources?: string[];
};

type AuthConfigs = {
  ethereum: EthereumAuthConfig;
  solana: SolanaAuthConfig;
};
type AuthConfig<T extends BlockChain> = ReturnType<() => AuthConfigs[T]>;

async function authWithEthProvider({
  provider,
  chainId,
  resources,
}: Required<EthereumAuthConfig>) {
  const addresses = await provider.enable({
    method: "eth_requestAccounts",
  });
  const accountId = await getAccountId(provider, addresses[0]);
  const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId);
  accountId.chainId.reference = chainId;
  return await DIDSession.authorize(authMethod, {
    resources,
  });
}

async function authWithSolProvider({
  provider,
  network,
  resources,
}: Required<SolanaAuthConfig>) {
  const address = await provider.connect();
  const accountId = getAccountIdByNetwork(
    network,
    address.publicKey.toString()
  );
  const authMethod = await SolanaWebAuth.getAuthMethod(provider, accountId);
  return await DIDSession.authorize(authMethod, {
    resources,
  });
}

const defaultResources = ["ceramic://*"];

export class Us3rAuth {
  session: DIDSession | undefined;
  constructor() {
    this.session = undefined;
  }

  /**
   * @description init session
   * @returns {Promise<void>}
   */
  public async init(): Promise<void> {
    const sessionStr = localStorage.getItem(SessionKey);

    if (sessionStr) {
      const session = await DIDSession.fromSession(sessionStr);

      if (!session || (session.hasSession && session.isExpired)) {
        this.session = undefined;
      } else {
        this.session = session;
      }
    }
  }

  /**
   * @description auth with blockchain
   * @param {BlockChain} chain - blockchain name
   * @param {AuthConfig<T>} config - auth config
   * @returns {Promise<void>}
   */
  public async auth<T extends BlockChain>(
    chain: T,
    config?: AuthConfig<T>
  ): Promise<void> {
    switch (chain) {
      case "ethereum":
        this.session = await authWithEthProvider({
          provider: config?.provider || (window as any).ethereum,
          chainId: (config as EthereumAuthConfig)?.chainId || "1",
          resources: config?.resources || defaultResources,
        });
        break;
      case "solana":
        this.session = await authWithSolProvider({
          provider: config?.provider || (window as any).phantom.solana,
          network: (config as SolanaAuthConfig)?.network || "mainnet",
          resources: config?.resources || defaultResources,
        });
        break;
      default:
        return;
    }
    localStorage.setItem(SessionKey, this.session.serialize());
    localStorage.setItem(SessionAuthWithKey, chain);
  }

  /**
   * @description remove session
   * @returns {Promise<void>}
   */
  public async removeSession(): Promise<void> {
    localStorage.removeItem(SessionKey);
    this.session = undefined;
  }
}
