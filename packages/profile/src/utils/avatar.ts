import multiavatar from "@multiavatar/multiavatar";
import { DEFAULT_DID } from "./constants";

export const getDefaultUserAvatarWithDid = (did?: string) =>
  `data:image/svg+xml;utf-8,${encodeURIComponent(
    multiavatar(did || DEFAULT_DID)
  )}`;
