import { UserAvatar } from "../../UserAvatar/UserAvatar";
import { UserName } from "../../UserName/UserName";
import type { LoginButtonRenderProps } from "../LoginButton";

export interface LoginButtonChildrenProps extends LoginButtonRenderProps {}

export function LoginButtonChildren({
  isAuthenticated,
  loading,
}: LoginButtonChildrenProps) {
  return isAuthenticated ? (
    <>
      <UserAvatar />
      <UserName />
    </>
  ) : (
    <span>{loading ? "logging" : "Login"}</span>
  );
}
