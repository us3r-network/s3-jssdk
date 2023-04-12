import { StyledComponentPropsWithRef } from "styled-components";
import { Text } from "rebass/styled-components";
import { useMemo } from "react";
import { useProfileForDidOrSession } from "../ProfileProvider/ProfileStateContext";
import shortPubKey from "../../utils/shortPubKey";

type Props = StyledComponentPropsWithRef<"div"> & {
  did: string;
  name?: string;
};
export default function UserName({ did, name, ...otherProps }: Props) {
  const profile = useProfileForDidOrSession(did);

  const pubkey = useMemo(() => {
    const key = did.split(":").pop();
    if (key) {
      return shortPubKey(key);
    }
    return "did:pkh:0";
  }, [did]);

  return <Text {...otherProps}>{name || profile?.name || pubkey}</Text>;
}
