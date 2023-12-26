export const linkSchema = `
type Link 
  @createModel(accountRelation: LIST, description: "Links in us3r-network")
  @createIndex(fields: [{ path: "url" }])
  @createIndex(fields: [{ path: "type" }])
  @createIndex(fields: [{ path: "title" }]) 
  @createIndex(fields: [{ path: "createAt" }]) 
  @createIndex(fields: [{ path: "modifiedAt" }]) {
  creator: DID! @documentAccount
  version: CommitID! @documentVersion
  type: String! @string(maxLength: 100)
  url: URI!
  title: String! @string(maxLength: 200)
  data: String @string(maxLength: 100000)
  createAt: DateTime
  modifiedAt: DateTime
}`;
