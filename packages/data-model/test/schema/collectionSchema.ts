export const collectionSchema = `
  type ModelCollection @createModel(accountRelation: LIST, description: "model collection of someone in us3r.network") {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    modelID: StreamID!
    notes: String @string(maxLength: 1000)
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
`;
