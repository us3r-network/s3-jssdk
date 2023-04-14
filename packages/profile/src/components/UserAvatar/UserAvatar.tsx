import React from "react";
import { StyledComponentPropsWithRef } from "styled-components";
import multiavatar from "@multiavatar/multiavatar";
import { Image } from "rebass/styled-components";
import { useProfileForDidOrSession } from "../ProfileProvider/ProfileStateContext";
import { useSession } from "../ProfileProvider/AuthenticationContext";

type UserAvatarProps = StyledComponentPropsWithRef<"img"> & {
  did?: string;
};
const getUserAvatarSrc = (did: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(did))}`;

export default function UserAvatar(props: UserAvatarProps) {
  const session = useSession();
  const avatarDid =
    (props.hasOwnProperty("did") ? props.did : session?.id) || "";
  const defaultAvatarUrl = getUserAvatarSrc(avatarDid || "did:pkh:0");

  const profile = useProfileForDidOrSession(avatarDid);
  const avatarSrc = profile?.avatar || defaultAvatarUrl;
  return (
    <Image
      variant={"avatar"}
      src={avatarSrc}
      onError={(el: React.SyntheticEvent<HTMLImageElement, Event>) => {
        el.currentTarget.src = defaultAvatarUrl;
      }}
      {...props}
    />
  );
}
