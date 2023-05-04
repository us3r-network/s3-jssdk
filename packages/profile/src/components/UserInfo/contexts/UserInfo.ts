import { createContext, useContext } from "react";
import { Profile } from "../../../data-model";

export interface UserInfoContextValue {
  did: string;
  isLoginUser: boolean;
  loading: boolean;
  info: Profile | null;
}
export const UserInfoContext = createContext<UserInfoContextValue | null>(null);

export function useUserInfoState() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw Error(
      "useUserInfoState can only be used within the UserInfo component"
    );
  }
  return context;
}
