import { createContext, useContext } from "react";

export interface UserInfoEditFormContextValue {
  avatar: string;
  setAvatar: (avatar: string) => void;
  name: string;
  setName: (name: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  isUpdating: boolean;
  errMsg: string;
  isDisabled: boolean;
  submitEdit: () => void;
}

export const UserInfoEditFormContext =
  createContext<UserInfoEditFormContextValue | null>(null);

export function useUserInfoEditFormState() {
  const context = useContext(UserInfoEditFormContext);
  if (!context) {
    throw new Error(
      "useUserInfoEditFormState can only be used within the UserInfoEditForm component"
    );
  }
  return context;
}
