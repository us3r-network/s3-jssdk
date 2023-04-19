# @us3r-network/profile

The model defines the profile for the web3 user.

## Profile Model

profile.gql

```gql
enum ChainType {
  EVM
  SOLANA
}

type Wallet
{
  chain: ChainType!
  address: String! @string(minLength: 20, maxLength: 60)
  primary: Boolean!
}

type Profile
  @createModel(
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


## Install

```
npm install @us3r-network/profile
```

## Usage

### Init Profile instance

```ts
...

import S3ProfileModel from '@us3r-network/profile'

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

