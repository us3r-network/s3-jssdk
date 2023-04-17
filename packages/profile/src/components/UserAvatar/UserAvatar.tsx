import React, { useEffect, useMemo, useState } from "react";
import { StyledComponentPropsWithRef } from "styled-components";
import multiavatar from "@multiavatar/multiavatar";
import { Image } from "rebass/styled-components";
import { useProfileForDidOrSession } from "../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import AvatarLoadingSvg from "./avatar-loading.svg";

type UserAvatarProps = StyledComponentPropsWithRef<"img"> & {
  did?: string;
};
const getUserAvatarSrc = (did: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(did))}`;

export default function UserAvatar(props: UserAvatarProps) {
  const session = useSession();
  const isLoginUserAvatar =
    !props.hasOwnProperty("did") || props.did === session?.id;
  const avatarDid = (isLoginUserAvatar ? session?.id : props.did) || "";
  const defaultAvatarUrl = useMemo(
    () => getUserAvatarSrc(avatarDid || "did:pkh:0"),
    [avatarDid]
  );
  const { data, loading } = useProfileForDidOrSession(avatarDid);

  const avatarSrc = useMemo(
    () => (loading ? AvatarLoadingSvg : data?.avatar || defaultAvatarUrl),
    [loading, data, defaultAvatarUrl]
  );

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
