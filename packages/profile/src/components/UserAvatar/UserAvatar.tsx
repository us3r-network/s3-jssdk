import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import multiavatar from "@multiavatar/multiavatar";
import { useProfileState } from "../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { DEFAULT_DID } from "../../utils/constants";
import { RenderProps, useRenderProps } from "../../utils/props";

export interface UserAvatarIncomingProps {
  did?: string;
}
export interface UserAvatarRenderProps {
  loading: boolean;
  avatarSrc: string;
}
export interface UserAvatarProps
  extends Omit<
      HTMLAttributes<HTMLSpanElement>,
      "children" | "style" | "className"
    >,
    RenderProps<UserAvatarRenderProps>,
    UserAvatarIncomingProps {}

const getUserAvatarSrc = (did: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(multiavatar(did))}`;

export function UserAvatar({ ...props }: UserAvatarProps) {
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

  // TODO: Use react-aria to complete cross-platform barrier-free interaction
  const baseProps = {
    ...props,
  };

  // The business state that the component cares about
  const businessProps = {
    "data-loading": loading || undefined,
  };

  // Subcomponent rendering function and props used
  const baseRenderProps = {};
  const businessRenderProps = {
    loading,
    avatarSrc,
  };

  //
  const renderProps = useRenderProps({
    ...props,
    values: { ...baseRenderProps, ...businessRenderProps },
  });

  return <span {...baseProps} {...businessProps} {...renderProps} />;
}
