import { HTMLAttributes, useEffect, useState } from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as UserTagsElements from "./UserTagsElements";
import { UserTagsContext, UserTagsContextValue } from "./UserTagsContext";
import { UserTagsDefaultChildren } from "./UserTagsDefaultChildren";
import { useSession } from "@us3r-network/auth-with-rainbowkit";

export interface UserTagsIncomingProps {
  did?: string;
}

export interface UserTagsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserTagsContextValue
    >,
    UserTagsIncomingProps {}

function UserTags({ children, ...props }: UserTagsProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";

  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setLoading(false);
        setTags(profile?.tags || []);
      } else {
        setLoading(true);
      }
    }
  }, [isLoginUser, did, profileLoading, profile?.tags]);

  useEffect(() => {
    if (!isLoginUser) {
      setLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          setTags(data?.tags || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isLoginUser, did, getProfileWithDid]);

  const businessProps = {
    "data-us3r-usertags": "",
    "data-loading": loading || undefined,
  };
  const contextValue = {
    did,
    isLoginUser,
    loading,
    tags,
  };
  return (
    <form {...props} {...businessProps}>
      <UserTagsContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <UserTagsDefaultChildren />)}
      </UserTagsContext.Provider>
    </form>
  );
}

const _UserTags = Object.assign(UserTags, {
  ...UserTagsElements,
});
export { _UserTags as UserTags };
