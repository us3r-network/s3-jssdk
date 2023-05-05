import { createContext, useContext } from "react";
import { Wallet } from "../../../data-model";

export interface UserWalletsContextValue {
  did: string;
  isLoginUser: boolean;
  loading: boolean;
  wallets: Wallet[];
  deletingWalletAddress: Set<string>;
  deleteWallet: (wallet: Wallet) => Promise<void>;
}

export const UserWalletsContext = createContext<UserWalletsContextValue | null>(
  null
);

export function useUserWalletsState() {
  const context = useContext(UserWalletsContext);
  if (!context) {
    throw new Error(
      "useUserWalletsState can only be used within the UserWallets component"
    );
  }
  return context;
}

export const UserWalletsItemContext = createContext<Wallet>(null!);

export function useUserWalletsItemState() {
  const context = useContext(UserWalletsItemContext);
  if (!context) {
    throw new Error(
      "useUserWalletsItemState can only be used within the UserWallets.Item component"
    );
  }
  return context;
}
