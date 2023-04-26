import { HTMLAttributes, useEffect, useState } from "react";
import { useProfileState } from "../../ProfileStateProvider";
import { shortDid } from "../../utils/short";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { RenderProps, useRenderProps } from "../../utils/props";
export interface UserNameIncomingProps {
  did?: string;
  name?: string;
}
export interface UserNameRenderProps {
  loading: boolean;
  username: string;
}
export interface UserNameProps
  extends Omit<
      HTMLAttributes<HTMLSpanElement>,
      "children" | "style" | "className"
    >,
    RenderProps<UserNameRenderProps>,
    UserNameIncomingProps {}

export function UserName({ name, ...props }: UserNameProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (name) {
      setUsername(name);
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    if (name) return;
    if (isLoginUser) {
      if (!profileLoading) {
        setLoading(false);
        setUsername(profile?.name || shortDid(did));
      } else {
        setLoading(true);
      }
    }
  }, [name, isLoginUser, did, profileLoading, profile]);

  useEffect(() => {
    if (name) return;
    if (!isLoginUser) {
      setLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          setUsername(data?.name || shortDid(did));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [name, isLoginUser, did, getProfileWithDid]);

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
    username,
  };

  //
  const renderProps = useRenderProps({
    ...props,
    values: { ...baseRenderProps, ...businessRenderProps },
  });

  return <span {...baseProps} {...businessProps} {...renderProps} />;
}
