import { HTMLAttributes, useEffect, useState } from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import UserTagsElements from "./UserTagsElements";
import { UserTagsContext, UserTagsContextValue } from "./UserTagsContext";
import { UserTagsDefaultChildren } from "./UserTagsDefaultChildren";
import { useSession } from "@us3r-network/auth-with-rainbowkit";

export interface UserTagsIncomingProps {
  /**
   * user did.
   * if not provided, will use current login user's did.
   */
  did?: string;
}

export interface UserTagsProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      UserTagsContextValue
    >,
    UserTagsIncomingProps {}

function UserTagsRoot({ children, ...props }: UserTagsProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";

  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setIsLoading(false);
        setTags(profile?.tags || []);
      } else {
        setIsLoading(true);
      }
    }
  }, [isLoginUser, did, profileLoading, profile?.tags]);

  useEffect(() => {
    if (!isLoginUser) {
      setIsLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          setTags(data?.tags || []);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isLoginUser, did, getProfileWithDid]);

  const businessProps = {
    "data-us3r-component": "UserTags",
    "data-loading": isLoading || undefined,
  };
  const contextValue = {
    did,
    isLoginUser,
    isLoading,
    tags,
  };
  return (
    <div {...businessProps} {...props}>
      <UserTagsContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <UserTagsDefaultChildren />)}
      </UserTagsContext.Provider>
    </div>
  );
}

export const UserTags = Object.assign(UserTagsRoot, {
  ...UserTagsElements,
});
