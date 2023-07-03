# @us3r-network/data-model

## Base model

Basic model for communicating with Ceramic. This model defines the `authComposeClient` method for ComposeClient authorization.

## Profile Model

```gql
enum ChainType {
  EVM
  SOLANA
}

type Wallet {
  chain: ChainType!
  address: String! @string(minLength: 20, maxLength: 60)
  primary: Boolean!
}

type Profile @createModel(
    accountRelation: SINGLE,
    description: "profile for us3r-network"
) {
  version: CommitID! @documentVersion
  name: String! @string(minLength: 3, maxLength: 100)
  bio: String @string(minLength: 3, maxLength: 200)
  avatar: String @string(maxLength: 1000)
  tags: [String!] @string(maxLength: 60) @list(maxLength:20)
  wallets: [Wallet!] @list(maxLength:20)
}
```

## ModelCollection Model

```gql
type ModelCollection @createModel(accountRelation: LIST, description: "model collection of someone in us3r.network") {
  creator: DID! @documentAccount
  version: CommitID! @documentVersion
  modelID: StreamID!
  notes: String @string(maxLength: 1000)
  revoke: Boolean
  createAt: DateTime
  modifiedAt: DateTime
}
```

## Dapp Model

```gql
type SocialLink {
  platform: String! @string(minLength: 1, maxLength: 60)
  url: URI!
}

type Dapp @createModel(
  accountRelation: LIST,
  description: "s3 dapp for us3r-network"
) {
  version: CommitID! @documentVersion
  name: String! @string(minLength: 3, maxLength: 100)
  description: String @string(minLength: 3, maxLength: 200)
  icon: URI
  url: URI
  tags: [String!] @string(maxLength: 60) @list(maxLength:20)
  socialLink: [SocialLink!] @list(maxLength:20)
  models: [StreamID!] @list(maxLength:100)
}
```

## Link Model

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

## Link Ops Model

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

## Link Relation Model

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
npm install @us3r-network/data-model
```

## Usage

### Init Profile instance

```ts
...

import {S3ProfileModel} from '@us3r-network/data-model'

const CERAMIC_HOST = process.env.CERAMIC_HOST

const s3Profile = new S3ProfileModel(CERAMIC_HOST)
...

```

### Auth Profile instance with did-session

```ts
const didSession = '...'
s3Profile.authComposeClient(didSession)

```

### S3Profile Read & Write

after authorization, the profile can write with method

```ts

...
await s3Profile.mutationPersonalProfile(/** {...profile} */)
...

```

and read the profile with

```ts
...
await s3Profile.queryPersonalProfile()
...
```

or get others profile with a did

```ts
...
await s3Profile.queryProfileWithDid(/** did */)
...
```

# Use With Nestjs

```ts
 ...
 @Get()
  async getHello(): Promise<string> {
    const { S3LinkModel } = await import('@us3r-network/data-model');
    const s3link = new S3LinkModel('https://ceramic-testnet.s3.xyz');
    console.log(s3link);
    return this.appService.getHello();
  }
  ...
```
