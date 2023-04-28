import type { UserNameRenderProps } from "../UserName";
import "./default.css";

export interface UserNameChildrenProps extends UserNameRenderProps {}

export function UserNameChildren({ loading, username }: UserNameChildrenProps) {
  return <>{loading ? "" : username}</>;
}
