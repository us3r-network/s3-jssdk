import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserWalletsAddFormElements from "./UserWalletsAddFormElements";
import {
  UserWalletsAddFormContext,
  UserWalletsAddFormContextValue,
} from "./UserWalletsAddFormContext";
import { UserWalletsAddFormDefaultChildren } from "./UserWalletsAddFormDefaultChildren";
import { WalletChainType } from "../../../data-model";

export interface UserWalletsAddFormIncomingProps {
  onSuccessfullySubmit?: () => void;
}

export interface UserWalletsAddFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserWalletsAddFormContextValue
    >,
    UserWalletsAddFormIncomingProps {}

function UserWalletsAddForm({
  children,
  onError,
  onSuccessfullySubmit,
  ...props
}: UserWalletsAddFormProps) {
  const { profile, profileLoading, updateProfile } = useProfileState();

  const [address, setAddress] = useState("");

  const [creating, setCreating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const disabled = useMemo(
    () => profileLoading || !profile || creating,
    [profileLoading, profile, creating]
  );

  useEffect(() => {
    setErrMsg("");
  }, [address]);

  const submitCreate = useCallback(async () => {
    try {
      setCreating(true);
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
      setCreating(false);
    }
  }, [address, profile, updateProfile, onSuccessfullySubmit]);

  const businessProps = {
    "data-us3r-userwallets-create-form": "",
    "data-creating": creating || undefined,
    "data-disabled": disabled || undefined,
  };
  const contextValue = {
    address,
    setAddress,
    creating,
    errMsg,
    disabled,
    submitCreate,
  };
  return (
    <form {...props} {...businessProps}>
      <UserWalletsAddFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <UserWalletsAddFormDefaultChildren />
        )}
      </UserWalletsAddFormContext.Provider>
    </form>
  );
}

const _UserWalletsAddForm = Object.assign(UserWalletsAddForm, {
  ...UserWalletsAddFormElements,
});
export { _UserWalletsAddForm as UserWalletsAddForm };
