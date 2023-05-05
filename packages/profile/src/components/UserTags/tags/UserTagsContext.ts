import { createContext, useContext } from "react";

export interface UserTagsContextValue {
  did: string;
  isLoginUser: boolean;
  loading: boolean;
  tags: string[];
}

export const UserTagsContext = createContext<UserTagsContextValue | null>(null);

export function useUserTagsState() {
  const context = useContext(UserTagsContext);
  if (!context) {
    throw new Error(
      "useUserTagsState can only be used within the UserTags component"
    );
  }
  return context;
}
