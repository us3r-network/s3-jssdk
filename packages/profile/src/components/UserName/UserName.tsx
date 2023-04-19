import { StyledComponentPropsWithRef } from "styled-components";
import { Text } from "rebass/styled-components";
import { useEffect, useState } from "react";
import { useProfileState } from "../../ProfileStateProvider";
import { shortDid } from "../../utils/short";
import { useSession } from "@us3r-network/auth-with-rainbowkit";

type Props = StyledComponentPropsWithRef<"div"> & {
  did?: string;
  name?: string;
};
export default function UserName({ name, ...props }: Props) {
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

  return <Text {...props}>{!loading && username}</Text>;
}
