# @us3r-network/model-collection

The model for the model collection

## The Model

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

## Usage

```
npm install @us3r-network/model-collection
```


### Init instance


```ts
...

import S3CollectionModel from '@us3r-network/model-collection'

const CERAMIC_HOST = process.env.CERAMIC_HOST

const s3Collection = new S3CollectionModel(CERAMIC_HOST)
...

```

### Auth the instance with did-session

```ts
const didSession = '...'
s3Collection.authComposeClient(didSession)

```

