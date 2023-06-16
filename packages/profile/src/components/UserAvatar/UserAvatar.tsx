import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import { useProfileState } from "../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { UserAvatarChildren } from "./UserAvatarChildren";
import { getDefaultUserAvatarWithDid } from "../../utils/avatar";

export interface UserAvatarIncomingProps {
  /**
   * if not provided, will use the current user's did
   */
  did?: string;
}
export interface UserAvatarRenderProps {
  /**
   * Whether the user avatar is loading.
   */
  isLoading: boolean;
  /**
   * The user avatar src.
   */
  avatarSrc: string;
}
export interface UserAvatarProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLSpanElement>,
      UserAvatarRenderProps
    >,
    UserAvatarIncomingProps {}

export function UserAvatar({ children, ...props }: UserAvatarProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";
  const defaultAvatarUrl = useMemo(
    () => getDefaultUserAvatarWithDid(did),
    [did]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatarUrl);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setIsLoading(false);
        setAvatarSrc(profile?.avatar || defaultAvatarUrl);
      } else {
        setIsLoading(true);
      }
    }
  }, [isLoginUser, profileLoading, profile?.avatar, defaultAvatarUrl]);

  useEffect(() => {
    if (!isLoginUser) {
      setIsLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          if (data) {
            setAvatarSrc(data.avatar || defaultAvatarUrl);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isLoginUser, did, defaultAvatarUrl, getProfileWithDid]);

  const businessProps = {
    "data-us3r-component": "UserAvatar",
    "data-loading": isLoading || undefined,
  };
  const businessRenderProps = {
    isLoading,
    avatarSrc,
  };

  const defaultChildren = useMemo(
    () => <UserAvatarChildren {...businessRenderProps} />,
    [businessRenderProps]
  );

  return (
    <span {...businessProps} {...props}>
      {childrenRender(children, businessRenderProps, defaultChildren)}
    </span>
  );
}
