// This is an auto-generated file, do not edit manually
export const definition = {
  "models": {
    "Profile": {
      "id": "kjzl6hvfrbw6cah5z1j58emxetv28ky4hpmmmdbspnb7a2yycpi1o03e2webxrn",
      "accountRelation": { "type": "single" },
    },
  },
  "objects": {
    "Wallet": {
      "chain": {
        "type": "reference",
        "refType": "enum",
        "refName": "ChainType",
        "required": false,
      },
      "address": { "type": "string", "required": true },
      "primary": { "type": "boolean", "required": true },
    },
    "Profile": {
      "bio": { "type": "string", "required": false },
      "name": { "type": "string", "required": true },
      "tags": {
        "type": "list",
        "required": false,
        "item": { "type": "string", "required": false },
      },
      "avatar": { "type": "string", "required": false },
      "wallets": {
        "type": "list",
        "required": false,
        "item": {
          "type": "reference",
          "refType": "object",
          "refName": "Wallet",
          "required": false,
        },
      },
      "version": { "type": "view", "viewType": "documentVersion" },
    },
  },
  "enums": { "ChainType": ["EVM", "SOLANA"] },
  "accountData": { "profile": { "type": "node", "name": "Profile" } },
};
