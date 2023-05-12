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
import { UserInfoEditFormDefaultChildren } from "./UserInfoEditFormDefaultChildren";

export interface UserInfoEditFormProps
  extends ChildrenRenderProps<
    HTMLAttributes<HTMLFormElement>,
    UserInfoEditFormContextValue
  > {}

function UserInfoEditFormRoot({ children, ...props }: UserInfoEditFormProps) {
  const { profile, profileLoading, updateProfile } = useProfileState();

  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const isDisabled = useMemo(
    () => profileLoading || !profile || isUpdating,
    [profileLoading, profile, isUpdating]
  );

  useEffect(() => {
    setAvatar(profile?.avatar || "");
    setName(profile?.name || "");
    setBio(profile?.bio || "");
  }, [profile?.avatar, profile?.name, profile?.bio]);

  useEffect(() => {
    setErrMsg("");
  }, [avatar, name, bio]);

  const submitEdit = useCallback(async () => {
    try {
      setIsUpdating(true);
      await updateProfile({
        avatar: avatar,
        name: name,
        bio: bio,
      });
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      setIsUpdating(false);
    }
  }, [avatar, bio, name, updateProfile]);

  const businessProps = {
    "data-us3r-component": "UserInfoEditForm",
    "data-updating": isUpdating || undefined,
    "data-disabled": isDisabled || undefined,
  };
  const contextValue = {
    avatar,
    setAvatar,
    name,
    setName,
    bio,
    setBio,
    isUpdating,
    errMsg,
    isDisabled,
    submitEdit,
  };
  return (
    <form {...props} {...businessProps}>
      <UserInfoEditFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <UserInfoEditFormDefaultChildren />
        )}
      </UserInfoEditFormContext.Provider>
    </form>
  );
}

export const UserInfoEditForm = Object.assign(UserInfoEditFormRoot, {
  ...UserInfoEditFormElements,
});
