import type { UserNameRenderProps } from "../UserName";

export interface UserNameChildrenProps extends UserNameRenderProps {}

export function UserNameChildren({ loading, username }: UserNameChildrenProps) {
  return <>{loading ? "" : username}</>;
}
