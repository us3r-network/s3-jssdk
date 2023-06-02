import { createContext, useContext } from "react";
import type { AvatarUploadOpts } from "./UserInfoEditForm";

export interface UserInfoEditFormContextValue<T> {
  avatar: string;
  setAvatar: (avatar: string) => void;
  isUploadingAvatar: boolean;
  setIsUploadingAvatar: (isUploadingAvatar: boolean) => void;
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  isLoading: boolean;
  isUpdating: boolean;
  errMsg: string;
  isDisabled: boolean;
  submitEdit: () => void;
  avatarUploadOpts: AvatarUploadOpts<T>;
}

export const UserInfoEditFormContext =
  createContext<UserInfoEditFormContextValue<any> | null>(null);

export function useUserInfoEditFormState() {
  const context = useContext(UserInfoEditFormContext);
  if (!context) {
    throw new Error(
      "useUserInfoEditFormState can only be used within the UserInfoEditForm component"
    );
  }
  return context;
}
