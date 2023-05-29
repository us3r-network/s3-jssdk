export const genLinkOpsSchema = (linkModelId: string) => `
  type Link @loadModel(id: "${linkModelId}") {
    id: ID!
  }
  
  type Comment @createModel(accountRelation: LIST, description: "Comment on a link of us3r.network") {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    linkID: StreamID! @documentReference(model: "Link")
    link: Link @relationDocument(property: "linkID")
    text: String! @string(maxLength: 2000)
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
  
  enum VoteType {
    UP_VOTE
    DOWN_VOTE
  }
  
  type Vote @createModel(accountRelation: LIST, description: "Vote on a link of us3r.network") {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    linkID: StreamID! @documentReference(model: "Link")
    link: Link @relationDocument(property: "linkID")
    type: VoteType!
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
  
  type Favor @createModel(accountRelation: LIST, description: "Favor on a link of us3r.network") {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    linkID: StreamID! @documentReference(model: "Link")
    link: Link @relationDocument(property: "linkID")
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
  
  type Score @createModel(accountRelation: LIST, description: "Score on a link of us3r.network") {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    linkID: StreamID! @documentReference(model: "Link")
    link: Link @relationDocument(property: "linkID")
    text: String! @string(maxLength: 2000)
    value: Int!
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
`;
