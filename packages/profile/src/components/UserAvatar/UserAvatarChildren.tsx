import LoadingSpokes from "../common/Loading/LoadingSpokes";
import type { UserAvatarRenderProps } from "./UserAvatar";

export interface UserAvatarChildrenProps extends UserAvatarRenderProps {}

export function UserAvatarChildren({
  isLoading,
  avatarSrc,
}: UserAvatarChildrenProps) {
  return isLoading ? (
    <LoadingSpokes color="#666" width={32} />
  ) : (
    <img width={"32px"} height={"32px"} src={avatarSrc} />
  );
}
