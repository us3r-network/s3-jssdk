import type { UserAvatarRenderProps } from "./UserAvatar";
import ReactLoading from "react-loading";

export interface UserAvatarChildrenProps extends UserAvatarRenderProps {}

export function UserAvatarChildren({
  loading,
  avatarSrc,
}: UserAvatarChildrenProps) {
  return loading ? (
    <ReactLoading type="spokes" color="#666" width={"32px"} height={"32px"} />
  ) : (
    <img width={"32px"} height={"32px"} src={avatarSrc} />
  );
}
