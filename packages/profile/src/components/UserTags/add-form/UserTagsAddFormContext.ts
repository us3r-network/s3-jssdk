import { createContext, useContext } from "react";

export interface UserTagsAddFormContextValue {
  tag: string;
  setTag: (tag: string) => void;
  creating: boolean;
  errMsg: string;
  disabled: boolean;
  submitCreate: () => Promise<void>;
}

export const UserTagsAddFormContext =
  createContext<UserTagsAddFormContextValue | null>(null);

export function useUserTagsAddFormState() {
  const context = useContext(UserTagsAddFormContext);
  if (!context) {
    throw new Error(
      "useUserTagsAddFormState can only be used within the UserTagsAddForm component"
    );
  }
  return context;
}
