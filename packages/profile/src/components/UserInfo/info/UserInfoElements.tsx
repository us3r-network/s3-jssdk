import { HTMLAttributes } from "react";
import { UserAvatar, UserAvatarProps } from "../../UserAvatar";
import { UserName, UserNameProps } from "../../UserName";
import { useUserInfoState } from "./UserInfoContext";

export function Avatar(props: UserAvatarProps) {
  const { isLoginUser, did } = useUserInfoState();
  const avatarProps = {
    "data-state-element": "Avatar",
    ...props,
  };
  if (!isLoginUser) {
    Object.assign(avatarProps, { did });
  }
  return <UserAvatar {...avatarProps} />;
}

export function Name(props: UserNameProps) {
  const { isLoginUser, did } = useUserInfoState();
  const nameProps = {
    "data-state-element": "Name",
    ...props,
  };
  if (!isLoginUser) {
    Object.assign(nameProps, { did });
  }
  return <UserName {...nameProps} />;
}

export function Bio(props: HTMLAttributes<HTMLSpanElement>) {
  const { info } = useUserInfoState();
  return (
    <span data-state-element="Bio" {...props}>
      {info?.bio}
    </span>
  );
}
