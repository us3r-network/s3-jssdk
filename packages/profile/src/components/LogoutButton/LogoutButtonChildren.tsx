import type { LogoutButtonRenderProps } from "./LogoutButton";

export interface LogoutButtonChildrenProps extends LogoutButtonRenderProps {}

export function LogoutButtonChildren({
  isAuthenticated,
}: LogoutButtonChildrenProps) {
  return <>{isAuthenticated ? "Logout" : "unauthorized"}</>;
}
