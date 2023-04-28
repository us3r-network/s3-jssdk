import AvatarLoadingSvg from "./avatar-loading.svg";
import type { UserAvatarRenderProps } from "../UserAvatar";

export interface UserAvatarChildrenProps extends UserAvatarRenderProps {}

export function UserAvatarChildren({
  loading,
  avatarSrc,
}: UserAvatarChildrenProps) {
  return (
    <img
      width={"32px"}
      height={"32px"}
      src={loading ? AvatarLoadingSvg : avatarSrc}
    />
  );
}
