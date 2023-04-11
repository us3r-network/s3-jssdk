# @us3r-network/data-model-profile

## Usage

### Init Profile instance

```ts
...

import S3ProfileModel from '@us3r-network/data-model-profile'

const CERAMIC_HOST = process.env.CERAMIC_HOST

const s3Profile = new S3ProfileModel(CERAMIC_HOST)
...

```

### Auth Profile instance with did-session

```ts
const didSession = '...'
s3Profile.authModelWithSess(didSession)

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

