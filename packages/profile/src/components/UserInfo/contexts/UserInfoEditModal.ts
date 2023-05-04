import { createContext, useContext } from "react";

export interface UserInfoEditModalContextValue {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const UserInfoEditModalContext =
  createContext<UserInfoEditModalContextValue | null>(null);

export function useUserInfoEditModalState() {
  const context = useContext(UserInfoEditModalContext);
  if (!context) {
    throw new Error(
      "useUserInfoEditModalState can only be used within the UserInfoEditModal component"
    );
  }
  return context;
}
