import { HTMLAttributes, useCallback, useEffect, useState } from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserWalletsElements from "./UserWalletsElements";
import {
  UserWalletsContext,
  UserWalletsContextValue,
} from "./UserWalletsContext";
import { UserWalletsDefaultChildren } from "./UserWalletsDefaultChildren";
import { Wallet } from "../../../data-model";
import { useSession } from "@us3r-network/auth-with-rainbowkit";

export interface UserWalletsIncomingProps {
  did?: string;
  onSuccessfullyDelete?: (wallet: Wallet) => void;
  onFailToDelete?: (wallet: Wallet, errMsg: string) => void;
}

export interface UserWalletsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserWalletsContextValue
    >,
    UserWalletsIncomingProps {}

function UserWalletsRoot({
  children,
  onSuccessfullyDelete,
  onFailToDelete,
  ...props
}: UserWalletsProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid, updateProfile } =
    useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";

  const [isLoading, setIsLoading] = useState(true);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setIsLoading(false);
        setWallets(profile?.wallets || []);
      } else {
        setIsLoading(true);
      }
    }
  }, [isLoginUser, did, profileLoading, profile?.wallets]);

  useEffect(() => {
    if (!isLoginUser) {
      setIsLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          setWallets(data?.wallets || []);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isLoginUser, did, getProfileWithDid]);

  const [deletingWalletAddress, setDeletingWalletAddress] = useState(
    new Set<string>()
  );
  const deleteWallet = useCallback(
    async (wallet: Wallet) => {
      if (wallet.primary) return;
      if (deletingWalletAddress.has(wallet.address)) return;
      try {
        setDeletingWalletAddress((prev) => new Set(prev).add(wallet.address));
        await updateProfile({
          wallets:
            profile?.wallets?.filter((w) => w.address !== wallet.address) || [],
        });
        if (onSuccessfullyDelete) onSuccessfullyDelete(wallet);
      } catch (error) {
        const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
        if (onFailToDelete) onFailToDelete(wallet, errMsg);
      } finally {
        setDeletingWalletAddress((prev) => {
          const next = new Set(prev);
          next.delete(wallet.address);
          return next;
        });
      }
    },
    [
      profile,
      updateProfile,
      onSuccessfullyDelete,
      onFailToDelete,
      deletingWalletAddress,
    ]
  );

  const businessProps = {
    "data-us3r-component": "UserWallets",
    "data-loading": isLoading || undefined,
  };
  const contextValue = {
    did,
    isLoginUser,
    isLoading,
    wallets,
    deletingWalletAddress,
    deleteWallet,
  };
  return (
    <form {...props} {...businessProps}>
      <UserWalletsContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <UserWalletsDefaultChildren />)}
      </UserWalletsContext.Provider>
    </form>
  );
}

export const UserWallets = Object.assign(UserWalletsRoot, {
  ...UserWalletsElements,
});
