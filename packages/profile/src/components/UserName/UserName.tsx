import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import { useProfileState } from "../../ProfileStateProvider";
import { shortDid } from "../../utils/short";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { UserNameChildren } from "./default-ui/UserNameChildren";
export interface UserNameIncomingProps {
  did?: string;
  name?: string;
}
export interface UserNameRenderProps {
  loading: boolean;
  username: string;
}
export interface UserNameProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLSpanElement>,
      UserNameRenderProps
    >,
    UserNameIncomingProps {}

export function UserName({ name, children, ...props }: UserNameProps) {
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
  const businessProps = {
    "data-us3r-username": "",
    "data-loading": loading || undefined,
  };
  const businessRenderProps = {
    loading,
    username,
  };

  const defaultChildren = useMemo(
    () => <UserNameChildren {...businessRenderProps} />,
    [businessRenderProps]
  );
  return (
    <span {...props} {...businessProps}>
      {childrenRender(children, businessRenderProps, defaultChildren)}
    </span>
  );
}
