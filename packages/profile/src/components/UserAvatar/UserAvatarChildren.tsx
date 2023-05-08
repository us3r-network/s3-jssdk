import { Default } from "react-spinners-css";
import type { UserAvatarRenderProps } from "./UserAvatar";

export interface UserAvatarChildrenProps extends UserAvatarRenderProps {}

export function UserAvatarChildren({
  loading,
  avatarSrc,
}: UserAvatarChildrenProps) {
  return loading ? (
    <Default color="#666" size={32} />
  ) : (
    <img width={"32px"} height={"32px"} src={avatarSrc} />
  );
}
