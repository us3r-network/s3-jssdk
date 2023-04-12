import React from "react";
import { StyledComponentPropsWithRef } from "styled-components";
import multiavatar from "@multiavatar/multiavatar";
import { Image } from "rebass/styled-components";
import { useProfileForDidOrSession } from "../ProfileProvider/ProfileStateContext";

type UserAvatarProps = StyledComponentPropsWithRef<"img"> & {
  did: string;
};
const getUserAvatarSrc = (did: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(did))}`;

export default function UserAvatar({ did, ...otherProps }: UserAvatarProps) {
  const defaultAvatarUrl = getUserAvatarSrc(did || "did:pkh:0");
  const profile = useProfileForDidOrSession(did);
  const avatarSrc = profile?.avatar || defaultAvatarUrl;
  return (
    <Image
      variant={"avatar"}
      className="us3r-User__avatar"
      src={avatarSrc}
      onError={(el: React.SyntheticEvent<HTMLImageElement, Event>) => {
        el.currentTarget.src = defaultAvatarUrl;
      }}
      {...otherProps}
    />
  );
}
