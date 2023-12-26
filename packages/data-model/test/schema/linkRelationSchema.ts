export const genRelationSchema = (
  linkModelId: string,
  voteModelId: string,
  commentModelId: string,
  scoreModelId: string,
  favorModelId: string
) => `
  type Favor 
  @loadModel(id: "${favorModelId}")
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    id: ID!
  }
  
  type Score 
    @loadModel(id: "${scoreModelId}")
    @createIndex(fields: [{ path: "value" }])
    @createIndex(fields: [{ path: "text" }])
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    id: ID!
  }
  
  type Comment
    @loadModel(id: "${commentModelId}")
    @createIndex(fields: [{ path: "text" }])
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    id: ID!
  }
  
  type Vote 
    @loadModel(id: "${voteModelId}") 
    @createIndex(fields: [{ path: "revoke" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    id: ID!
  }

  type Link
    @loadModel(id: "${linkModelId}" )
    @createIndex(fields: [{ path: "url" }])
    @createIndex(fields: [{ path: "type" }])
    @createIndex(fields: [{ path: "title" }]) 
    @createIndex(fields: [{ path: "createAt" }]) 
    @createIndex(fields: [{ path: "modifiedAt" }]) {
    votesCount: Int! @relationCountFrom(model: "Vote", property: "linkID")
    votes: [Vote]! @relationFrom(model: "Vote", property: "linkID")
    commentsCount: Int! @relationCountFrom(model: "Comment", property: "linkID")
    comments: [Comment]! @relationFrom(model: "Comment", property: "linkID")
    favorsCount: Int! @relationCountFrom(model: "Favor", property: "linkID")
    favors: [Favor]! @relationFrom(model: "Favor", property: "linkID")
    scoresCount: Int! @relationCountFrom(model: "Score", property: "linkID")
    scores: [Score]! @relationFrom(model: "Score", property: "linkID")
  }
`;
