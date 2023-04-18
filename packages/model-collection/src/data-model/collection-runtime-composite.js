// This is an auto-generated file, do not edit manually
export const definition = {
  "models": {
    "ModelCollection": {
      "id": "kjzl6hvfrbw6ca858e5ozptovebwts1bpq9vw8hzdqk5oi2y18g8u0fq1dxavrf",
      "accountRelation": { "type": "list" },
    },
  },
  "objects": {
    "ModelCollection": {
      "notes": { "type": "string", "required": false },
      "revoke": { "type": "boolean", "required": false },
      "modelID": { "type": "streamid", "required": true },
      "createAt": { "type": "datetime", "required": false },
      "modifiedAt": { "type": "datetime", "required": false },
      "creator": { "type": "view", "viewType": "documentAccount" },
      "version": { "type": "view", "viewType": "documentVersion" },
    },
  },
  "enums": {},
  "accountData": {
    "modelCollectionList": { "type": "connection", "name": "ModelCollection" },
  },
};
