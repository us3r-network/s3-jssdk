import type { UserNameRenderProps } from "./UserName";

export interface UserNameChildrenProps extends UserNameRenderProps {}

export function UserNameChildren({
  isLoading,
  username,
}: UserNameChildrenProps) {
  return <>{isLoading ? "" : username}</>;
}
