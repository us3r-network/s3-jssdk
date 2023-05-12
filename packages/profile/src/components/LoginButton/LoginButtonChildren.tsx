import { UserAvatar } from "../UserAvatar/UserAvatar";
import { UserName } from "../UserName/UserName";
import type { LoginButtonRenderProps } from "./LoginButton";

export interface LoginButtonChildrenProps extends LoginButtonRenderProps {}

export function LoginButtonChildren({
  isAuthenticated,
  isLoading,
}: LoginButtonChildrenProps) {
  return isAuthenticated ? (
    <>
      <UserAvatar />
      <UserName />
    </>
  ) : (
    <span>{isLoading ? "logging" : "Login"}</span>
  );
}
