import { DIDSession } from "did-session";
import { SolanaWebAuth, getAccountIdByNetwork } from "@didtools/pkh-solana";
import { EthereumWebAuth, getAccountId } from "@didtools/pkh-ethereum";

export const SessionKey = "did";
export const SessionAuthWithKey = "session-auth-with";

export type BlockChain = "ethereum" | "solana";

export interface AuthOpts {
  domain?: string
  statement?: string
  version?: string
  nonce?: string
  requestId?: string
  expirationTime?: string
  resources: Array<string>
  expiresInSecs?: number
}

export type EthereumAuthConfig = {
  provider?: any;
  chainId?: string;
  authOpts?: AuthOpts;
};

type SolanaAuthConfig = {
  provider?: any;
  network?: "mainnet" | "testnet" | "devnet";
  authOpts?: AuthOpts;
};

type AuthConfigs = {
  ethereum: EthereumAuthConfig;
  solana: SolanaAuthConfig;
};
type AuthConfig<T extends BlockChain> = ReturnType<() => AuthConfigs[T]>;

async function authWithEthProvider({
  provider,
  chainId,
  authOpts
}: Required<EthereumAuthConfig>) {
  const addresses = await provider.enable({
    method: "eth_requestAccounts",
  });
  const accountId = await getAccountId(provider, addresses[0]);
  const authMethod = await EthereumWebAuth.getAuthMethod(provider, accountId);
  accountId.chainId.reference = chainId;
  console.log("authWithEthProvider", authMethod, authOpts)
  return await DIDSession.authorize(authMethod, authOpts);
}

async function authWithSolProvider({
  provider,
  network,
  authOpts
}: Required<SolanaAuthConfig>) {
  const address = await provider.connect();
  const accountId = getAccountIdByNetwork(
    network,
    address.publicKey.toString()
  );
  const authMethod = await SolanaWebAuth.getAuthMethod(provider, accountId);
  return await DIDSession.authorize(authMethod, authOpts);
}

const defaultAuthOpts = { resources: ["ceramic://*"] } as AuthOpts;

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
    console.log("auth", chain, config)
    switch (chain) {
      case "ethereum":
        this.session = await authWithEthProvider({
          provider: config?.provider || (window as any).ethereum,
          chainId: (config as EthereumAuthConfig)?.chainId || "1",
          authOpts: config?.authOpts || defaultAuthOpts,
        });
        break;
      case "solana":
        this.session = await authWithSolProvider({
          provider: config?.provider || (window as any).phantom.solana,
          network: (config as SolanaAuthConfig)?.network || "mainnet",
          authOpts: config?.authOpts || defaultAuthOpts,
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
