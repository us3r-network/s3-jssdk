import React, { useEffect, useMemo, useState } from "react";
import { StyledComponentPropsWithRef } from "styled-components";
import multiavatar from "@multiavatar/multiavatar";
import { Image } from "rebass/styled-components";
import { useProfileState } from "../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import AvatarLoadingSvg from "./avatar-loading.svg";

type UserAvatarProps = StyledComponentPropsWithRef<"img"> & {
  did?: string;
};
const getUserAvatarSrc = (did: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(did))}`;

export default function UserAvatar(props: UserAvatarProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";
  const defaultAvatarUrl = useMemo(
    () => getUserAvatarSrc(did || "did:pkh:0"),
    [did]
  );
  const [loading, setLoading] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatarUrl);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setLoading(false);
        setAvatarSrc(profile?.avatar || defaultAvatarUrl);
      } else {
        setLoading(true);
      }
    }
  }, [isLoginUser, profileLoading, profile, defaultAvatarUrl]);

  useEffect(() => {
    if (!isLoginUser) {
      setLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          if (data) {
            setAvatarSrc(data.avatar || defaultAvatarUrl);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isLoginUser, did, defaultAvatarUrl, getProfileWithDid]);

  return (
    <Image
      variant={"avatar"}
      src={loading ? AvatarLoadingSvg : avatarSrc}
      onError={(el: React.SyntheticEvent<HTMLImageElement, Event>) => {
        el.currentTarget.src = defaultAvatarUrl;
      }}
      {...props}
    />
  );
}
