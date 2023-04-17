import { StyledComponentPropsWithRef } from "styled-components";
import { Text } from "rebass/styled-components";
import { useMemo } from "react";
import { useProfileForDidOrSession } from "../../ProfileStateProvider";
import { shortDid } from "../../utils/short";
import { useSession } from "@us3r-network/auth";

type Props = StyledComponentPropsWithRef<"div"> & {
  did?: string;
  name?: string;
};
export default function UserName({ name, ...otherProps }: Props) {
  const session = useSession();
  const nameDid =
    (otherProps.hasOwnProperty("did") ? otherProps.did : session?.id) || "";
  const { data } = useProfileForDidOrSession(nameDid);

  const pubkey = useMemo(() => shortDid(nameDid), [nameDid]);

  return <Text {...otherProps}>{name || data?.name || pubkey}</Text>;
}
