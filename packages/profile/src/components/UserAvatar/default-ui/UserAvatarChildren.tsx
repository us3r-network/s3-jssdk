import AvatarLoadingSvg from "./avatar-loading.svg";
import type { UserAvatarRenderProps } from "../UserAvatar";
import "./default.css";

export interface UserAvatarChildrenProps extends UserAvatarRenderProps {}

export function UserAvatarChildren({
  loading,
  avatarSrc,
}: UserAvatarChildrenProps) {
  return <img src={loading ? AvatarLoadingSvg : avatarSrc} />;
}
