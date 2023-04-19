# @us3r-network/link

The model defines the relationship of the link and the comment, favor, vote, score.

## Usage

```
npm install @us3r-network/link
```

## The Model

link.gql

```gql
type Link @createModel(accountRelation: LIST, description: "Links in us3r-network") {
  creator: DID! @documentAccount
  version: CommitID! @documentVersion
  type: String! @string(maxLength: 100)
  url: URI!
  title: String! @string(maxLength: 200)
  data: String @string(maxLength: 100000)
  createAt: DateTime
  modifiedAt: DateTime
}
```

comment, vote, favor 
```gql
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
```

relation.gql

```gql
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
```

## Install 

```
npm install @us3r-network/link
```

## Usage 

### Init instance


```ts
...

import S3LinkModel from '@us3r-network/link'

const CERAMIC_HOST = process.env.CERAMIC_HOST

const s3Link = new S3Link(CERAMIC_HOST)
...

```

### Auth the instance with did-session

```ts
const didSession = '...'
s3Link.authComposeClient(didSession)

```

### The link Ops

**Create**

```ts
...
  const resp = await s3Link.createLink({
    url: 'https://scan.s3.xyz/',
    type: 's3',
    title: 'The scan of the us3r network',
  });

  const linkId = resp.data?.createLink.document.id
...
```

**Update**

```ts
...
  const resp = await s3Link.updateLink(linkId, {
    type: testUpdateType,
    url: testURL,
    title: testTitle,
  });
...
```

**Create a comment on one link**

```ts
...
  const resp = await s3Link.createComment({
    linkID: linkId,
    text: "string",
  });
...
```

**Create a vote on one link**

```ts
...
  const resp = await s3Link.createVote({
    linkID: linkId,
    type: "UP_VOTE",
  });
...
```

**Create a favor on one link**

```ts
...
  const resp = await s3Link.createFavor({
    linkID: linkId,
    revoke: false,
  });
...
```

**Create a score on one link**

```ts
...
  const resp = await s3Link.createScore({
    linkID: linkId,
    text: "string",
    value: 10,
  });
...
```

Every model have the personal-xxx method for get the personals data

**The list**

```ts
...

// link
const resp = await s3Link.queryPersonalLinks({ first: 10 });
const linkList = resp.data?.viewer.linkList;
...

// comment
const resp = await s3Link.queryPersonalComments({ first: 10 });
const commentList = resp.data?.viewer.commentList;
...

// score
const resp = await s3Link.queryPersonalScores({ first: 10 });
const scoreList = resp.data?.viewer.scoreList;
...

// vote
const resp = await s3Link.queryPersonalVotes({ first: 10 });
const voteList = resp.data?.viewer.voteList;
...

// favor
const resp = await s3Link.queryPersonalFavors({ first: 10 });
const favorList = resp.data?.viewer.favorList;
...
```

the first param up to 1000 records can be fetched at a time.

**The comment list**

