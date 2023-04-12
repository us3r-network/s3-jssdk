export default function shortPubKey(key: string, len = 4) {
  return key.slice(0, len) + "..".repeat(len / 4) + key.slice(-len);
}
