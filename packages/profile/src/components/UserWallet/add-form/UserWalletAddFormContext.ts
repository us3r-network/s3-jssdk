import { createContext, useContext } from "react";

export interface UserWalletAddFormContextValue {
  address: string;
  setAddress: (address: string) => void;
  isAdding: boolean;
  errMsg: string;
  isDisabled: boolean;
  submitAdd: () => Promise<void>;
}

export const UserWalletAddFormContext =
  createContext<UserWalletAddFormContextValue | null>(null);

export function useUserWalletAddFormState() {
  const context = useContext(UserWalletAddFormContext);
  if (!context) {
    throw new Error(
      "useUserWalletAddFormState can only be used within the UserWalletAddForm component"
    );
  }
  return context;
}
