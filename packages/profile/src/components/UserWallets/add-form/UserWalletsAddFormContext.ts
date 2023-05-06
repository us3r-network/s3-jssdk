import { createContext, useContext } from "react";

export interface UserWalletsAddFormContextValue {
  address: string;
  setAddress: (address: string) => void;
  creating: boolean;
  errMsg: string;
  disabled: boolean;
  submitCreate: () => Promise<void>;
}

export const UserWalletsAddFormContext =
  createContext<UserWalletsAddFormContextValue | null>(null);

export function useUserWalletsAddFormState() {
  const context = useContext(UserWalletsAddFormContext);
  if (!context) {
    throw new Error(
      "useUserWalletsAddFormState can only be used within the UserWalletsAddForm component"
    );
  }
  return context;
}
