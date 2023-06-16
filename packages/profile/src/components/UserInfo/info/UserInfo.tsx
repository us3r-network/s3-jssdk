import { HTMLAttributes, useEffect, useState } from "react";
import { useProfileState } from "../../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { Profile } from "@us3r-network/data-model";
import UserInfoElements from "./UserInfoElements";
import { UserInfoContext, UserInfoContextValue } from "./UserInfoContext";
import { UserInfoDefaultChildren } from "./UserInfoDefaultChildren";
import type { AvatarUploadOpts } from "../edit-form";
export interface UserInfoIncomingProps<T> {
  /**
   * user did.
   * if not provided, will use current user's did.
   */
  did?: string;
  /**
   * avatar upload options
   */
  avatarUploadOpts?: AvatarUploadOpts<T>;
}

export interface UserInfoProps<T>
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      UserInfoContextValue<T>
    >,
    UserInfoIncomingProps<T> {}

function UserInfoRoot<T>({
  avatarUploadOpts,
  children,
  ...props
}: UserInfoProps<T>) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";

  const [isLoading, setIsLoading] = useState(true);
  const [info, setUserInfo] = useState<Profile | null>(null);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setIsLoading(false);
        setUserInfo(profile);
      } else {
        setIsLoading(true);
      }
    }
  }, [isLoginUser, did, profileLoading, profile]);

  useEffect(() => {
    if (!isLoginUser) {
      setIsLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          setUserInfo(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isLoginUser, did, getProfileWithDid]);

  const businessProps = {
    "data-us3r-component": "UserInfo",
    "data-loading": isLoading || undefined,
  };
  const contextValue = {
    did,
    isLoginUser,
    isLoading,
    info,
    avatarUploadOpts,
  };

  return (
    <div {...businessProps} {...props}>
      <UserInfoContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <UserInfoDefaultChildren />)}
      </UserInfoContext.Provider>
    </div>
  );
}
export const UserInfo = Object.assign(UserInfoRoot, {
  ...UserInfoElements,
});
