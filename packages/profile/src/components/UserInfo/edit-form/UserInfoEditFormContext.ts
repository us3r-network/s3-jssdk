import { createContext, useContext } from "react";
import type { AvatarUploadOpts } from "./UserInfoEditForm";

export interface UserInfoEditFormContextValue<T> {
  /**
   * The current avatar URL.
   */
  avatar: string;
  /**
   * Set the current avatar URL.
   */
  setAvatar: (avatar: string) => void;
  /**
   * Whether the avatar is being uploaded.
   */
  isUploadingAvatar: boolean;
  /**
   * Set whether the avatar is being uploaded.
   */
  setIsUploadingAvatar: (isUploadingAvatar: boolean) => void;
  /**
   * The current name.
   */
  name: string;
  /**
   * Set the current name.
   */
  setName: (name: string) => void;
  /**
   * The current bio.
   */
  bio: string;
  /**
   * Set the current bio.
   */
  setBio: (bio: string) => void;
  /**
   * Whether the user info is being loaded.
   */
  isLoading: boolean;
  /**
   * Whether the user info is being updated.
   */
  isUpdating: boolean;
  /**
   * The error message of updating.
   */
  errMsg: string;
  /**
   * Whether the form is disabled.
   */
  isDisabled: boolean;
  /**
   * The method to submit the edit form.
   */
  submitEdit: () => void;
  /**
   * Avatar upload options
   */
  avatarUploadOpts?: AvatarUploadOpts<T>;
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
