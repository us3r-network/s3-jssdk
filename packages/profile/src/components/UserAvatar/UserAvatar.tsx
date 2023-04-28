import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import multiavatar from "@multiavatar/multiavatar";
import { useProfileState } from "../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { DEFAULT_DID } from "../../utils/constants";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { UserAvatarChildren } from "./default-ui/UserAvatarChildren";

export interface UserAvatarIncomingProps {
  did?: string;
}
export interface UserAvatarRenderProps {
  loading: boolean;
  avatarSrc: string;
}
export interface UserAvatarProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLSpanElement>,
      UserAvatarRenderProps
    >,
    UserAvatarIncomingProps {}

const getUserAvatarSrc = (did: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(did))}`;

export function UserAvatar({ children, ...props }: UserAvatarProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";
  const defaultAvatarUrl = useMemo(
    () => getUserAvatarSrc(did || DEFAULT_DID),
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

  const businessProps = {
    "data-us3r-useravatar": "",
    "data-loading": loading || undefined,
  };
  const businessRenderProps = {
    loading,
    avatarSrc,
  };

  const defaultChildren = useMemo(
    () => <UserAvatarChildren {...businessRenderProps} />,
    [businessRenderProps]
  );

  return (
    <span {...props} {...businessProps}>
      {childrenRender(children, businessRenderProps, defaultChildren)}
    </span>
  );
}
