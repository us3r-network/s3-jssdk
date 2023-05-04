import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserInfoEditFormElements from "./UserInfoEditFormElements";
import {
  UserInfoEditFormContext,
  UserInfoEditFormContextValue,
} from "./UserInfoEditFormContext";
import { useUserInfoState } from "../info";
import { UserInfoEditFormDefaultChildren } from "./UserInfoEditFormDefaultChildren";

export interface UserInfoEditFormProps
  extends ChildrenRenderProps<
    HTMLAttributes<HTMLFormElement>,
    UserInfoEditFormContextValue
  > {}

function UserInfoEditForm({ children, ...props }: UserInfoEditFormProps) {
  const { isLoginUser, info } = useUserInfoState();
  const { updateProfile } = useProfileState();

  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [updating, setUpdating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const disabled = useMemo(
    () => !isLoginUser || updating,
    [isLoginUser, updating]
  );

  useEffect(() => {
    setAvatar(info?.avatar || "");
    setName(info?.name || "");
    setBio(info?.bio || "");
  }, [info?.avatar, info?.name, info?.bio]);

  useEffect(() => {
    setErrMsg("");
  }, [avatar, name, bio]);

  const submitEdit = useCallback(async () => {
    try {
      setUpdating(true);
      await updateProfile({
        avatar: avatar,
        name: name,
        bio: bio,
      });
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      setUpdating(false);
    }
  }, [avatar, bio, name, updateProfile]);

  const businessProps = {
    "data-us3r-userinfo-edit-form": "",
    "data-updating": updating || undefined,
    "data-disabled": disabled || undefined,
  };
  const contextValue = {
    avatar,
    setAvatar,
    name,
    setName,
    bio,
    setBio,
    updating,
    errMsg,
    disabled,
    submitEdit,
  };
  return (
    <UserInfoEditFormContext.Provider value={contextValue}>
      <form {...props} {...businessProps}>
        {childrenRender(
          children,
          contextValue,
          <UserInfoEditFormDefaultChildren />
        )}
      </form>
    </UserInfoEditFormContext.Provider>
  );
}

const _UserInfoEditForm = Object.assign(UserInfoEditForm, {
  ...UserInfoEditFormElements,
});
export { _UserInfoEditForm as UserInfoEditForm };
