import { HTMLAttributes } from "react";
import { UserAvatar, UserAvatarProps } from "../../UserAvatar";
import { UserName, UserNameProps } from "../../UserName";
import { useUserInfoState } from "../contexts";

export function Avatar(props: UserAvatarProps) {
  const { isLoginUser, did } = useUserInfoState();
  return isLoginUser ? (
    <UserAvatar {...props} />
  ) : (
    <UserAvatar did={did} {...props} />
  );
}

export function Name(props: UserNameProps) {
  const { isLoginUser, did } = useUserInfoState();
  return isLoginUser ? (
    <UserName {...props} />
  ) : (
    <UserName did={did} {...props} />
  );
}

export function Bio(props: HTMLAttributes<HTMLSpanElement>) {
  const { info } = useUserInfoState();
  return (
    <span data-bio="" {...props}>
      {info?.bio}
    </span>
  );
}
