import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import UserInfoEditFormElements from "./UserInfoEditFormElements";
import {
  UserInfoEditFormContext,
  UserInfoEditFormContextValue,
} from "./UserInfoEditFormContext";
import { UserInfoEditFormDefaultChildren } from "./UserInfoEditFormDefaultChildren";
import { getDefaultUserAvatarWithDid } from "../../../utils/avatar";
import { useSession } from "@us3r-network/auth-with-rainbowkit";

export interface AvatarUploadOpts<T> {
  /**
   * upload avatar function.
   * @param file avatar file.
   */
  upload: (file: File) => Promise<T>;
  /**
   * validate avatar file.
   * @param data response from upload function.
   */
  validate: (data: T) => boolean;
  /**
   * get avatar url.
   * @param data response from upload function.
   */
  getUrl: (data: T) => Promise<string>;
}
export interface UserInfoEditFormIncomingProps<T> {
  /**
   * avatar upload options
   */
  avatarUploadOpts: AvatarUploadOpts<T>;
  /**
   * callback when profile is successfully updated.
   */
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
  const session = useSession();
  const { profile, profileLoading, updateProfile } = useProfileState();

  const [avatar, setAvatar] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const isDisabled = useMemo(
    () => profileLoading || !profile || isUpdating,
    [profileLoading, profile, isUpdating]
  );

  useEffect(() => {
    setName(profile?.name || "");
    setBio(profile?.bio || "");
  }, [profile?.name, profile?.bio]);

  useEffect(() => {
    if (!isUpdating) {
      setAvatar(profile?.avatar || getDefaultUserAvatarWithDid(session?.id));
    }
  }, [session, profile?.avatar, isUpdating]);

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
    "data-loading": profileLoading || undefined,
    "data-updating": isUpdating || undefined,
    "data-disabled": isDisabled || undefined,
    "data-avatar-uploading": isUploadingAvatar || undefined,
  };
  const contextValue = {
    avatar,
    setAvatar,
    isUploadingAvatar,
    setIsUploadingAvatar,
    name,
    setName,
    bio,
    setBio,
    isLoading: profileLoading,
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
