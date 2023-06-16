import { DEFAULT_DID } from "./constants";

export function shortPubKey(key: string, len = 4) {
  return key.slice(0, len) + "..".repeat(len / 4) + key.slice(-len);
}

export function shortDid(did: string, len = 4) {
  const key = did?.split(":").pop();
  if (key) {
    return shortPubKey(key, len);
  }
  return DEFAULT_DID;
}
