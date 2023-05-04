import { HTMLAttributes, useEffect, useState } from "react";
import { useProfileState } from "../../ProfileStateProvider";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { UserInfoChildren } from "./default-ui/UserInfoChildren";
import { Profile } from "../../data-model";
import { UserInfoContext, UserInfoContextValue } from "./contexts";
import * as UserInfoElements from "./elements/UserInfo";
export interface UserInfoIncomingProps {
  did?: string;
}

export interface UserInfoProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLDivElement>,
      UserInfoContextValue
    >,
    UserInfoIncomingProps {}

function UserInfo({ children, ...props }: UserInfoProps) {
  const session = useSession();
  const { profile, profileLoading, getProfileWithDid } = useProfileState();
  const isLoginUser = !props.hasOwnProperty("did");
  const did = (isLoginUser ? session?.id : props.did) || "";

  const [loading, setLoading] = useState(true);
  const [info, setUserInfo] = useState<Profile | null>(null);

  useEffect(() => {
    if (isLoginUser) {
      if (!profileLoading) {
        setLoading(false);
        setUserInfo(profile);
      } else {
        setLoading(true);
      }
    }
  }, [isLoginUser, did, profileLoading, profile]);

  useEffect(() => {
    if (!isLoginUser) {
      setLoading(true);
      getProfileWithDid(did)
        .then((data) => {
          setUserInfo(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isLoginUser, did, getProfileWithDid]);

  const businessProps = {
    "data-us3r-userinfo": "",
    "data-loading": loading || undefined,
  };
  const contextValue = {
    did,
    isLoginUser,
    loading,
    info,
  };

  return (
    <UserInfoContext.Provider value={contextValue}>
      <div {...props} {...businessProps}>
        {childrenRender(children, contextValue, <UserInfoChildren />)}
      </div>
    </UserInfoContext.Provider>
  );
}
const _UserInfo = Object.assign(UserInfo, {
  ...UserInfoElements,
});
export { _UserInfo as UserInfo };
