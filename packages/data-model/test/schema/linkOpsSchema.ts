/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-08 14:25:32
 * @FilePath: /s3-jssdk/packages/data-model/test/schema/linkOpsSchema.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const genLinkOpsSchema = (linkModelId: string) => `
  type Link 
  @loadModel(id: "${linkModelId}")  
  @createIndex(fields: [{ path: "url" }])
  @createIndex(fields: [{ path: "type" }])
  @createIndex(fields: [{ path: "title" }]) 
  @createIndex(fields: [{ path: "createAt" }]) 
  @createIndex(fields: [{ path: "modifiedAt" }]) {
    id: ID!
  }
  
  type Comment 
    @createModel(accountRelation: LIST, description: "Comment on a link of us3r.network")
    @createIndex(fields: [{ path: "text" }])
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
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
  
  type Vote
    @createModel(accountRelation: LIST, description: "Vote on a link of us3r.network") 
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    linkID: StreamID! @documentReference(model: "Link")
    link: Link @relationDocument(property: "linkID")
    type: VoteType!
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
  
  type Favor 
    @createModel(accountRelation: LIST, description: "Favor on a link of us3r.network") 
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    creator: DID! @documentAccount
    version: CommitID! @documentVersion
    linkID: StreamID! @documentReference(model: "Link")
    link: Link @relationDocument(property: "linkID")
    revoke: Boolean
    createAt: DateTime
    modifiedAt: DateTime
  }
  
  type Score 
    @createModel(accountRelation: LIST, description: "Score on a link of us3r.network") 
    @createIndex(fields: [{ path: "value" }])
    @createIndex(fields: [{ path: "text" }])
    @createIndex(fields: [{ path: "revoke" }])
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
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
