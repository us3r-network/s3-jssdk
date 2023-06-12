import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserTagAddFormElements from "./UserTagAddFormElements";
import {
  UserTagAddFormContext,
  UserTagAddFormContextValue,
} from "./UserTagAddFormContext";
import { UserTagAddFormDefaultChildren } from "./UserTagAddFormDefaultChildren";

export interface UserTagAddFormIncomingProps {
  /**
   * callback when profile is successfully updated.
   */
  onSuccessfullySubmit?: () => void;
}

export interface UserTagAddFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserTagAddFormContextValue
    >,
    UserTagAddFormIncomingProps {}

function UserTagAddFormRoot({
  children,
  onError,
  onSuccessfullySubmit,
  ...props
}: UserTagAddFormProps) {
  const { profile, profileLoading, updateProfile } = useProfileState();

  const [tag, setTag] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const isDisabled = useMemo(
    () => profileLoading || !profile || isAdding,
    [profileLoading, profile, isAdding]
  );

  useEffect(() => {
    setErrMsg("");
  }, [tag]);

  const submitAdd = useCallback(async () => {
    try {
      setIsAdding(true);
      await updateProfile({
        tags: [...(profile?.tags || []), tag],
      });
      if (onSuccessfullySubmit) onSuccessfullySubmit();
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      setIsAdding(false);
    }
  }, [tag, profile, updateProfile, onSuccessfullySubmit]);

  const businessProps = {
    "data-us3r-component": "UserTagAddForm",
    "data-adding": isAdding || undefined,
    "data-disabled": isDisabled || undefined,
  };
  const contextValue = {
    tag,
    setTag,
    isAdding,
    errMsg,
    isDisabled,
    submitAdd,
  };
  return (
    <form {...businessProps} {...props}>
      <UserTagAddFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <UserTagAddFormDefaultChildren />
        )}
      </UserTagAddFormContext.Provider>
    </form>
  );
}

export const UserTagAddForm = Object.assign(UserTagAddFormRoot, {
  ...UserTagAddFormElements,
});
