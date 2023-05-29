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

export interface AvatarUploadOpts<T> {
  upload: (file: File) => Promise<T>;
  validate: (data: T) => boolean;
  getUrl: (data: T) => Promise<string>;
}
export interface UserInfoEditFormIncomingProps<T> {
  avatarUploadOpts: AvatarUploadOpts<T>;
  onSuccessfullySubmit?: () => void;
}

export interface UserInfoEditFormProps<T>
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserInfoEditFormContextValue<T>
    >,
    UserInfoEditFormIncomingProps<T> {}

function UserInfoEditFormRoot<T>({
  avatarUploadOpts,
  children,
  onSuccessfullySubmit,
  ...props
}: UserInfoEditFormProps<T>) {
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
      if (onSuccessfullySubmit) onSuccessfullySubmit();
    } catch (error) {
      const errMsg = (error as any).message;
      setErrMsg(errMsg);
    } finally {
      setIsUpdating(false);
    }
  }, [avatar, bio, name, updateProfile, onSuccessfullySubmit]);

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
    avatarUploadOpts,
  };
  return (
    <form {...businessProps} {...props}>
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
