import { HTMLAttributes } from "react";
import { UserAvatar, UserAvatarProps } from "../../UserAvatar";
import { UserName, UserNameProps } from "../../UserName";
import { useUserInfoState } from "./UserInfoContext";

function Avatar(props: UserAvatarProps) {
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

function Name(props: UserNameProps) {
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

function Bio(props: HTMLAttributes<HTMLSpanElement>) {
  const { info } = useUserInfoState();
  return (
    <span data-state-element="Bio" {...props}>
      {info?.bio}
    </span>
  );
}

export default {
  Avatar,
  Name,
  Bio,
};
