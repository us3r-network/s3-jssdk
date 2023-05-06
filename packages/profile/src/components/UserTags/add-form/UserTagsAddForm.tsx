import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserTagsAddFormElements from "./UserTagsAddFormElements";
import {
  UserTagsAddFormContext,
  UserTagsAddFormContextValue,
} from "./UserTagsAddFormContext";
import { UserTagsAddFormDefaultChildren } from "./UserTagsAddFormDefaultChildren";

export interface UserTagsAddFormIncomingProps {
  onSuccessfullySubmit?: () => void;
}

export interface UserTagsAddFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserTagsAddFormContextValue
    >,
    UserTagsAddFormIncomingProps {}

function UserTagsAddForm({
  children,
  onError,
  onSuccessfullySubmit,
  ...props
}: UserTagsAddFormProps) {
  const { profile, profileLoading, updateProfile } = useProfileState();

  const [tag, setTag] = useState("");

  const [creating, setCreating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const disabled = useMemo(
    () => profileLoading || !profile || creating,
    [profileLoading, profile, creating]
  );

  useEffect(() => {
    setErrMsg("");
  }, [tag]);

  const submitCreate = useCallback(async () => {
    try {
      setCreating(true);
      await updateProfile({
        tags: [...(profile?.tags || []), tag],
      });
      if (onSuccessfullySubmit) onSuccessfullySubmit();
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      setCreating(false);
    }
  }, [tag, profile, updateProfile, onSuccessfullySubmit]);

  const businessProps = {
    "data-us3r-usertags-add-form": "",
    "data-creating": creating || undefined,
    "data-disabled": disabled || undefined,
  };
  const contextValue = {
    tag,
    setTag,
    creating,
    errMsg,
    disabled,
    submitCreate,
  };
  return (
    <form {...props} {...businessProps}>
      <UserTagsAddFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <UserTagsAddFormDefaultChildren />
        )}
      </UserTagsAddFormContext.Provider>
    </form>
  );
}

const _UserTagsAddForm = Object.assign(UserTagsAddForm, {
  ...UserTagsAddFormElements,
});
export { _UserTagsAddForm as UserTagsAddForm };
