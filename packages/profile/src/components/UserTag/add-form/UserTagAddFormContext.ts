import { createContext, useContext } from "react";

export interface UserTagAddFormContextValue {
  tag: string;
  setTag: (tag: string) => void;
  isAdding: boolean;
  errMsg: string;
  isDisabled: boolean;
  submitAdd: () => Promise<void>;
}

export const UserTagAddFormContext =
  createContext<UserTagAddFormContextValue | null>(null);

export function useUserTagAddFormState() {
  const context = useContext(UserTagAddFormContext);
  if (!context) {
    throw new Error(
      "useUserTagAddFormState can only be used within the UserTagAddForm component"
    );
  }
  return context;
}
