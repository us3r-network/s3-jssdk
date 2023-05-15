import { createContext, useContext } from "react";
import { Profile } from "../../../data-model";
import type { AvatarUploadOpts } from "../edit-form";

export interface UserInfoContextValue<T> {
  did: string;
  isLoginUser: boolean;
  isLoading: boolean;
  info: Profile | null;
  avatarUploadOpts?: AvatarUploadOpts<T>;
}
export const UserInfoContext = createContext<UserInfoContextValue<any> | null>(
  null
);

export function useUserInfoState() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw Error(
      "useUserInfoState can only be used within the UserInfo component"
    );
  }
  return context;
}
