export const genRelationSchema = (
  linkModelId: string,
  voteModelId: string,
  commentModelId: string,
  scoreModelId: string,
  favorModelId: string
) => `
  type Favor @loadModel(id: "${favorModelId}") {
    id: ID!
  }
  
  type Score @loadModel(id: "${scoreModelId}") {
    id: ID!
  }
  
  type Comment @loadModel(id: "${commentModelId}") {
    id: ID!
  }
  
  type Vote @loadModel(id: "${voteModelId}") {
    id: ID!
  }
  type Link @loadModel(id: "${linkModelId}" ) {
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
