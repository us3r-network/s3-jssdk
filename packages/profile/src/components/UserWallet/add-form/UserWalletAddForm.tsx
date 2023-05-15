import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserWalletAddFormElements from "./UserWalletAddFormElements";
import {
  UserWalletAddFormContext,
  UserWalletAddFormContextValue,
} from "./UserWalletAddFormContext";
import { UserWalletAddFormDefaultChildren } from "./UserWalletAddFormDefaultChildren";
import { WalletChainType } from "../../../data-model";

export interface UserWalletAddFormIncomingProps {
  onSuccessfullySubmit?: () => void;
}

export interface UserWalletAddFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserWalletAddFormContextValue
    >,
    UserWalletAddFormIncomingProps {}

function UserWalletAddFormRoot({
  children,
  onError,
  onSuccessfullySubmit,
  ...props
}: UserWalletAddFormProps) {
  const { profile, profileLoading, updateProfile } = useProfileState();

  const [address, setAddress] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const isDisabled = useMemo(
    () => profileLoading || !profile || isAdding,
    [profileLoading, profile, isAdding]
  );

  useEffect(() => {
    setErrMsg("");
  }, [address]);

  const submitAdd = useCallback(async () => {
    try {
      setIsAdding(true);
      await updateProfile({
        wallets: [
          ...(profile?.wallets || []),
          {
            address: address,
            chain: "EVM" as WalletChainType,
            primary: false,
          },
        ],
      });
      if (onSuccessfullySubmit) onSuccessfullySubmit();
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      setIsAdding(false);
    }
  }, [address, profile, updateProfile, onSuccessfullySubmit]);

  const businessProps = {
    "data-us3r-component": "UserWalletAddForm",
    "data-adding": isAdding || undefined,
    "data-disabled": isDisabled || undefined,
  };
  const contextValue = {
    address,
    setAddress,
    isAdding,
    errMsg,
    isDisabled,
    submitAdd,
  };
  return (
    <form {...props} {...businessProps}>
      <UserWalletAddFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <UserWalletAddFormDefaultChildren />
        )}
      </UserWalletAddFormContext.Provider>
    </form>
  );
}

export const UserWalletAddForm = Object.assign(UserWalletAddFormRoot, {
  ...UserWalletAddFormElements,
});
